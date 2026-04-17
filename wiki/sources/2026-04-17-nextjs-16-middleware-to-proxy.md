---
source_path: raw/articles/2026-04-17-nextjs-16-middleware-to-proxy.md
source_url: https://nextjs.org/docs/messages/middleware-to-proxy
author: Vercel / Next.js
captured_at: 2026-04-17
---

# Next.js 16: `middleware` → `proxy` リネームの公式ガイド

## 要約

Next.js 16 で `middleware.ts` file convention が `proxy.ts` にリネームされた。関数名も `middleware()` → `proxy()`。`config.matcher` は変更なし。公式 codemod は `npx @next/codemod@canary middleware-to-proxy .`。理由は「Express.js の middleware と混同されやすく、強力な機能なので濫用を招いていた」。"proxy" のほうがネットワーク境界性と Edge Runtime で動く挙動を正しく示す、との思想的メッセージング。

## 重要な引用

> "The reason behind the renaming of `middleware` is that the term 'middleware' can often be confused with Express.js middleware, leading to a misinterpretation of its purpose. Also, Middleware is highly capable, so it may encourage the usage; however, this feature is recommended to be used as a last resort."

> "The name Proxy clarifies what Middleware is capable of. The term 'proxy' implies that it has a network boundary in front of the app."

## このページから派生したコンセプト・エンティティ

- [[concepts/nextjs-16-proxy-convention]]
- [[entities/nextjs]]

## 派生した synthesis

- [[synthesis/supabase-vs-markdown-data-layer]] — `proxy.ts` は Supabase Auth 中継用に配置したが、markdown データ層へのピボットで不要になり削除
