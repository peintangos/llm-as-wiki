"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  METRIC_KEYS,
  METRIC_META,
  type MetricKey,
} from "@/lib/data/schema";

export type UpsertActualAction = (
  prev: { error?: string } | undefined,
  formData: FormData,
) => Promise<{ error?: string } | undefined>;

interface Props {
  action: UpsertActualAction;
  initialMetricKey?: MetricKey;
  initialValue?: number;
  initialDate?: string;
  lockMetricAndDate?: boolean;
  submitLabel: string;
}

function firstOfCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ActualForm({
  action,
  initialMetricKey,
  initialValue,
  initialDate,
  lockMetricAndDate,
  submitLabel,
}: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [metricKey, setMetricKey] = useState<MetricKey>(
    initialMetricKey ?? "x_posts",
  );
  const [recordedDate, setRecordedDate] = useState(
    initialDate ?? todayIso(),
  );
  const [monthlyMode, setMonthlyMode] = useState(false);

  function onToggleMonthly(next: boolean) {
    setMonthlyMode(next);
    if (next) {
      setRecordedDate(firstOfCurrentMonth());
    } else if (!initialDate) {
      setRecordedDate(todayIso());
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="metric_key">メトリクス</Label>
        <Select
          name="metric_key"
          value={metricKey}
          onValueChange={(v) =>
            typeof v === "string" && setMetricKey(v as MetricKey)
          }
          disabled={lockMetricAndDate}
        >
          <SelectTrigger id="metric_key">
            <SelectValue>
              {(value) =>
                typeof value === "string"
                  ? METRIC_META[value as MetricKey]?.label ?? value
                  : ""
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {METRIC_KEYS.map((k) => (
              <SelectItem key={k} value={k}>
                {METRIC_META[k].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {lockMetricAndDate && (
          <input type="hidden" name="metric_key" value={metricKey} />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">値</Label>
        <Input
          id="value"
          name="value"
          type="number"
          min="0"
          step="1"
          required
          defaultValue={initialValue}
          placeholder="例: 3"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recorded_date">記録日</Label>
        <Input
          id="recorded_date"
          name="recorded_date"
          type="date"
          required
          value={recordedDate}
          onChange={(e) => setRecordedDate(e.target.value)}
          disabled={lockMetricAndDate}
        />
        {lockMetricAndDate && (
          <input type="hidden" name="recorded_date" value={recordedDate} />
        )}
        {!lockMetricAndDate && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={monthlyMode}
              onChange={(e) => onToggleMonthly(e.target.checked)}
              className="size-4"
            />
            月別入力モード（当月 1 日に代表記録）
          </label>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">メモ（任意）</Label>
        <Textarea
          id="note"
          name="note"
          rows={3}
          placeholder="この実績の背景や備考"
        />
        <p className="text-xs text-muted-foreground">
          記録日ファイルの本文に append される（タイムスタンプ付き）。
        </p>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "保存中..." : submitLabel}
      </Button>
    </form>
  );
}
