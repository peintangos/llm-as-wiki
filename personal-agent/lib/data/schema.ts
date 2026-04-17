import { z } from "zod";

export const METRIC_KEYS = [
  "note_count",
  "zenn_count",
  "x_posts",
  "meetings",
  "events",
  "deals",
] as const;

export type MetricKey = (typeof METRIC_KEYS)[number];

export const METRIC_META: Record<MetricKey, { label: string; unit: string }> = {
  note_count: { label: "note 記事数", unit: "articles" },
  zenn_count: { label: "Zenn 記事数", unit: "articles" },
  x_posts: { label: "X ポスト数", unit: "posts" },
  meetings: { label: "社長アポ数", unit: "meetings" },
  events: { label: "イベント出席数", unit: "events" },
  deals: { label: "商談成功数", unit: "deals" },
};

export const HORIZONS = ["3yr", "1yr", "half", "month"] as const;
export type Horizon = (typeof HORIZONS)[number];

export const HORIZON_LABEL: Record<Horizon, string> = {
  "3yr": "3 年",
  "1yr": "1 年",
  half: "半年",
  month: "1 ヶ月",
};

export const GoalTypeSchema = z.enum(["behavior", "outcome"]);
export type GoalType = z.infer<typeof GoalTypeSchema>;

export const SourceSchema = z.enum(["manual", "rss"]);
export type Source = z.infer<typeof SourceSchema>;

// gray-matter の YAML parser は `2026-04-17` のような日付を JS Date に変換する。
// frontmatter 上の見かけは string のままにしたいので、Date を受け取ったら
// ISO の yyyy-mm-dd に戻す preprocess を通す。
const DateStringSchema = z.preprocess((v) => {
  if (v instanceof Date) {
    return v.toISOString().slice(0, 10);
  }
  return v;
}, z.string());

// -----------------------------------------------------------------------------
// Goals
// -----------------------------------------------------------------------------

export const GoalFrontmatterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  goal_type: GoalTypeSchema,
  horizon: z.enum(HORIZONS),
  period_start: DateStringSchema,
  period_end: DateStringSchema,
  metric_key: z.enum(METRIC_KEYS).optional(),
  target_value: z.number().optional(),
});

export type GoalFrontmatter = z.infer<typeof GoalFrontmatterSchema>;

export interface Goal extends GoalFrontmatter {
  body: string;
}

// -----------------------------------------------------------------------------
// Daily actuals
// -----------------------------------------------------------------------------

const MetricsRecordSchema = z.object({
  note_count: z.number(),
  zenn_count: z.number(),
  x_posts: z.number(),
  meetings: z.number(),
  events: z.number(),
  deals: z.number(),
});

const SourcesRecordSchema = z.object({
  note_count: SourceSchema,
  zenn_count: SourceSchema,
  x_posts: SourceSchema,
  meetings: SourceSchema,
  events: SourceSchema,
  deals: SourceSchema,
});

export const DayActualsFrontmatterSchema = z.object({
  date: DateStringSchema,
  metrics: MetricsRecordSchema,
  sources: SourcesRecordSchema,
});

export type DayActualsFrontmatter = z.infer<typeof DayActualsFrontmatterSchema>;

export interface DayActuals extends DayActualsFrontmatter {
  body: string;
}

export function zeroedDayActuals(date: string): DayActualsFrontmatter {
  const zeros = Object.fromEntries(
    METRIC_KEYS.map((k) => [k, 0]),
  ) as DayActualsFrontmatter["metrics"];
  const manuals = Object.fromEntries(
    METRIC_KEYS.map((k) => [k, "manual" as const]),
  ) as DayActualsFrontmatter["sources"];
  return { date, metrics: zeros, sources: manuals };
}
