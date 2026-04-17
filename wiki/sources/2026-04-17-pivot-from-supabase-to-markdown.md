---
source_path: raw/articles/2026-04-17-pivot-from-supabase-to-markdown.md
source_url: internal-decision-record
author: peintangos（Claude との対話経由）
captured_at: 2026-04-17
---

# spec-002 で Supabase から markdown データ層にピボットした意思決定記録

## 要約

`prd-personal-agent` の spec-002 で Supabase（Postgres + Auth + RLS）のコード側を配置した直後、peintangos から「なぜ Supabase が必要なのか？」という問いを受けて前提を剥がした。Claude が無意識に置いていた「Web アプリ = Auth + DB が要る」という慣習前提が、単一ユーザー（peintangos のみ）のツールには過剰だった。結果、`data/goals/*.md` と `data/actuals/{yyyy-mm-dd}.md` の markdown ベースに移行。Auth・RLS・migration・env 変数すべて不要になり、LLM Wiki の `raw/` `wiki/` と言語を揃えられた。

## 重要な引用

> 「Claude に指摘されて無意識の前提を剥がすのは LLM Wiki 思想そのもの — wiki を compile するときの『この claim の根拠は？』と同じ問い」

> 「データ形式は LLM との協働を想定すべき時代。markdown を選ぶと Personal Agent が後で楽をする（raw/ や wiki/ と同じ方法で読める）」

> 「sunk cost は諦める。1 時間の作業を惜しむより、開発全体を汚染しないほうが優先」

## このページから派生したコンセプト・エンティティ

- [[concepts/markdown-first-data-layer]]
- [[concepts/single-user-web-app-design]]
- [[concepts/llm-wiki-pattern]]
- [[entities/andrej-karpathy]]

## 派生した synthesis

- [[synthesis/supabase-vs-markdown-data-layer]]
