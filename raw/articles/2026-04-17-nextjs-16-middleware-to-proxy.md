---
source_url: https://nextjs.org/docs/messages/middleware-to-proxy
author: Vercel / Next.js
captured_at: 2026-04-17
---

# Next.js 16: `middleware` → `proxy` リネーム

## 変更点

| 旧 | 新 |
|-----|-----|
| ファイル名 `middleware.ts` | **`proxy.ts`** |
| 関数名 `export function middleware()` | **`export function proxy()`** |
| `config.matcher` | 変更なし |

## なぜリネームされたか

Next.js 公式の説明:

> The reason behind the renaming of `middleware` is that the term "middleware" can often be confused with Express.js middleware, leading to a misinterpretation of its purpose. Also, Middleware is highly capable, so it may encourage the usage; however, this feature is recommended to be used as a last resort.

- Express.js の middleware と混同される語義問題
- "highly capable" すぎて濫用されがちだったため、機能を「最後の手段」に格下げするメッセージング
- "Proxy" はネットワーク境界性と Edge Runtime で動く挙動を正確に表す

## マイグレーション

Next.js が codemod を提供:

```bash
npx @next/codemod@canary middleware-to-proxy .
```

差分:

```diff
// middleware.ts -> proxy.ts

- export function middleware() {
+ export function proxy() {
```

## 含意（peintangos メモ）

- 本実装では手動リネームを採用（ファイル 1 つ、関数名 1 つの変更なので codemod を入れる必要なし）
- `lib/supabase/middleware.ts` のほうは**ヘルパー関数を提供するだけ**なのでリネームしない — そこは純粋なユーティリティで、Next.js の file convention ではない
- 記事ネタとして: 「Next.js 16 のリネームは、"middleware を使いすぎるな" という思想的メッセージングでもあった。Express 畑のエンジニアがつい濫用するのを抑制するための API 改名」
