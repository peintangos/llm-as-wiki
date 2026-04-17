import Link from "next/link";
import { upsertGoalAction } from "@/app/goals/actions";
import { GoalForm } from "@/components/goals/GoalForm";
import { HORIZONS, type Horizon } from "@/lib/data/schema";

function isHorizon(value: string | undefined): value is Horizon {
  return !!value && (HORIZONS as readonly string[]).includes(value);
}

export default async function NewGoalPage({
  searchParams,
}: {
  searchParams: Promise<{ horizon?: string }>;
}) {
  const params = await searchParams;
  const initialHorizon: Horizon = isHorizon(params.horizon)
    ? params.horizon
    : "month";

  return (
    <main className="mx-auto max-w-xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">新しい目標</h1>
        <Link
          href={`/goals?tab=${initialHorizon}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 一覧に戻る
        </Link>
      </div>

      <GoalForm
        action={upsertGoalAction}
        initialHorizon={initialHorizon}
        submitLabel="作成"
      />
    </main>
  );
}
