# spec-004: 実績手入力フォーム（X / アポ / イベント / 商談）

## Overview

自動取得できないメトリクス（X ポスト数、社長アポ数、イベント出席数、商談成功数）を手入力するフォームを作る。日別または月別で数量を記録でき、編集・削除もできる。`source='manual'` として `actuals` テーブルに保存する。

## Acceptance Criteria

```gherkin
Feature: Manual actuals entry form

  Background:
    spec-002 で actuals テーブルは定義済み
    spec-003 と並行 or 前後して実装可能

  Scenario: 実績入力ページが存在する
    Given 認証済みユーザー
    When /actuals/new へアクセスする
    Then フォームが表示され以下を入力できる:
      | field |
      | metric_key (select: x_posts / meetings / events / deals) |
      | value (正の数) |
      | recorded_date (default: 今日) |
      | note (任意) |
    And 保存すると actuals テーブルに INSERT され source='manual' が自動で入る

  Scenario: 月別集計の入力もできる
    Given 新規フォーム
    When 「月別入力モード」を切り替える
    Then recorded_date は「月初日」に自動セット
    And 1 レコードで 1 ヶ月分の数量を記録できる

  Scenario: 実績一覧で編集・削除できる
    Given /actuals ページ
    When 一覧から過去の手入力実績の行をクリック
    Then 編集フォームが開き UPDATE できる
    And 削除ボタンで DELETE できる（確認ダイアログあり）

  Scenario: 実績一覧がフィルタできる
    Given /actuals ページ
    When metric_key でフィルタ、日付レンジで絞る
    Then 該当実績のみ表示される

  Scenario: RSS 由来の実績は手入力側で編集できない
    Given source='rss' の actuals
    When /actuals 一覧で表示される
    Then 行には「自動取得」バッジが付く
    And 編集・削除ボタンは非表示（or disabled）
```

## Implementation Steps

- [ ] `personal-agent/app/(authed)/actuals/page.tsx` — 実績一覧
- [ ] `personal-agent/app/(authed)/actuals/new/page.tsx` — 新規入力
- [ ] `personal-agent/app/(authed)/actuals/[id]/edit/page.tsx` — 編集
- [ ] `personal-agent/components/actuals/ActualForm.tsx` — フォーム
- [ ] `personal-agent/components/actuals/ActualTable.tsx` — 一覧
- [ ] `personal-agent/lib/actuals/{schema.ts, queries.ts, actions.ts}` — zod schema、Supabase クエリ、Server Actions
- [ ] フィルタ UI（metric_key select + 日付レンジ）
- [ ] source='rss' の行は read-only 扱い
- [ ] `knowledge.md` に観察を記録
- [ ] Review（`/code-review`）
