"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { deleteGoal, writeGoal } from "@/lib/data/goals";
import {
  GoalTypeSchema,
  HORIZONS,
  METRIC_KEYS,
} from "@/lib/data/schema";
import { generateGoalId } from "@/lib/goals/slug";

const NO_METRIC = "__none__";

const FormSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1, "タイトルを入力してください"),
  goal_type: GoalTypeSchema,
  horizon: z.enum(HORIZONS),
  period_start: z.string().min(1, "開始日を指定してください"),
  period_end: z.string().min(1, "終了日を指定してください"),
  metric_key: z.string().optional(),
  target_value: z.string().optional(),
  description: z.string().optional(),
});

export async function upsertGoalAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const raw = Object.fromEntries(formData);
  const parsed = FormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力に不備があります" };
  }

  const data = parsed.data;

  if (data.period_start > data.period_end) {
    return { error: "期間開始は期間終了以前の日付にしてください" };
  }

  const metric_key =
    data.metric_key && data.metric_key !== NO_METRIC
      ? (METRIC_KEYS as readonly string[]).includes(data.metric_key)
        ? (data.metric_key as (typeof METRIC_KEYS)[number])
        : undefined
      : undefined;

  const target_value =
    data.target_value && data.target_value.length > 0
      ? Number(data.target_value)
      : undefined;

  const id = data.id ?? generateGoalId(data.horizon, data.period_start);

  await writeGoal({
    id,
    title: data.title.trim(),
    goal_type: data.goal_type,
    horizon: data.horizon,
    period_start: data.period_start,
    period_end: data.period_end,
    metric_key,
    target_value,
    body: data.description?.trim() ?? "",
  });

  revalidatePath("/goals");
  redirect(`/goals?tab=${data.horizon}`);
}

export async function deleteGoalAction(id: string): Promise<void> {
  await deleteGoal(id);
  revalidatePath("/goals");
  redirect("/goals");
}
