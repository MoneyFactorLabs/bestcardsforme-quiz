// Google Search Console performance data, normalized from the exports people
// actually have: the Search Console UI export (Queries.csv / Pages.csv, single
// period or "Compare" mode), a long-format export (Windsor.ai or the API: one
// row per date and page/query), or the minimal page,impressions,previous_impressions
// format. Nothing here calls Google; data arrives as files.

export type GscDimension = "query" | "page";

export type GscMetrics = {
  clicks: number;
  impressions: number;
  // Average position, impression-weighted when rows are combined.
  position: number | null;
};

export type GscRow = {
  dimension: GscDimension;
  // Query text, or page path (origin stripped) for pages.
  key: string;
  current: GscMetrics | null;
  previous: GscMetrics | null;
};

export type GscDataset = {
  rows: GscRow[];
  currentRange?: string;
  previousRange?: string;
  notes: string[];
};

// Below this many impressions in a period, changes are noise, not signal.
export const LOW_VOLUME_IMPRESSIONS = 20;

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const input = text.replace(/^﻿/, "");
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  return rows;
}

const number = (value: string | undefined) => {
  if (value === undefined || value.trim() === "" || value.trim() === "-") return null;
  const parsed = Number(value.replace(/[%,]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

export function pagePath(value: string) {
  try {
    const url = new URL(value);
    return url.pathname.replace(/\/$/, "") || "/";
  } catch {
    return value.replace(/\/$/, "") || "/";
  }
}

function metrics(clicks: string | undefined, impressions: string | undefined, position: string | undefined): GscMetrics | null {
  const parsedImpressions = number(impressions);
  if (parsedImpressions === null) return null;
  return { clicks: number(clicks) ?? 0, impressions: parsedImpressions, position: number(position) };
}

function combine(list: GscMetrics[]): GscMetrics {
  const impressions = list.reduce((sum, item) => sum + item.impressions, 0);
  const weighted = list.filter((item) => item.position !== null);
  const weight = weighted.reduce((sum, item) => sum + item.impressions, 0);
  return {
    clicks: list.reduce((sum, item) => sum + item.clicks, 0),
    impressions,
    position: weight > 0 ? weighted.reduce((sum, item) => sum + (item.position ?? 0) * item.impressions, 0) / weight : null,
  };
}

function headerIndex(header: string[], ...patterns: RegExp[]) {
  return header.findIndex((name) => patterns.every((pattern) => pattern.test(name)));
}

// One Search Console UI export (or the minimal format). Compare-mode exports
// carry both periods; single-period exports fill `current` only.
export function parseGscExport(text: string): GscDataset {
  const [header = [], ...body] = parseCsv(text);
  const names = header.map((name) => name.trim().toLowerCase());
  const keyIndex = names.findIndex((name) => /^(top )?(queries|query|pages|page|landing page)$/.test(name));
  if (keyIndex === -1) throw new Error(`Unrecognized Search Console export header: ${header.join(", ")}`);
  const dimension: GscDimension = /quer/.test(names[keyIndex]) ? "query" : "page";
  const notes: string[] = [];

  const dateIndex = names.indexOf("date");
  if (dateIndex !== -1) return parseLongFormat(body, names, dimension, keyIndex, dateIndex);

  const previousLabel = names.find((name) => /^previous .*impressions$/.test(name) || name === "previous_impressions");
  const comparison = Boolean(previousLabel);
  const pick = (metric: string, period: "current" | "previous") =>
    period === "previous"
      ? headerIndex(names, new RegExp(metric), /previous/)
      : headerIndex(names, new RegExp(`^(?!.*previous).*${metric}`));

  const rows = body.map((cells) => {
    const key = dimension === "page" ? pagePath(cells[keyIndex]) : cells[keyIndex].trim().toLowerCase();
    const at = (index: number) => (index === -1 ? undefined : cells[index]);
    return {
      dimension,
      key,
      current: metrics(at(pick("clicks", "current")), at(pick("impressions", "current")), at(pick("position", "current"))),
      previous: comparison
        ? metrics(at(pick("clicks", "previous")), at(pick("impressions", "previous")), at(pick("position", "previous")))
        : null,
    };
  });
  if (!comparison) notes.push(`${dimension} export has one period only; previous-period values are missing.`);
  return { rows, notes };
}

// Long format: one row per date (and page or query). The latest 7 days present
// are "current", the 7 before them "previous".
function parseLongFormat(body: string[][], names: string[], dimension: GscDimension, keyIndex: number, dateIndex: number): GscDataset {
  const clicksIndex = names.indexOf("clicks");
  const impressionsIndex = names.indexOf("impressions");
  const positionIndex = names.findIndex((name) => name === "position" || name === "average position");
  const dates = [...new Set(body.map((cells) => cells[dateIndex]))].sort();
  const current = new Set(dates.slice(-7));
  const previous = new Set(dates.slice(-14, -7));
  const grouped = new Map<string, { current: GscMetrics[]; previous: GscMetrics[] }>();
  for (const cells of body) {
    const key = dimension === "page" ? pagePath(cells[keyIndex]) : cells[keyIndex].trim().toLowerCase();
    const entry = grouped.get(key) ?? { current: [], previous: [] };
    const value = metrics(cells[clicksIndex], cells[impressionsIndex], positionIndex === -1 ? undefined : cells[positionIndex]);
    if (value && current.has(cells[dateIndex])) entry.current.push(value);
    if (value && previous.has(cells[dateIndex])) entry.previous.push(value);
    grouped.set(key, entry);
  }
  const range = (set: Set<string>) => (set.size ? `${[...set][0]}..${[...set].at(-1)}` : undefined);
  return {
    rows: [...grouped].map(([key, entry]) => ({
      dimension,
      key,
      current: entry.current.length ? combine(entry.current) : null,
      previous: entry.previous.length ? combine(entry.previous) : null,
    })),
    currentRange: range(current),
    previousRange: range(previous),
    notes: previous.size < 7 ? ["Fewer than 14 days of data; the previous period is incomplete."] : [],
  };
}

// Combines exports: a single-period "previous" export fills the previous side
// of the matching current rows.
export function mergeDatasets(current: GscDataset[], previous: GscDataset[] = []): GscDataset {
  const byKey = new Map<string, GscRow>();
  for (const dataset of current) {
    for (const row of dataset.rows) byKey.set(`${row.dimension}:${row.key}`, { ...row });
  }
  for (const dataset of previous) {
    for (const row of dataset.rows) {
      const id = `${row.dimension}:${row.key}`;
      const existing = byKey.get(id) ?? { dimension: row.dimension, key: row.key, current: null, previous: null };
      byKey.set(id, { ...existing, previous: row.current });
    }
  }
  const notes = [...current, ...previous].flatMap((dataset) => dataset.notes);
  return {
    rows: [...byKey.values()],
    currentRange: current.find((dataset) => dataset.currentRange)?.currentRange,
    previousRange: current.find((dataset) => dataset.previousRange)?.previousRange,
    notes: previous.length ? notes.filter((note) => !note.includes("previous-period values are missing")) : notes,
  };
}

export function ctr(value: GscMetrics | null) {
  return value && value.impressions > 0 ? value.clicks / value.impressions : null;
}

export function isLowVolume(row: GscRow) {
  return (row.current?.impressions ?? 0) < LOW_VOLUME_IMPRESSIONS && (row.previous?.impressions ?? 0) < LOW_VOLUME_IMPRESSIONS;
}
