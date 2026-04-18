# spec-006: ダッシュボード可視化（時間軸タブ + 進捗グラフ）

## Overview

トップページ = ダッシュボード。3 年 / 1 年 / 半年 / 1 ヶ月の時間軸タブで切り替え、選択中 horizon の目標と対応する実績の進捗率をカード + グラフで表示する。shadcn/ui + Recharts（or similar）で構成。

## Acceptance Criteria

```gherkin
Feature: Dashboard visualization

  Background:
    spec-003 で goals、spec-004 と spec-005 で actuals が蓄積されている

  Scenario: トップページがダッシュボードになっている
    Given 認証済みユーザー
    When / へアクセスする
    Then ダッシュボードが表示される

  Scenario: 4 時間軸タブで切り替えできる
    Given ダッシュボード
    When 「3 年 / 1 年 / 半年 / 1 ヶ月」タブをクリック
    Then 選択中 horizon の目標だけが表示される
    And URL に tab=<horizon> が反映される（リロード後も維持）

  Scenario: 目標カードが進捗率を表示する
    Given ある horizon に行動目標が 3 件、結果目標が 2 件ある
    When ダッシュボードでそのタブを開く
    Then 各目標カードが以下を表示する:
      | item |
      | title |
      | goal_type バッジ |
      | period_start 〜 period_end |
      | target_metric + target_value |
      | 現在の actuals 累積（metric_key と period 範囲でフィルタ済み）|
      | 進捗率（累積 / target_value × 100）|
      | プログレスバー |

  Scenario: 実績グラフが時系列で見える
    Given 目標カード下のグラフエリア
    When 選択中 horizon の期間で actuals を集計する
    Then 折れ線 or 棒グラフで日別 or 週別の推移が表示される
    And 複数メトリクスが並列に比較できる

  Scenario: 実績ゼロでもエラーにならない
    Given 新規ユーザーで goals / actuals が空
    When ダッシュボードを開く
    Then 「まだ目標がありません。/goals で作成してください」などの空状態 UI が表示される

  Scenario: 期間外の実績は進捗計算に含まれない
    Given 1 ヶ月タブ（period: 2026-04-01〜2026-04-30）
    When 3 月分の actuals がある
    Then 進捗計算には含まれず、当月分のみ集計される

  Scenario: 表示速度が許容範囲
    Given goals 20 件、actuals 500 件
    When タブを切り替える
    Then 描画完了まで 1 秒以内（ローカル dev で）
```

## Implementation Steps

- [x] `personal-agent/app/(authed)/page.tsx` — ダッシュボード → 認証レイヤーがないため `app/page.tsx` に直接実装
- [x] `personal-agent/components/dashboard/HorizonTabs.tsx`（spec-003 と共通化） → `components/shared/HorizonTabs.tsx` に移動して /goals とダッシュボードの両方から import
- [x] `personal-agent/components/dashboard/GoalProgressCard.tsx`
- [x] `personal-agent/components/dashboard/ActualsChart.tsx`（Recharts）
- [x] `personal-agent/lib/dashboard/queries.ts` — goals と actuals を horizon / period でフィルタして返す → 専用モジュールを作らず、page 内で `listGoals` / `listDayActuals` + `buildMultiMetricSeries` の組み合わせで実現（過度な抽象化を避ける）
- [x] 進捗率計算ロジックを util に分離、テスト付き（`lib/dashboard/progress.ts`、node:test で 8 ケース）
- [x] 空状態 UI（全体が空 / 該当 horizon に目標なし / 期間内実績なし の 3 パターン）
- [x] URL クエリ (`?tab=month`) と UI 状態を同期（shared HorizonTabs 経由で searchParams と双方向）
- [x] 参照した Recharts / shadcn/ui Chart の docs を `raw/articles/` に投下 → 今回は Recharts の標準 API のみ使い docs 深掘りが不要だったため skip（判断を knowledge.md に記録）
- [x] `knowledge.md` に観察を記録
- [x] Review（`/code-review`）
