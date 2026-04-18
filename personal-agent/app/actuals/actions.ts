"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { writeDayActuals } from "@/lib/data/actuals";
import { METRIC_KEYS, type MetricKey } from "@/lib/data/schema";

const FormSchema = z.object({
  metric_key: z.enum(METRIC_KEYS),
  value: z.string().min(1, "値を入力してください"),
  recorded_date: z.string().min(1, "日付を指定してください"),
  note: z.string().optional(),
});

export async function upsertActualAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const raw = Object.fromEntries(formData);
  const parsed = FormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力に不備があります" };
  }
  const data = parsed.data;
  const value = Number(data.value);
  if (!Number.isFinite(value) || value < 0) {
    return { error: "値は 0 以上の数値にしてください" };
  }

  await writeDayActuals(data.recorded_date, {
    metrics: { [data.metric_key]: value },
    sources: { [data.metric_key]: "manual" },
    appendBody: data.note,
  });

  revalidatePath("/actuals");
  redirect("/actuals");
}

export async function deleteActualAction(
  date: string,
  metricKey: MetricKey,
): Promise<void> {
  await writeDayActuals(date, {
    metrics: { [metricKey]: 0 },
    sources: { [metricKey]: "manual" },
  });
  revalidatePath("/actuals");
  redirect("/actuals");
}
