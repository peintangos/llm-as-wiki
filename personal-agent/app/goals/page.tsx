import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/goals/GoalCard";
import { HorizonTabs } from "@/components/goals/HorizonTabs";
import { listGoals } from "@/lib/data/goals";
import { HORIZONS, type Horizon } from "@/lib/data/schema";

function isHorizon(value: string | undefined): value is Horizon {
  return !!value && (HORIZONS as readonly string[]).includes(value);
}

export default async function GoalsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const currentTab: Horizon = isHorizon(params.tab) ? params.tab : "month";

  const allGoals = await listGoals();
  const filtered = allGoals.filter((goal) => goal.horizon === currentTab);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">目標</h1>
          <p className="text-sm text-muted-foreground">
            行動目標と結果目標を 4 時間軸で管理する。
          </p>
        </div>
        <Link href={`/goals/new?horizon=${currentTab}`}>
          <Button>新規作成</Button>
        </Link>
      </header>

      <HorizonTabs current={currentTab} />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              この時間軸の目標はまだありません。
            </p>
            <Link
              href={`/goals/new?horizon=${currentTab}`}
              className="mt-2 inline-block text-sm text-foreground underline-offset-2 hover:underline"
            >
              新規作成する →
            </Link>
          </div>
        ) : (
          filtered.map((goal) => <GoalCard key={goal.id} goal={goal} />)
        )}
      </div>

      <div className="mt-10 border-t pt-4 text-xs text-muted-foreground">
        目標は{" "}
        <code className="font-mono text-xs">
          personal-agent/data/goals/{"{id}"}.md
        </code>{" "}
        に markdown として保存される。書き込みはローカル `npm run dev` のみ動作する
        （Vercel 本番は read-only snapshot）。
      </div>
    </main>
  );
}
