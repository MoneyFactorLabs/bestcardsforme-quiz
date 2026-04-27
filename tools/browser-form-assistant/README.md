# MoneyFactor Browser Form Assistant

Internal founder utility for supervised browser tasks such as affiliate application field harvesting and non-sensitive form prep.

This is not part of the public BestCardsForMe app. It is a local Playwright helper that opens a browser, keeps a persistent session, extracts visible form labels/questions, and saves a markdown report.

## Recommended Approach

Use Playwright for this job.

Why:

- local and deterministic
- persistent browser profile for logged-in sessions
- easy to inspect before any action
- no third-party automation vendor
- simple enough to audit

Browser Use and Stagehand are useful for higher-level agent workflows, but for affiliate field harvesting and supervised form prep, Playwright is the safest lightweight starting point.

## Safety Rules

- Do not store passwords in this repo or in config files.
- Do not store tax IDs, EINs, SSNs, banking details, routing numbers, card numbers, or government IDs in config files.
- The assistant never clicks final submit buttons.
- The assistant only pre-fills non-sensitive text-like fields.
- Review every page manually before taking any action.
- Keep `config.local.json`, `.browser-profile/`, and generated outputs out of git.

## Install

From the tool folder:

```bash
cd tools/browser-form-assistant
npm install
npx playwright install chromium
```

## Configure Targets

Copy the example config:

```bash
cp config.example.json config.local.json
```

Edit `config.local.json`:

- Add target URLs under `targets`.
- Keep `prefill.enabled` as `false` unless you want supervised non-sensitive prefill.
- Only add generic business/contact fields such as company name, website, or public contact email.

## Run

Run the first target from `config.local.json`:

```bash
npm run harvest -- --config config.local.json
```

Run a specific target by name:

```bash
npm run harvest -- --config config.local.json --target "Example affiliate form"
```

Run an ad hoc URL without prefill:

```bash
npm run harvest -- --url "https://example.com/application"
```

## Outputs

Markdown reports are saved to:

```text
tools/browser-form-assistant/outputs/
```

Each report includes:

- target URL
- timestamp
- detected visible form fields
- detected buttons
- whether prefill was enabled
- skipped sensitive fields

## Persistent Browser Session

The browser profile is stored locally at:

```text
tools/browser-form-assistant/.browser-profile/
```

This lets Tim reuse browser sessions. The profile folder is gitignored.

## Stop It

Close the browser window or press:

```text
Ctrl+C
```

in the terminal.
