import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { METRIC_META, type Goal } from "@/lib/data/schema";

interface Props {
  goal: Goal;
}

export function GoalCard({ goal }: Props) {
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
          {metricLabel && goal.target_value !== undefined && (
            <> · {metricLabel} {goal.target_value}</>
          )}
        </CardDescription>
      </CardHeader>
      {goal.body && (
        <CardContent className="-mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
          {goal.body}
        </CardContent>
      )}
      <CardContent className="pt-0">
        <Link
          href={`/goals/${goal.id}/edit`}
          className="text-sm text-foreground underline-offset-2 hover:underline"
        >
          編集
        </Link>
      </CardContent>
    </Card>
  );
}
