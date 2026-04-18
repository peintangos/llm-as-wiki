"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { METRIC_META, type MetricKey } from "@/lib/data/schema";

export interface ChartPoint {
  date: string;
  [key: string]: string | number;
}

interface Props {
  series: ChartPoint[];
  metrics: MetricKey[];
  emptyMessage?: string;
}

// Tailwind の chart パレットから並び順で選ぶ。色覚負荷を避けて単純に分散。
const COLORS = [
  "var(--color-chart-1, #2563eb)",
  "var(--color-chart-2, #16a34a)",
  "var(--color-chart-3, #dc2626)",
  "var(--color-chart-4, #ca8a04)",
  "var(--color-chart-5, #7c3aed)",
  "var(--color-chart-6, #0891b2)",
];

export function ActualsChart({ series, metrics, emptyMessage }: Props) {
  if (series.length === 0 || metrics.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {emptyMessage ?? "期間内の実績がまだありません。"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="date" fontSize={11} tick={{ fill: "currentColor" }} />
          <YAxis fontSize={11} tick={{ fill: "currentColor" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              backgroundColor: "var(--color-popover, #fff)",
              borderColor: "var(--color-border, #e5e7eb)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {metrics.map((metric, i) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              name={METRIC_META[metric].label}
              stroke={COLORS[i % COLORS.length]}
              dot={{ r: 2 }}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
