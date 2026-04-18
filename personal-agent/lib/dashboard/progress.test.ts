import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCumulativeSeries,
  buildMultiMetricSeries,
  computeGoalProgress,
  sumMetricInPeriod,
} from "./progress";
import type { DayActuals, Goal } from "@/lib/data/schema";

function makeGoal(partial: Partial<Goal> = {}): Goal {
  return {
    id: "goal-1",
    title: "test goal",
    goal_type: "behavior",
    horizon: "month",
    period_start: "2026-04-01",
    period_end: "2026-04-30",
    metric_key: "x_posts",
    target_value: 10,
    body: "",
    ...partial,
  };
}

function makeDay(date: string, metrics: Partial<DayActuals["metrics"]>): DayActuals {
  return {
    date,
    metrics: {
      note_count: 0,
      zenn_count: 0,
      x_posts: 0,
      meetings: 0,
      events: 0,
      deals: 0,
      ...metrics,
    },
    sources: {
      note_count: "manual",
      zenn_count: "manual",
      x_posts: "manual",
      meetings: "manual",
      events: "manual",
      deals: "manual",
    },
    body: "",
  };
}

test("computeGoalProgress: happy path", () => {
  const goal = makeGoal({ target_value: 10, metric_key: "x_posts" });
  const days = [
    makeDay("2026-04-01", { x_posts: 2 }),
    makeDay("2026-04-10", { x_posts: 3 }),
    makeDay("2026-04-20", { x_posts: 1 }),
  ];
  const progress = computeGoalProgress(goal, days);
  assert.equal(progress.accumulated, 6);
  assert.equal(progress.target, 10);
  assert.equal(progress.percentage, 60);
});

test("computeGoalProgress: out-of-period days ignored", () => {
  const goal = makeGoal({ target_value: 10 });
  const days = [
    makeDay("2026-03-31", { x_posts: 99 }), // before
    makeDay("2026-05-01", { x_posts: 99 }), // after
    makeDay("2026-04-15", { x_posts: 4 }),
  ];
  assert.equal(computeGoalProgress(goal, days).accumulated, 4);
});

test("computeGoalProgress: target_value == 0 or missing → null percentage", () => {
  assert.equal(
    computeGoalProgress(makeGoal({ target_value: 0 }), []).percentage,
    null,
  );
  assert.equal(
    computeGoalProgress(makeGoal({ target_value: undefined }), []).percentage,
    null,
  );
  assert.equal(
    computeGoalProgress(makeGoal({ metric_key: undefined }), []).percentage,
    null,
  );
});

test("computeGoalProgress: caps percentage at 100", () => {
  const goal = makeGoal({ target_value: 10 });
  const days = [makeDay("2026-04-15", { x_posts: 50 })];
  assert.equal(computeGoalProgress(goal, days).percentage, 100);
});

test("sumMetricInPeriod: inclusive boundary", () => {
  const days = [
    makeDay("2026-04-01", { meetings: 1 }),
    makeDay("2026-04-30", { meetings: 1 }),
    makeDay("2026-05-01", { meetings: 1 }),
  ];
  assert.equal(
    sumMetricInPeriod(days, "meetings", "2026-04-01", "2026-04-30"),
    2,
  );
});

test("buildMultiMetricSeries: aggregates per-metric by date", () => {
  const days = [
    makeDay("2026-04-01", { x_posts: 2, meetings: 1 }),
    makeDay("2026-04-02", { x_posts: 3, meetings: 0 }),
    makeDay("2026-03-30", { x_posts: 99, meetings: 99 }), // out-of-period
  ];
  const series = buildMultiMetricSeries(
    days,
    ["x_posts", "meetings"],
    "2026-04-01",
    "2026-04-30",
  );
  assert.deepEqual(series, [
    { date: "2026-04-01", x_posts: 2, meetings: 1 },
    { date: "2026-04-02", x_posts: 3, meetings: 0 },
  ]);
});

test("buildMultiMetricSeries: empty metrics array yields empty series", () => {
  const days = [makeDay("2026-04-01", { x_posts: 2 })];
  assert.deepEqual(
    buildMultiMetricSeries(days, [], "2026-04-01", "2026-04-30"),
    [],
  );
});

test("buildCumulativeSeries: sorted + cumulative", () => {
  const days = [
    makeDay("2026-04-15", { x_posts: 3 }),
    makeDay("2026-04-01", { x_posts: 1 }),
    makeDay("2026-04-10", { x_posts: 2 }),
  ];
  const series = buildCumulativeSeries(
    days,
    "x_posts",
    "2026-04-01",
    "2026-04-30",
  );
  assert.deepEqual(series, [
    { date: "2026-04-01", value: 1, cumulative: 1 },
    { date: "2026-04-10", value: 2, cumulative: 3 },
    { date: "2026-04-15", value: 3, cumulative: 6 },
  ]);
});
