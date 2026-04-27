import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolRoot = path.resolve(__dirname, "..");
const sensitivePattern =
  /(password|passcode|secret|token|tax|ein|ssn|social security|bank|routing|account number|credit card|card number|cvv|cvc|passport|driver.?s license|government id|date of birth|dob)/i;

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function loadConfig() {
  const configPath = getArg("--config");
  if (!configPath) {
    return {
      targets: [],
      browser: {
        userDataDir: ".browser-profile",
        headless: false,
      },
    };
  }

  const absolutePath = path.resolve(process.cwd(), configPath);
  return JSON.parse(await fs.readFile(absolutePath, "utf8"));
}

function chooseTarget(config) {
  const urlArg = getArg("--url");
  if (urlArg) {
    return {
      name: slugify(urlArg),
      url: urlArg,
      prefill: {
        enabled: false,
        values: {},
      },
    };
  }

  const targetName = getArg("--target");
  const targets = config.targets || [];

  if (targetName) {
    const target = targets.find((item) => item.name === targetName);
    if (!target) {
      throw new Error(`No target named "${targetName}" found in config.`);
    }
    return target;
  }

  if (!targets[0]) {
    throw new Error("No target configured. Add one to config.local.json or pass --url.");
  }

  return targets[0];
}

async function extractFormData(page) {
  return page.evaluate(() => {
    function isVisible(element) {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
    }

    function textFromLabel(element) {
      const id = element.getAttribute("id");
      if (id) {
        const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
        if (label?.textContent?.trim()) return label.textContent.trim();
      }

      const wrappingLabel = element.closest("label");
      if (wrappingLabel?.textContent?.trim()) return wrappingLabel.textContent.trim();

      const ariaLabel = element.getAttribute("aria-label");
      if (ariaLabel) return ariaLabel;

      const labelledBy = element.getAttribute("aria-labelledby");
      if (labelledBy) {
        const text = labelledBy
          .split(/\s+/)
          .map((labelId) => document.getElementById(labelId)?.textContent?.trim())
          .filter(Boolean)
          .join(" ");
        if (text) return text;
      }

      const placeholder = element.getAttribute("placeholder");
      if (placeholder) return placeholder;

      const nearby = element.closest("div, p, section, fieldset")?.textContent?.trim();
      if (nearby && nearby.length < 180) return nearby;

      return element.getAttribute("name") || element.getAttribute("id") || "Unlabeled field";
    }

    const fields = Array.from(document.querySelectorAll("input, textarea, select"))
      .filter((element) => isVisible(element))
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        type: element.getAttribute("type") || element.tagName.toLowerCase(),
        label: textFromLabel(element),
        name: element.getAttribute("name") || "",
        id: element.getAttribute("id") || "",
        placeholder: element.getAttribute("placeholder") || "",
        required: element.hasAttribute("required"),
        value: element.value || "",
      }));

    const buttons = Array.from(document.querySelectorAll("button, input[type='submit'], input[type='button'], a"))
      .filter((element) => isVisible(element))
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        type: element.getAttribute("type") || "",
        text: element.textContent?.trim() || element.getAttribute("value") || element.getAttribute("aria-label") || "",
      }))
      .filter((button) => button.text);

    return {
      title: document.title,
      fields,
      buttons,
    };
  });
}

