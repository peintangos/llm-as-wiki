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
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  HORIZON_LABEL,
  HORIZONS,
  METRIC_KEYS,
  METRIC_META,
  type Goal,
  type Horizon,
} from "@/lib/data/schema";
import { periodDefaults } from "@/lib/goals/period-defaults";

export type UpsertAction = (
  prev: { error?: string } | undefined,
  formData: FormData,
) => Promise<{ error?: string } | undefined>;

interface Props {
  action: UpsertAction;
  initialGoal?: Goal;
  initialHorizon?: Horizon;
  submitLabel: string;
}

const NO_METRIC = "__none__";

export function GoalForm({
  action,
  initialGoal,
  initialHorizon,
  submitLabel,
}: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [horizon, setHorizon] = useState<Horizon>(
    initialGoal?.horizon ?? initialHorizon ?? "month",
  );
  const [period, setPeriod] = useState(() =>
    initialGoal
      ? { period_start: initialGoal.period_start, period_end: initialGoal.period_end }
      : periodDefaults(initialHorizon ?? "month"),
  );
  const [metricKey, setMetricKey] = useState<string>(
    initialGoal?.metric_key ?? NO_METRIC,
  );

  function onHorizonChange(v: string | null) {
    if (!v) return;
    const h = v as Horizon;
    setHorizon(h);
    if (!initialGoal) {
      setPeriod(periodDefaults(h));
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {initialGoal && <input type="hidden" name="id" value={initialGoal.id} />}

      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={initialGoal?.title}
          placeholder="例: 月に note を 4 本書く"
        />
      </div>

      <div className="space-y-2">
        <Label>タイプ</Label>
        <RadioGroup
          name="goal_type"
          defaultValue={initialGoal?.goal_type ?? "behavior"}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="behavior" id="behavior" />
            <Label htmlFor="behavior" className="font-normal">
              行動目標
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="outcome" id="outcome" />
            <Label htmlFor="outcome" className="font-normal">
              結果目標
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="horizon">時間軸</Label>
        <Select
          name="horizon"
          value={horizon}
          onValueChange={onHorizonChange}
        >
          <SelectTrigger id="horizon">
            <SelectValue>
              {(value) =>
                typeof value === "string"
                  ? HORIZON_LABEL[value as Horizon] ?? value
                  : ""
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {HORIZONS.map((h) => (
              <SelectItem key={h} value={h}>
                {HORIZON_LABEL[h]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="period_start">期間開始</Label>
          <Input
            id="period_start"
            name="period_start"
            type="date"
            required
            value={period.period_start}
            onChange={(e) =>
              setPeriod((p) => ({ ...p, period_start: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period_end">期間終了</Label>
          <Input
            id="period_end"
            name="period_end"
            type="date"
            required
            value={period.period_end}
            onChange={(e) =>
              setPeriod((p) => ({ ...p, period_end: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="metric_key">対応メトリクス（任意）</Label>
          <Select
            name="metric_key"
            value={metricKey}
            onValueChange={(v) => setMetricKey(typeof v === "string" ? v : NO_METRIC)}
          >
            <SelectTrigger id="metric_key">
              <SelectValue>
                {(value) => {
                  if (typeof value !== "string" || value === NO_METRIC)
                    return "（選択なし）";
                  const meta =
                    METRIC_META[value as (typeof METRIC_KEYS)[number]];
                  return meta?.label ?? value;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_METRIC}>（選択なし）</SelectItem>
              {METRIC_KEYS.map((k) => (
                <SelectItem key={k} value={k}>
                  {METRIC_META[k].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_value">目標値（任意）</Label>
          <Input
            id="target_value"
            name="target_value"
            type="number"
            min="0"
            step="1"
            defaultValue={initialGoal?.target_value}
            placeholder="例: 4"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">説明（任意）</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialGoal?.body}
          placeholder="目標の背景や意図を書く"
        />
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
