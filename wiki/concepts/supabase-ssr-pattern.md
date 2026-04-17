# `@supabase/ssr` + Next.js App Router のセットアップパターン

## 定義

Supabase 公式が推奨する、Next.js App Router 向けの server-side auth セットアップ。`@supabase/ssr` パッケージを使い、Browser client / Server client / Middleware helper の 3 つを配置する。旧 `@supabase/auth-helpers-nextjs` を置き換える新標準。

## ポイント

- **4 つの設置ファイル**:
  - `lib/supabase/client.ts` — `createBrowserClient`（client component から）
  - `lib/supabase/server.ts` — `createServerClient` + `cookies()`（server component / route handler から）
  - `lib/supabase/middleware.ts` — `updateSession(request)` helper
  - プロジェクト root の `middleware.ts`（Next.js 16 では `proxy.ts`）— 上記 `updateSession` を呼ぶだけ
- **cookie helper は getAll / setAll の 2 メソッドに単純化**: 旧版の `get` / `set` / `remove` の 3 本から変更
- **Server Component の制約**: setAll は Server Component 文脈で throw する → try/catch で握りつぶすか、middleware 経由でのみ書き込む
- **Magic Link / OTP**: `signInWithOtp({ email, options: { emailRedirectTo } })` で送信、`/auth/callback?code=...` で `exchangeCodeForSession(code)` を呼ぶ

## 代表的な引用

> 「Server Component で setAll を呼ぶと throw するが、middleware で session を refresh しているので実害はない」— [[sources/2026-04-17-supabase-ssr-nextjs-notes]]

## 含意

- 単一ユーザー・ローカル運用のツールには**過剰設計**になりうる。Auth・RLS・migration がすべて必要になり、markdown ファイルで済むケースに銀行金庫を作る構図（[[concepts/markdown-first-data-layer]] で置換可能）
- Next.js 16 の `middleware` → `proxy` リネーム（[[concepts/nextjs-16-proxy-convention]]）に併せて、root の `middleware.ts` を `proxy.ts` にリネームする必要がある

## 関連 Source

- [[sources/2026-04-17-supabase-ssr-nextjs-notes]]

## 関連エンティティ

- [[entities/supabase]]
- [[entities/nextjs]]