async function prefillSafeFields(page, values) {
  const entries = Object.entries(values || {});
  const skipped = [];
  const filled = [];

  for (const [key, value] of entries) {
    if (sensitivePattern.test(key) || sensitivePattern.test(String(value))) {
      skipped.push({ key, reason: "Sensitive-looking key or value" });
      continue;
    }

    const result = await page.evaluate(
      ({ key, value, sensitivePatternSource }) => {
        const sensitiveRegex = new RegExp(sensitivePatternSource, "i");

        function isVisible(element) {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
        }

        function labelFor(element) {
          const id = element.getAttribute("id");
          const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
          return [
            label?.textContent || "",
            element.closest("label")?.textContent || "",
            element.getAttribute("aria-label") || "",
            element.getAttribute("placeholder") || "",
            element.getAttribute("name") || "",
            element.getAttribute("id") || "",
          ]
            .join(" ")
            .trim();
        }

        const normalizedKey = key.toLowerCase();
        const candidates = Array.from(document.querySelectorAll("input, textarea"))
          .filter((element) => isVisible(element))
          .filter((element) => {
            const type = (element.getAttribute("type") || "text").toLowerCase();
            return ["text", "email", "url", "tel", "search"].includes(type) || element.tagName.toLowerCase() === "textarea";
          });

        for (const element of candidates) {
          const label = labelFor(element);
          if (sensitiveRegex.test(label)) continue;
          if (!label.toLowerCase().includes(normalizedKey)) continue;

          element.focus();
          element.value = String(value);
          element.dispatchEvent(new Event("input", { bubbles: true }));
          element.dispatchEvent(new Event("change", { bubbles: true }));
          return { filled: true, label };
        }

        return { filled: false };
      },
      {
        key,
        value,
        sensitivePatternSource: sensitivePattern.source,
      }
    );

    if (result.filled) filled.push({ key, label: result.label });
    else skipped.push({ key, reason: "No safe visible matching field found" });
  }

  return { filled, skipped };
}

function toMarkdown({ target, formData, prefillResult }) {
  const rows = formData.fields
    .map(
      (field) =>
        `| ${field.label.replace(/\|/g, "\\|")} | ${field.tag} | ${field.type} | ${field.required ? "yes" : "no"} | ${
          field.name || field.id || ""
        } |`
    )
    .join("\n");

  const buttons = formData.buttons.map((button) => `- ${button.text} (${button.tag}${button.type ? `/${button.type}` : ""})`).join("\n");
  const filled = prefillResult.filled.map((item) => `- ${item.key} -> ${item.label}`).join("\n") || "- none";
  const skipped = prefillResult.skipped.map((item) => `- ${item.key}: ${item.reason}`).join("\n") || "- none";

  return `# Browser Form Assistant Report

Target: ${target.name}

URL: ${target.url}

Page title: ${formData.title || "Untitled"}

Generated: ${new Date().toISOString()}

## Safety Notes

- No final submit buttons were clicked.
- Sensitive fields are intentionally skipped.
- Review all fields manually before taking action.

## Visible Fields

| Label / Question | Element | Type | Required | Name / ID |
| --- | --- | --- | --- | --- |
${rows || "| No visible fields detected |  |  |  |  |"}

## Visible Buttons / Links

${buttons || "- none detected"}

## Prefill Summary

Prefill enabled: ${target.prefill?.enabled ? "yes" : "no"}

Filled:

${filled}

Skipped:

${skipped}
`;
}

async function main() {
  const config = await loadConfig();
  const target = chooseTarget(config);
  const userDataDir = path.resolve(toolRoot, config.browser?.userDataDir || ".browser-profile");
  const outputDir = path.resolve(toolRoot, "outputs");

  await fs.mkdir(outputDir, { recursive: true });

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: config.browser?.headless ?? false,
  });

  const page = context.pages()[0] || (await context.newPage());
  await page.goto(target.url, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => undefined);

  const formData = await extractFormData(page);
  const prefillResult = target.prefill?.enabled ? await prefillSafeFields(page, target.prefill.values) : { filled: [], skipped: [] };
  const markdown = toMarkdown({ target, formData, prefillResult });
  const filename = `${new Date().toISOString().replace(/[:.]/g, "-")}-${slugify(target.name || target.url)}.md`;
  const outputPath = path.join(outputDir, filename);

  await fs.writeFile(outputPath, markdown, "utf8");
  console.log(`Saved report: ${outputPath}`);
  console.log("Browser remains open for supervised review. Press Ctrl+C to stop, or close the browser window.");

  await new Promise(() => {});
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
