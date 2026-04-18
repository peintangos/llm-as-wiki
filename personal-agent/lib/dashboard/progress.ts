import type { DayActuals, Goal, MetricKey } from "@/lib/data/schema";

export interface GoalProgress {
  accumulated: number;
  target: number | null;
  percentage: number | null;
}

export function computeGoalProgress(
  goal: Goal,
  days: DayActuals[],
): GoalProgress {
  if (
    !goal.metric_key ||
    goal.target_value === undefined ||
    goal.target_value <= 0
  ) {
    return { accumulated: 0, target: null, percentage: null };
  }

  const accumulated = sumMetricInPeriod(
    days,
    goal.metric_key,
    goal.period_start,
    goal.period_end,
  );

  return {
    accumulated,
    target: goal.target_value,
    percentage: Math.min(100, (accumulated / goal.target_value) * 100),
  };
}

export function sumMetricInPeriod(
  days: DayActuals[],
  metricKey: MetricKey,
  periodStart: string,
  periodEnd: string,
): number {
  let sum = 0;
  for (const day of days) {
    if (day.date < periodStart) continue;
    if (day.date > periodEnd) continue;
    sum += day.metrics[metricKey] ?? 0;
  }
  return sum;
}

export interface CumulativePoint {
  date: string;
  value: number;
  cumulative: number;
}

export interface MultiMetricPoint {
  date: string;
  [key: string]: string | number;
}

export function buildMultiMetricSeries(
  days: DayActuals[],
  metrics: MetricKey[],
  periodStart: string,
  periodEnd: string,
): MultiMetricPoint[] {
  if (metrics.length === 0) return [];
  return days
    .filter((d) => d.date >= periodStart && d.date <= periodEnd)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => {
      const point: MultiMetricPoint = { date: day.date };
      for (const metric of metrics) {
        point[metric] = day.metrics[metric] ?? 0;
      }
      return point;
    });
}

export function buildCumulativeSeries(
  days: DayActuals[],
  metricKey: MetricKey,
  periodStart: string,
  periodEnd: string,
): CumulativePoint[] {
  const filtered = days
    .filter((d) => d.date >= periodStart && d.date <= periodEnd)
    .sort((a, b) => a.date.localeCompare(b.date));

  let cumulative = 0;
  return filtered.map((day) => {
    const value = day.metrics[metricKey] ?? 0;
    cumulative += value;
    return { date: day.date, value, cumulative };
  });
}
