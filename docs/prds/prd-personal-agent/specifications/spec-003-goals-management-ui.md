# spec-003: 目標管理 UI（4 時間軸、行動/結果区別）

## Overview

目標を CRUD する UI を作る。4 時間軸（3 年 / 1 年 / 半年 / 1 ヶ月）と 2 種のラベル（行動目標 / 結果目標）に対応し、各目標に対象メトリクスと目標値を設定できる。データ層は `data/goals/{id}.md` の markdown ファイル。Server Action が `fs.writeFile` / `fs.unlink` で markdown を書き換える（ローカル `npm run dev` 前提）。

## Acceptance Criteria

```gherkin
Feature: Goals management UI

  Background:
    spec-002 で data/ と lib/data/goals.ts は準備済み
    認証は存在しない（単一ユーザー、ローカル運用）

  Scenario: 目標一覧ページが 4 時間軸タブで切り替えできる
    Given /goals ページ
    When アクセスする
    Then 「3 年 / 1 年 / 半年 / 1 ヶ月」の 4 タブが表示される
    And 各タブは選択中の horizon で絞り込んだ目標一覧を表示する
    And 目標は title、goal_type (バッジ表示)、period、metric + target を表示する

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
      | metric_key（schema.METRIC_KEYS から select） |
      | target_value |
    And 保存すると `data/goals/{slug}.md` が作成される（Server Action が `fs.writeFile`）
    And frontmatter は GoalFrontmatterSchema を通過した値のみ書き込まれる

  Scenario: 目標を編集・削除できる
    Given /goals 一覧
    When ある目標の「編集」「削除」を押す
    Then 編集は同フォームが開いて `fs.writeFile` で上書き、削除は確認ダイアログ後 `fs.unlink`

  Scenario: 行動目標と結果目標が視覚的に区別される
    Given /goals 一覧
    When 表示を見る
    Then behavior は青系バッジ、outcome は緑系バッジなど視覚的に区別できる

  Scenario: horizon に応じた period デフォルトが提案される
    Given 新規作成フォーム
    When horizon を「1 ヶ月」に設定する
    Then period_start は当月 1 日、period_end は当月末がデフォルトで埋まる
    And horizon を「1 年」にすると period は当年度（例: 2026-04-01 〜 2027-03-31）

  Scenario: Vercel 本番では書き込みが失敗する（設計どおり）
    Given Vercel にデプロイされたインスタンス
    When 新規作成フォームを submit する
    Then ephemeral fs で書き込みは永続化しない（本番は read-only snapshot 想定）
    And エラーが表示されるか、無害に無視される
```

## Implementation Steps

- [ ] `app/(authed)/goals/` 配下を `app/goals/` に配置（認証レイアウト不要）
- [ ] `app/goals/page.tsx` — 一覧 + HorizonTabs
- [ ] `app/goals/new/page.tsx` — 新規作成フォーム
- [ ] `app/goals/[id]/edit/page.tsx` — 編集フォーム
- [ ] `components/goals/GoalForm.tsx` — 共通フォーム
- [ ] `components/goals/GoalCard.tsx` — 一覧行カード
- [ ] `components/goals/HorizonTabs.tsx` — 4 タブ切り替え
- [ ] `lib/data/goals.ts` に `writeGoal(goal)` と `deleteGoal(id)` を追加（Server Action から呼ぶ）
- [ ] `lib/goals/period-defaults.ts` — horizon ごとの period デフォルト util、単体テスト付き
- [ ] `raw/` に参考資料（Next.js Server Actions、shadcn form 関連）を投下（任意）
- [ ] `knowledge.md` に観察を記録
- [ ] Review（`/code-review`）
