import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { computeGoalProgress } from "@/lib/dashboard/progress";
import {
  METRIC_META,
  type DayActuals,
  type Goal,
} from "@/lib/data/schema";

interface Props {
  goal: Goal;
  days: DayActuals[];
}

export function GoalProgressCard({ goal, days }: Props) {
  const { accumulated, target, percentage } = computeGoalProgress(goal, days);
  const metricLabel = goal.metric_key
    ? METRIC_META[goal.metric_key].label
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{goal.title}</CardTitle>
          <Badge variant={goal.goal_type === "behavior" ? "default" : "secondary"}>
            {goal.goal_type === "behavior" ? "行動" : "結果"}
          </Badge>
        </div>
        <CardDescription>
          {goal.period_start} 〜 {goal.period_end}
          {metricLabel && target !== null && (
            <>
              {" · "}
              {metricLabel} {target}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {percentage !== null && target !== null ? (
          <>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-mono">
                {accumulated} / {target}
              </span>
              <span className="font-mono text-muted-foreground">
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            メトリクスまたは目標値が未設定（進捗率は計算されません）。
          </p>
        )}

        <Link
          href={`/goals/${goal.id}/edit`}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          目標を編集
        </Link>
      </CardContent>
    </Card>
  );
}
