# spec-004: 実績手入力フォーム（X / アポ / イベント / 商談）

## Overview

自動取得できないメトリクス（X ポスト数、社長アポ数、イベント出席数、商談成功数）を手入力するフォームを作る。データ層は `data/actuals/{yyyy-mm-dd}.md`。Server Action が `lib/data/actuals.ts` の writeDayActuals helper 経由で markdown を書き換える（frontmatter の metrics と sources を merge、source='manual' を記録）。

## Acceptance Criteria

```gherkin
Feature: Manual actuals entry form

  Background:
    spec-002 で data/actuals/ と lib/data/actuals.ts は準備済み
    spec-003 と並行または前後して実装可能

  Scenario: 実績入力ページが存在する
    Given /actuals/new
    When アクセスする
    Then フォームが表示され以下を入力できる:
      | field |
      | metric_key (select: x_posts / meetings / events / deals) |
      | value (正の数) |
      | recorded_date (default: 今日) |
      | note (任意、本文として markdown body に追記) |
    And 保存すると `data/actuals/{recorded_date}.md` に対して:
      - 既存ファイルがあれば frontmatter の metrics[metric_key] を上書き、sources[metric_key]='manual' を記録、body は note を append
      - なければ `zeroedDayActuals` で初期化してから上書き

  Scenario: 実績一覧で編集・削除できる
    Given /actuals ページ
    When 一覧から過去の手入力行の「編集」「削除」を押す
    Then 編集は同フォームが開いて markdown を上書き、削除は確認ダイアログ後、該当日の該当メトリクスを 0 に戻す（ファイル全削除はしない、他メトリクスが残っているので）

  Scenario: 実績一覧がフィルタできる
    Given /actuals ページ
    When metric_key でフィルタ、日付レンジで絞る
    Then 該当実績のみ表示される

  Scenario: RSS 由来の実績は手入力側で編集できない
    Given source='rss' の行
    When /actuals 一覧で表示される
    Then 行には「自動取得」バッジが付く
    And 編集・削除ボタンは非表示 or disabled

  Scenario: 月別入力モード
    Given 新規フォーム
    When 「月別入力モード」を切り替える
    Then recorded_date は当月 1 日に自動セット
    And 1 操作で当月分の数量として記録される（代表日 = 月初）
```

## Implementation Steps

- [x] `app/actuals/page.tsx` — 一覧
- [x] `app/actuals/new/page.tsx` — 新規入力
- [x] `app/actuals/[date]/[metric]/edit/page.tsx` — 編集（date + metric で行を特定）
- [x] `components/actuals/ActualForm.tsx` — フォーム
- [x] `components/actuals/ActualTable.tsx` — 一覧
- [x] `lib/data/actuals.ts` に `writeDayActuals(date, patch)` を追加（frontmatter を merge、既存ファイルがなければ zeroedDayActuals で初期化）
- [x] フィルタ UI（metric_key select + 日付レンジ）
- [x] source='rss' の行は read-only 扱い
- [x] `knowledge.md` に観察を記録
- [x] Review（`/code-review`）
