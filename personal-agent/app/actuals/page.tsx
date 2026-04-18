import Link from "next/link";
import { ActualTable, type ActualRow } from "@/components/actuals/ActualTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listDayActuals } from "@/lib/data/actuals";
import {
  METRIC_KEYS,
  METRIC_META,
  type MetricKey,
} from "@/lib/data/schema";

const ALL = "__all__";

function isMetric(value: string | undefined): value is MetricKey {
  return !!value && (METRIC_KEYS as readonly string[]).includes(value);
}

export default async function ActualsPage({
  searchParams,
}: {
  searchParams: Promise<{
    metric?: string;
    start?: string;
    end?: string;
  }>;
}) {
  const params = await searchParams;
  const metricFilter = isMetric(params.metric) ? params.metric : undefined;
  const startDate = params.start || undefined;
  const endDate = params.end || undefined;

  const days = await listDayActuals();
  const rows: ActualRow[] = [];
  for (const day of days) {
    if (startDate && day.date < startDate) continue;
    if (endDate && day.date > endDate) continue;
    for (const key of METRIC_KEYS) {
      const value = day.metrics[key] ?? 0;
      const source = day.sources[key];
      // Show non-zero manual entries and all rss rows (rss zero may indicate observed-zero).
      const include = value > 0 || source === "rss";
      if (!include) continue;
      if (metricFilter && key !== metricFilter) continue;
      rows.push({ date: day.date, metricKey: key, value, source });
    }
  }
  rows.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.metricKey.localeCompare(b.metricKey);
  });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">実績</h1>
          <p className="text-sm text-muted-foreground">
            X ポスト / アポ / イベント / 商談などの実績を日別に記録する。
          </p>
        </div>
        <Link href="/actuals/new">
          <Button>新規入力</Button>
        </Link>
      </header>

      <form
        method="get"
        className="mb-6 grid grid-cols-1 gap-3 rounded-md border p-4 sm:grid-cols-4"
      >
        <div className="space-y-1">
          <Label htmlFor="metric">メトリクス</Label>
          <select
            id="metric"
            name="metric"
            defaultValue={metricFilter ?? ALL}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value={ALL}>すべて</option>
            {METRIC_KEYS.map((k) => (
              <option key={k} value={k}>
                {METRIC_META[k].label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="start">開始日</Label>
          <Input
            id="start"
            name="start"
            type="date"
            defaultValue={startDate}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="end">終了日</Label>
          <Input id="end" name="end" type="date" defaultValue={endDate} />
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1">
            絞り込む
          </Button>
          <Link href="/actuals" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
            解除
          </Link>
        </div>
      </form>

      <ActualTable rows={rows} />

      <div className="mt-10 border-t pt-4 text-xs text-muted-foreground">
        実績は{" "}
        <code className="font-mono text-xs">
          personal-agent/data/actuals/{"{yyyy-mm-dd}"}.md
        </code>{" "}
        に保存される。書き込みはローカル `npm run dev` のみ動作する（Vercel 本番は read-only snapshot）。
      </div>
    </main>
  );
}
