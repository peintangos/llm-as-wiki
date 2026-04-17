# spec-002: Markdown-based データ層を配置する

## Overview

`personal-agent/data/` に markdown ベースのデータ層を配置する。Supabase のようなマネージド DB は**使わない**。目標と実績をすべてプレーンな markdown ファイルで管理し、Git 履歴が変更履歴を兼ねる単一ユーザー（peintangos）前提のローカル運用。zod スキーマと読み込みヘルパーを配置する（書き込みは後続 spec で）。

## Context

spec-002 は当初 Supabase（Postgres + Auth + RLS）前提で書かれていたが、単一ユーザーのローカル運用に Supabase は過剰と判明し 2026-04-17 にピボット。経緯は `knowledge.md` と `raw/articles/2026-04-17-pivot-from-supabase-to-markdown.md` を参照。

## Acceptance Criteria

```gherkin
Feature: Markdown-backed data layer

  Background:
    peintangos 1 人用のツール、認証・DB 不要
    LLM Wiki (raw/wiki/) と整合させる markdown-first 設計

  Scenario: data/ ディレクトリと seed が配置されている
    Given personal-agent/
    When data/ を確認する
    Then data/goals/ と data/actuals/ が存在する
    And data/README.md で運用ルール、ファイル形式、メトリクス語彙が明記される
    And data/goals/2026-04-monthly-note-posts.md（サンプル目標）が存在する
    And data/actuals/2026-04-17.md（サンプル実績）が存在する

  Scenario: zod スキーマと読み込みヘルパーが提供される
    Given personal-agent/lib/data/
    When 中身を確認する
    Then schema.ts で METRIC_KEYS, HORIZONS, GoalFrontmatterSchema, DayActualsFrontmatterSchema, zeroedDayActuals helper を export
    And goals.ts で listGoals() / getGoal(id) を export
    And actuals.ts で listDayActuals() / getDayActuals(date) / sumByMetric() を export
    And gray-matter が YAML 日付を Date に変換する挙動を preprocess で吸収

  Scenario: Home ページが読み込みを検証する
    Given 認証なしのトップページ /
    When ブラウザで開く
    Then "data/goals: N 件 / data/actuals: M 日分" が表示される
    And 実装直後の seed では N=1, M=1
    And ページは静的生成される（build 時 prerender → Vercel で read-only snapshot）

  Scenario: build 成功、warning なし
    Given 上記一式
    When npm run build を実行
    Then exit code 0、Turbopack で静的出力、routes に警告なし

  Scenario: 依存関係が最小化されている
    Given personal-agent/package.json
    When dependencies を確認
    Then gray-matter, zod を含む
    And @supabase/ssr, @supabase/supabase-js を含まない
```

## Implementation Steps

- [x] `@supabase/ssr` と `@supabase/supabase-js` を npm uninstall、`gray-matter` + `zod` を npm install
- [x] Supabase 関連のソース (`lib/supabase/`、`proxy.ts`、`app/login/`、`app/auth/callback/`、`supabase/migrations/`、`.env.example`) を削除
- [x] `lib/data/schema.ts`（METRIC_KEYS、HORIZONS、GoalFrontmatterSchema、DayActualsFrontmatterSchema、zeroedDayActuals helper、YAML 日付を string に戻す preprocess）
- [x] `lib/data/goals.ts`（listGoals、getGoal）
- [x] `lib/data/actuals.ts`（listDayActuals、getDayActuals、sumByMetric）
- [x] `data/README.md`、`data/goals/2026-04-monthly-note-posts.md`、`data/actuals/2026-04-17.md` を配置
- [x] `app/page.tsx` をサーバーコンポーネントで data/ を読む形に更新（認証削除、静的生成）
- [x] `npm run build` で静的生成・警告ゼロを確認
- [x] 意思決定記録を `raw/articles/2026-04-17-pivot-from-supabase-to-markdown.md` に配置
- [x] `knowledge.md` にピボット判断と学びを記録
- [x] `personal-agent/README.md` の Stack セクションを更新（Supabase 削除、gray-matter + zod 追記、markdown-first を強調）
