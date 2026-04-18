import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteActualAction,
  upsertActualAction,
} from "@/app/actuals/actions";
import { ActualForm } from "@/components/actuals/ActualForm";
import { Button } from "@/components/ui/button";
import { getDayActuals } from "@/lib/data/actuals";
import {
  METRIC_KEYS,
  METRIC_META,
  type MetricKey,
} from "@/lib/data/schema";

function isMetric(value: string | undefined): value is MetricKey {
  return !!value && (METRIC_KEYS as readonly string[]).includes(value);
}

export default async function EditActualPage({
  params,
}: {
  params: Promise<{ date: string; metric: string }>;
}) {
  const { date, metric } = await params;
  if (!isMetric(metric)) notFound();

  const day = await getDayActuals(date);
  if (!day) notFound();

  const source = day.sources[metric];
  if (source === "rss") {
    // RSS 由来の行は手入力側で編集不可。
    notFound();
  }

  const value = day.metrics[metric] ?? 0;
  const deleteWith = deleteActualAction.bind(null, date, metric);

  return (
    <main className="mx-auto max-w-xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">実績を編集</h1>
        <Link
          href="/actuals"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 一覧に戻る
        </Link>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {date} の {METRIC_META[metric].label} を編集します。メトリクスと日付はロックされます。
      </p>

      <ActualForm
        action={upsertActualAction}
        initialMetricKey={metric}
        initialValue={value}
        initialDate={date}
        lockMetricAndDate
        submitLabel="更新"
      />

      <div className="mt-8 border-t pt-6">
        <form action={deleteWith}>
          <Button type="submit" variant="destructive">
            この実績を削除（値を 0 に戻す）
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            日別ファイルの{" "}
            <code className="font-mono text-xs">
              metrics.{metric}
            </code>{" "}
            を 0 に書き戻す。他メトリクスが残るため、ファイル自体は削除しない。
          </p>
        </form>
      </div>
    </main>
  );
}
