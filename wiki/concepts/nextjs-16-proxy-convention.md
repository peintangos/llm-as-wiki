# Next.js 16 `proxy` file convention

## 定義

Next.js 16 で、従来の `middleware.ts` file convention がすべて **`proxy.ts` にリネーム**された。関数名も `middleware()` → `proxy()`。`config.matcher` は互換。2026-04 の release で deprecation 警告が出るようになった。

## ポイント

- **単なる rename ではなく思想的メッセージング**: "middleware" は Express との混同を招き、濫用の温床だった。"proxy" はネットワーク境界性と Edge Runtime での動作を正確に表す
- **API は基本的に同じ**: NextRequest を受けて NextResponse を返す関数、`config.matcher` で対象パスを指定
- **codemod 提供**: `npx @next/codemod@canary middleware-to-proxy .` で自動変換
- **deprecation は warning のみ**: `middleware.ts` でも動作するが警告が出る。Next.js 17 以降で削除される可能性

## 代表的な引用

> "Middleware is highly capable, so it may encourage the usage; however, this feature is recommended to be used as a last resort." — [[sources/2026-04-17-nextjs-16-middleware-to-proxy]]

## 含意

- **LLM の訓練データが古いと自動で書けない**: 2026-01 以前の Next.js 知識で `middleware.ts` を書いてしまい、deprecated コードになる
- **LLM Wiki で常にリネーム情報を curate する必要**: framework のメジャー変更は LLM Wiki で早期に concept 化しないと、後続の agent 作業に誤り情報が伝染する

## 関連 Source

- [[sources/2026-04-17-nextjs-16-middleware-to-proxy]]
- [[sources/2026-04-17-supabase-ssr-nextjs-notes]]（Supabase Auth のセットアップでも middleware 前提だった）

## 関連エンティティ

- [[entities/nextjs]]
