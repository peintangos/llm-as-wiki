# Wiki Index

本ファイルは `wiki/` 配下の全ページの 1 行要約カタログ。Ingest のたびに LLM が更新する。このインデックスと grep が、埋め込み基盤を使わない検索エントリポイント。

## フォーマット規約

- 1 ページ = 1 行
- 書式: `- [ページタイトル](相対パス.md) — 1 行要約`
- セクションは下記 4 カテゴリのみ。新しいカテゴリは `wiki/README.md` に追記してから採用する
- 追加・削除・要約変更は Ingest / Lint のたびに反映する

## Entities

- [Andrej Karpathy](entities/andrej-karpathy.md) — LLM Wiki パターンの提唱者、元 OpenAI / Tesla AI researcher
- [Next.js](entities/nextjs.md) — React-based Web framework、16.2 が本リポジトリ採用
- [Supabase](entities/supabase.md) — Postgres ベース BaaS、本リポジトリでは spec-002 で採用 → ピボットで不採用

## Concepts

- [LLM Wiki パターン](concepts/llm-wiki-pattern.md) — raw / wiki / schema の三層構造で知識を compound させる Karpathy の提案
- [Markdown-first データ層](concepts/markdown-first-data-layer.md) — DB ではなく markdown ファイルをデータ層にする設計
- [単一ユーザー Web アプリの設計](concepts/single-user-web-app-design.md) — Auth / DB / RLS が要らない個人ツールの構成
- [Next.js 16 `proxy` file convention](concepts/nextjs-16-proxy-convention.md) — middleware リネームと思想的メッセージング
- [`@supabase/ssr` + Next.js App Router パターン](concepts/supabase-ssr-pattern.md) — Supabase 公式の server-side auth 標準

## Sources

- [Supabase `@supabase/ssr` + Next.js セットアップ要約](sources/2026-04-17-supabase-ssr-nextjs-notes.md) — peintangos の作業要約（公式 docs の WebFetch が summary しか返さなかったため二次資料扱い）
- [Next.js 16: middleware → proxy リネームの公式ガイド](sources/2026-04-17-nextjs-16-middleware-to-proxy.md) — Vercel 公式、codemod 提供あり
- [spec-002 で Supabase から markdown にピボットした意思決定記録](sources/2026-04-17-pivot-from-supabase-to-markdown.md) — 本リポジトリ内の decision record

## Synthesis

- [Supabase vs Markdown データ層 — 単一ユーザーツールでの選定](synthesis/supabase-vs-markdown-data-layer.md) — 9 観点の比較表、ピボットの判断根拠
- [Karpathy の LLM Wiki を spec-driven 開発に適用するとどうなるか](synthesis/karpathy-llm-wiki-meets-spec-driven.md) — 本リポジトリ全体の meta synthesis、organic growth が自動発火しない発見を中心に
