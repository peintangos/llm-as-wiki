---
source_url: https://supabase.com/docs/guides/auth/server-side/nextjs
author: Supabase
captured_at: 2026-04-17
note: "peintangos 自身の要約。原典 fetch は抜粋しか返さなかったため、`@supabase/ssr` の確立されたパターンを peintangos の作業知識でまとめたもの。"
---

# Supabase + Next.js App Router (SSR) の確立パターン（2026-04 時点の peintangos 要約）

## インストール

```bash
npm install @supabase/ssr @supabase/supabase-js
```

## 環境変数

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

公式ドキュメントは `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` という新名称を使う場合もあるが、ライブラリ側はどちらの名前でも受け取れる（実質は 2 つ目の引数の値として `createBrowserClient` / `createServerClient` に渡すだけ）。peintangos は既存 Supabase プロジェクトの "anon key" 命名を維持する方針。

## 4 つの設置ファイル

- `lib/supabase/client.ts` — `createBrowserClient` で client component から使う
- `lib/supabase/server.ts` — `createServerClient` を `cookies()` と組み合わせて server component / route handler から使う
- `lib/supabase/middleware.ts` — `updateSession(request)` を export。リクエスト cookie を読み、`NextResponse` を生成して cookie を forward する
- `middleware.ts`（プロジェクト root） — 上記 `updateSession` を呼ぶだけ。`config.matcher` で静的ファイルと公開パスを除外

## cookies helper のパターン

`@supabase/ssr` は getAll / setAll という 1 つだけのインターフェースに統一された（旧版では get / set / remove の 3 本だった）。setAll は Server Component の文脈では書き込めず throw するので、try / catch で握りつぶすか、middleware 経由でのみ書き込む設計にする。

## Magic Link / OTP 認証

```ts
const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

クリックされた link は `/auth/callback?code=...` を叩く。そこで:

```ts
const { error } = await supabase.auth.exchangeCodeForSession(code);
```

成功したら元のページ（next パラメータ or `/`）にリダイレクト。

## RLS 前提

`auth.uid()` と対象テーブルの `owner_id` を突き合わせる policy を各テーブルに書く。`metrics` のような参照データは `to authenticated using (true)` で読み取り全開、書き込みはサービスロール経由のみ。

## organic growth 観察

このファイル自体が「WebFetch が期待値を返さなかった」ことの記録。
Supabase 公式ドキュメントは JavaScript の少ない SPA で、fetch が summary 化された。raw/ に直接 markdown を置くのではなく、**peintangos の作業知識の要約** として配置している。

この種のソースは wiki/ への Ingest 時に、`wiki/sources/` ではなく `wiki/concepts/supabase-ssr-pattern.md` のような形で concept 化される想定。
