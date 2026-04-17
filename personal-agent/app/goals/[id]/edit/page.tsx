import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteGoalAction, upsertGoalAction } from "@/app/goals/actions";
import { GoalForm } from "@/components/goals/GoalForm";
import { Button } from "@/components/ui/button";
import { getGoal } from "@/lib/data/goals";

export default async function EditGoalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const goal = await getGoal(id);
  if (!goal) notFound();

  const deleteWithId = deleteGoalAction.bind(null, id);

  return (
    <main className="mx-auto max-w-xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">目標を編集</h1>
        <Link
          href={`/goals?tab=${goal.horizon}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 一覧に戻る
        </Link>
      </div>

      <GoalForm
        action={upsertGoalAction}
        initialGoal={goal}
        submitLabel="更新"
      />

      <div className="mt-8 border-t pt-6">
        <form action={deleteWithId}>
          <Button type="submit" variant="destructive">
            この目標を削除
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            削除すると{" "}
            <code className="font-mono text-xs">data/goals/{id}.md</code>{" "}
            が unlink される。復元は git history から。
          </p>
        </form>
      </div>
    </main>
  );
}
