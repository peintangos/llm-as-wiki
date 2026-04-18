import Link from "next/link";
import { ActualsChart } from "@/components/dashboard/ActualsChart";
import { GoalProgressCard } from "@/components/dashboard/GoalProgressCard";
import { HorizonTabs } from "@/components/shared/HorizonTabs";
import { Button } from "@/components/ui/button";
import { buildMultiMetricSeries } from "@/lib/dashboard/progress";
import { listDayActuals } from "@/lib/data/actuals";
import { getBusinessPlan } from "@/lib/data/business-plan";
import { listGoals } from "@/lib/data/goals";
import {
  HORIZONS,
  METRIC_KEYS,
  type Horizon,
  type MetricKey,
} from "@/lib/data/schema";

function isHorizon(value: string | undefined): value is Horizon {
  return !!value && (HORIZONS as readonly string[]).includes(value);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const currentTab: Horizon = isHorizon(params.tab) ? params.tab : "month";

  const [goals, days, plan] = await Promise.all([
    listGoals(),
    listDayActuals(),
    getBusinessPlan(),
  ]);
  const planAvailable = !!plan?.slides_url;

  if (goals.length === 0 && days.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">ダッシュボード</h1>
          <p className="text-sm text-muted-foreground">
            目標と実績を時間軸で可視化する。
          </p>
        </header>
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            まだデータがありません。目標と実績を登録すると、ここに進捗とグラフが表示されます。
          </p>
          <div className="flex justify-center gap-2">
            <Link href="/goals/new">
              <Button>目標を作成</Button>
            </Link>
            <Link href="/actuals/new">
              <Button variant="secondary">実績を入力</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const goalsInTab = goals.filter((g) => g.horizon === currentTab);

  // Derive referenced metrics and the widest (start, end) period for the tab.
  const referencedMetrics: MetricKey[] = Array.from(
    new Set(
      goalsInTab
        .map((g) => g.metric_key)
        .filter((m): m is MetricKey => Boolean(m)),
    ),
  );

  let periodStart: string | undefined;
  let periodEnd: string | undefined;
  for (const g of goalsInTab) {
    if (!periodStart || g.period_start < periodStart) periodStart = g.period_start;
    if (!periodEnd || g.period_end > periodEnd) periodEnd = g.period_end;
  }

  // If no goals in this tab, still show a chart spanning all metrics across
  // the calendar range suggested by the tab's default period (use today).
  const fallbackPeriodStart = periodStart ?? "0000-01-01";
  const fallbackPeriodEnd = periodEnd ?? "9999-12-31";
  const chartMetrics =
    referencedMetrics.length > 0 ? referencedMetrics : [...METRIC_KEYS];
  const chartSeries = buildMultiMetricSeries(
    days,
    chartMetrics,
    fallbackPeriodStart,
    fallbackPeriodEnd,
  );

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">ダッシュボード</h1>
          <p className="text-sm text-muted-foreground">
            時間軸ごとの目標と実績の推移。
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/goals">
            <Button variant="ghost">目標</Button>
          </Link>
          <Link href="/actuals">
            <Button variant="ghost">実績</Button>
          </Link>
          {planAvailable ? (
            <Link href="/business-plan">
              <Button variant="ghost">事業計画</Button>
            </Link>
          ) : (
            <Button variant="ghost" disabled title="slides_url が未設定">
              事業計画
            </Button>
          )}
        </div>
      </header>

      <HorizonTabs current={currentTab} />

      <section className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2">
        {goalsInTab.length === 0 ? (
          <div className="col-span-full rounded-md border border-dashed p-8 text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              この時間軸にはまだ目標がありません。
            </p>
            <Link href={`/goals/new?horizon=${currentTab}`}>
              <Button size="sm">目標を作成</Button>
            </Link>
          </div>
        ) : (
          goalsInTab.map((goal) => (
            <GoalProgressCard key={goal.id} goal={goal} days={days} />
          ))
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-medium">実績の推移</h2>
        <ActualsChart
          series={chartSeries}
          metrics={chartMetrics}
          emptyMessage={
            referencedMetrics.length === 0
              ? "目標に紐づくメトリクスがないため、全メトリクスを表示しています。期間内の実績がまだありません。"
              : "この期間の実績がまだありません。"
          }
        />
      </section>
    </main>
  );
}
