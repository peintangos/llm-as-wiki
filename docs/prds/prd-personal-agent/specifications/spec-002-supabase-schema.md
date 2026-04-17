# spec-002: Supabase 接続とデータモデル定義

## Overview

Supabase プロジェクトに接続し、`goals`・`metrics`・`actuals` の 3 テーブルを含むスキーマを定義する。Email OTP の Auth を有効化し、RLS policy で本人以外を遮断する。migration を `personal-agent/supabase/migrations/` に配置する。

## Acceptance Criteria

```gherkin
Feature: Supabase schema and auth ready

  Background:
    spec-001 で Next.js 基盤は scaffold 済み
    Supabase プロジェクト（自前）が存在する

  Scenario: Supabase 接続情報が .env.local に設定されている
    Given personal-agent/
    When .env.local を確認する
    Then NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されている
    And .env.local は .gitignore に含まれる
    And .env.example が公開用テンプレートとして存在する

  Scenario: goals テーブルが定義されている
    Given personal-agent/supabase/migrations/
    When 最新 migration を読む
    Then goals テーブルが以下のカラムを持つ:
      | column | type | notes |
      | id | uuid primary key | default gen_random_uuid() |
      | owner_id | uuid | auth.users(id) への FK、NOT NULL |
      | title | text | NOT NULL |
      | description | text | |
      | goal_type | text | 'behavior' / 'outcome' のいずれか |
      | horizon | text | '3yr' / '1yr' / 'half' / 'month' のいずれか |
      | period_start | date | NOT NULL |
      | period_end | date | NOT NULL |
      | metric_key | text | metrics.key への参照（nullable） |
      | target_value | numeric | nullable |
      | created_at | timestamptz | default now() |

  Scenario: metrics テーブルが定義されている
    Given personal-agent/supabase/migrations/
    When 最新 migration を読む
    Then metrics テーブルが以下のカラムを持つ:
      | column | type | notes |
      | key | text primary key | 'note_count' 'zenn_count' 'x_posts' 'meetings' 'events' 'deals' など |
      | label | text | 表示用 |
      | unit | text | 'posts' 'meetings' など |
    And 上記 6 種が seed data として初期投入される

  Scenario: actuals テーブルが定義されている
    Given personal-agent/supabase/migrations/
    When 最新 migration を読む
    Then actuals テーブルが以下のカラムを持つ:
      | column | type | notes |
      | id | uuid primary key | default gen_random_uuid() |
      | owner_id | uuid | auth.users(id) への FK、NOT NULL |
      | metric_key | text | metrics.key への FK、NOT NULL |
      | value | numeric | NOT NULL |
      | recorded_date | date | NOT NULL |
      | source | text | 'manual' / 'rss' のいずれか |
      | note | text | nullable |
      | created_at | timestamptz | default now() |

  Scenario: RLS policy が本人のみ読み書き可に設定されている
    Given 上記 3 テーブル
    When RLS policy を確認する
    Then goals / actuals は auth.uid() = owner_id の場合のみ SELECT / INSERT / UPDATE / DELETE 可能
    And metrics は全認証ユーザーが SELECT 可能、書き込みは service_role のみ

  Scenario: Supabase Auth が Email OTP で有効化されている
    Given Supabase ダッシュボード
    When Authentication 設定を確認する
    Then Email provider が有効
    And OTP (magic link or code) が有効化されている

  Scenario: Next.js から Supabase にアクセスできる
    Given personal-agent/lib/supabase/client.ts と server.ts
    When import して使う
    Then @supabase/ssr を使ったクライアント / サーバーそれぞれの helper が提供される
```

## Implementation Steps

- [ ] Supabase プロジェクト（自前の peintangos アカウント）を用意し、URL と anon key を取得
- [ ] `personal-agent/.env.local` に Supabase 接続情報を設定、`.env.example` をテンプレとしてコミット
- [ ] `@supabase/supabase-js` と `@supabase/ssr` をインストール
- [ ] `personal-agent/lib/supabase/{client.ts, server.ts, middleware.ts}` を作成
- [ ] Supabase CLI を導入（`npx supabase init`）し、`personal-agent/supabase/` を作成
- [ ] migration `0001_init.sql` を作成: goals / metrics / actuals テーブル定義 + RLS policy + metrics seed data
- [ ] `npx supabase db push`（or ダッシュボードでの手動実行）で remote に適用
- [ ] Auth の Email provider を有効化、redirect URL に Vercel preview と localhost を追加
- [ ] Next.js middleware で未認証時に `/login` へリダイレクト
- [ ] 簡易ログインページ（Email OTP）を追加
- [ ] 参照した Supabase ドキュメントを `raw/articles/` に投下（organic growth 観測）
- [ ] `knowledge.md` に観察を記録
- [ ] Review（`/code-review`）
