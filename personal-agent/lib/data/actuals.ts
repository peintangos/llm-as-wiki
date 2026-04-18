import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  type DayActuals,
  DayActualsFrontmatterSchema,
  type MetricKey,
  type Source,
  zeroedDayActuals,
} from "./schema";

const ACTUALS_DIR = path.join(process.cwd(), "data", "actuals");

export interface DayActualsPatch {
  metrics?: Partial<Record<MetricKey, number>>;
  sources?: Partial<Record<MetricKey, Source>>;
  appendBody?: string;
}

export async function listDayActuals(): Promise<DayActuals[]> {
  const entries = await fs.readdir(ACTUALS_DIR).catch(() => [] as string[]);
  const days: DayActuals[] = [];

  for (const entry of entries) {
    if (!entry.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(ACTUALS_DIR, entry), "utf8");
    const parsed = matter(raw);
    const data = DayActualsFrontmatterSchema.parse(parsed.data);
    days.push({ ...data, body: parsed.content.trim() });
  }

  return days.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getDayActuals(date: string): Promise<DayActuals | null> {
  const filePath = path.join(ACTUALS_DIR, `${date}.md`);
  const raw = await fs.readFile(filePath, "utf8").catch(() => null);
  if (!raw) return null;
  const parsed = matter(raw);
  const data = DayActualsFrontmatterSchema.parse(parsed.data);
  return { ...data, body: parsed.content.trim() };
}

export async function writeDayActuals(
  date: string,
  patch: DayActualsPatch,
): Promise<void> {
  const existing = await getDayActuals(date);
  const base: DayActuals = existing ?? { ...zeroedDayActuals(date), body: "" };

  const metrics = { ...base.metrics, ...(patch.metrics ?? {}) };
  const sources = { ...base.sources, ...(patch.sources ?? {}) };

  let body = base.body;
  const note = patch.appendBody?.trim();
  if (note) {
    const timestamp = new Date().toISOString();
    const entry = `- ${timestamp}: ${note}`;
    body = body ? `${body}\n\n${entry}` : `# ${date}\n\n${entry}`;
  }

  const frontmatter = DayActualsFrontmatterSchema.parse({
    date,
    metrics,
    sources,
  });

  const content = matter.stringify(body.length > 0 ? `\n${body}\n` : "", frontmatter);

  await fs.mkdir(ACTUALS_DIR, { recursive: true });
  await fs.writeFile(path.join(ACTUALS_DIR, `${date}.md`), content, "utf8");
}

export function sumByMetric(
  days: DayActuals[],
  metricKey: MetricKey,
  startDate?: string,
  endDate?: string,
): number {
  let sum = 0;
  for (const day of days) {
    if (startDate && day.date < startDate) continue;
    if (endDate && day.date > endDate) continue;
    sum += day.metrics[metricKey] ?? 0;
  }
  return sum;
}
