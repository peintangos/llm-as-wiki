import Link from "next/link";
import { upsertActualAction } from "@/app/actuals/actions";
import { ActualForm } from "@/components/actuals/ActualForm";
import { METRIC_KEYS, type MetricKey } from "@/lib/data/schema";

function isMetric(value: string | undefined): value is MetricKey {
  return !!value && (METRIC_KEYS as readonly string[]).includes(value);
}

export default async function NewActualPage({
  searchParams,
}: {
  searchParams: Promise<{ metric?: string }>;
}) {
  const params = await searchParams;
  const initialMetricKey = isMetric(params.metric) ? params.metric : undefined;

  return (
    <main className="mx-auto max-w-xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">実績を入力</h1>
        <Link
          href="/actuals"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 一覧に戻る
        </Link>
      </div>

      <ActualForm
        action={upsertActualAction}
        initialMetricKey={initialMetricKey}
        submitLabel="記録する"
      />
    </main>
  );
}
