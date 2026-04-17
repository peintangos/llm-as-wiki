# spec-003: 目標管理 UI（4 時間軸、行動/結果区別）

## Overview

目標を CRUD する UI を作る。4 時間軸（3 年 / 1 年 / 半年 / 1 ヶ月）と 2 種のラベル（行動目標 / 結果目標）に対応し、各目標に対象メトリクスと目標値を設定できる。Supabase の `goals` テーブルを直接操作する。

## Acceptance Criteria

```gherkin
Feature: Goals management UI

  Background:
    spec-002 で Supabase 接続とスキーマは準備済み
    認証済みユーザーとしてアクセスする

  Scenario: 目標一覧ページが 4 時間軸タブで切り替えできる
    Given /goals ページ
    When アクセスする
    Then 「3 年 / 1 年 / 半年 / 1 ヶ月」の 4 タブが表示される
    And 各タブは選択中の horizon で絞り込んだ目標一覧を表示する
    And 目標は title、goal_type (バッジ表示)、period_start〜period_end、target_metric + target_value を表示する

  Scenario: 目標を新規作成できる
    Given /goals の各時間軸タブ
    When 「新規作成」ボタンを押す
    Then フォームが開き以下を入力できる:
      | field |
      | title |
      | description |
      | goal_type (behavior / outcome ラジオ) |
      | horizon (タブから pre-select) |
      | period_start / period_end（horizon のデフォルト提案あり） |
      | metric_key（metrics から select）|
      | target_value |
    And 保存すると goals テーブルに INSERT される
    And owner_id は自動で auth.uid() が入る

  Scenario: 目標を編集・削除できる
    Given /goals 一覧
    When ある目標の行の「編集」「削除」を押す
    Then 編集は同フォームが開いて UPDATE、削除は確認ダイアログ後 DELETE される

  Scenario: 行動目標と結果目標が視覚的に区別される
    Given /goals 一覧
    When 表示を見る
    Then behavior は青系バッジ、outcome は緑系バッジなど視覚的に区別できる

  Scenario: horizon に応じた period デフォルトが提案される
    Given 新規作成フォーム
    When horizon を「1ヶ月」に設定する
    Then period_start は当月 1 日、period_end は当月末がデフォルトで埋まる
    And horizon を「1 年」にすると period は当年度（例: 2026-04-01 〜 2027-03-31）

  Scenario: RLS が効いている
    Given 別アカウント（テスト用の別ユーザー）でアクセスする
    When /goals を開く
    Then 自分以外の目標は一切見えない
```

## Implementation Steps

- [ ] `personal-agent/app/(authed)/goals/page.tsx` — 一覧 + タブ UI
- [ ] `personal-agent/app/(authed)/goals/new/page.tsx` — 新規作成フォーム
- [ ] `personal-agent/app/(authed)/goals/[id]/edit/page.tsx` — 編集フォーム
- [ ] `personal-agent/components/goals/GoalForm.tsx` — 共通フォーム（新規 / 編集）
- [ ] `personal-agent/components/goals/GoalCard.tsx` — 一覧行カード
- [ ] `personal-agent/components/goals/HorizonTabs.tsx` — 4 タブ切り替え
- [ ] `personal-agent/lib/goals/{schema.ts, queries.ts, actions.ts}` — zod schema、Supabase クエリ、Server Actions
- [ ] metric_key は metrics テーブルから動的に select（全ユーザー共通 seed）
- [ ] horizon ごとの period デフォルトロジックを util 関数に分離（test 付き）
- [ ] `raw/` に参考資料（Next.js App Router・shadcn/ui フォーム関連）を投下（任意）
- [ ] `knowledge.md` に観察を記録
- [ ] Review（`/code-review`）
