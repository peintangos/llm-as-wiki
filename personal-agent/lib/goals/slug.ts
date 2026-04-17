import type { Horizon } from "@/lib/data/schema";

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

/**
 * 目標 ID を生成する。形式: {period_start}-{horizon}-{4char-random}
 * 例: 2026-04-01-month-a3bf
 *
 * 人間可読性を優先し、ディレクトリ一覧でソート・grep しやすい形にする。
 */
export function generateGoalId(
  horizon: Horizon,
  periodStart: string,
): string {
  return `${periodStart}-${horizon}-${randomSuffix()}`;
}
