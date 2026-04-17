---
source_path: raw/articles/2026-04-17-supabase-ssr-nextjs-notes.md
source_url: https://supabase.com/docs/guides/auth/server-side/nextjs
author: peintangos（公式 docs の作業要約）
captured_at: 2026-04-17
---

# Supabase `@supabase/ssr` + Next.js App Router のセットアップ要約

## 要約

Supabase 公式の「Next.js server-side auth」ガイドを WebFetch したが summary しか返ってこなかったため、peintangos の作業知識から `@supabase/ssr` のセットアップを要約した二次資料。`NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を環境変数に置き、`lib/supabase/client.ts`・`server.ts`・`middleware.ts`・root の `middleware.ts` の 4 ファイルを配置する。cookie helper は `getAll` / `setAll` の 2 メソッド（旧版の `get` / `set` / `remove` から単純化）。

## 重要な引用

> 「Server Component の文脈で setAll を呼ぶと throw する（Next.js の制約）→ try/catch で握りつぶすか、middleware 経由でのみ書き込む設計にする。」

> 「Magic Link / OTP は `signInWithOtp({ email, options: { emailRedirectTo } })` で送信し、`/auth/callback?code=...` で `exchangeCodeForSession(code)` を呼ぶ。」

## このページから派生したコンセプト・エンティティ

- [[concepts/supabase-ssr-pattern]]
- [[entities/supabase]]
- [[entities/nextjs]]

## 派生した synthesis

- [[synthesis/supabase-vs-markdown-data-layer]]（本リポジトリでは最終的に不採用）
