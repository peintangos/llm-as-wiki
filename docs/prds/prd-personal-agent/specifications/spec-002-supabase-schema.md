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

- [ ] **[ユーザー手動]** Supabase プロジェクト（自前の peintangos アカウント）を用意し、URL と anon key を取得
- [x] `.env.example` を placeholder 付きで作成（`.env.local` はユーザーが埋める）
- [ ] **[ユーザー手動]** `.env.local` に Supabase 接続情報を設定、Vercel Dashboard にも同値を登録
- [x] `@supabase/supabase-js` と `@supabase/ssr` をインストール
- [x] `personal-agent/lib/supabase/{client.ts, server.ts, middleware.ts}` を作成（browser / server / updateSession ヘルパー）
- [x] `personal-agent/supabase/migrations/` ディレクトリを作成し、`0001_init.sql` を配置（goals / metrics / actuals + RLS + metrics seed data）。Supabase CLI を入れる代わりに migration ファイルだけを手動管理する方針
- [ ] **[ユーザー手動]** Supabase Dashboard の SQL Editor で `0001_init.sql` を実行、または `npx supabase db push`
- [ ] **[ユーザー手動]** Auth の Email provider を有効化、redirect URL に Vercel preview と localhost を追加
- [x] Next.js 16 の file convention に沿って `middleware.ts` → `proxy.ts` にリネーム（関数名も `proxy()`）、未認証リダイレクトを `/login` に実装
- [x] 簡易ログインページ（Email OTP マジックリンク送信フォーム）を `/login` に追加
- [x] `/auth/callback` の route handler を追加（`exchangeCodeForSession` でマジックリンクを処理）
- [x] Home (`/`) を更新し、認証済みなら email を表示 + sign-out ボタン、未認証なら `/login` に redirect
- [x] 参照した Supabase SSR パターンと Next.js 16 middleware-to-proxy 移行 docs を `raw/articles/` に投下（organic growth 観測）
- [x] `knowledge.md` に観察を記録（middleware→proxy リネーム、@supabase/ssr の getAll/setAll 新 API、docs fetch が summary のみ返す挙動）
- [x] Self-review: build 成功（Turbopack、警告ゼロ）、lint clean
- [ ] **[ユーザー手動]** 手動手順完了後、localhost と Vercel preview で magic link 認証フローが動くことを確認
