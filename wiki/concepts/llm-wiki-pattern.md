# LLM Wiki パターン

## 定義

Andrej Karpathy が 2026 年 4 月に gist で提唱した、**raw / wiki / schema の三層構造**で LLM に知識を堆積させる設計パターン。RAG の「都度検索 → 合成」モデルを「LLM が事前に wiki を compile しておく」モデルに置き換える発想。

## ポイント

- **三層分離**: 原典（`raw/`）・LLM 維持の二次資料（`wiki/`）・両者をつなぐ schema（`CLAUDE.md` 相当）
- **compound knowledge**: 知識は query の度に再導出されるのではなく、wiki ページに堆積して複利で育つ
- **index.md + log.md**: 埋め込み基盤なしで検索性と履歴を両立する 2 枚のメタファイル
- **Ingest / Query / Lint** の 3 操作: Ingest で wiki を育て、Query で回答を作り、Lint で矛盾・orphan・stale claim を検出する
- **compounding は自動ではない**: trigger を明示しないと organic growth は発火しない（本リポジトリでの観察 — [[synthesis/karpathy-llm-wiki-meets-spec-driven]] 参照）

## 代表的な引用

> "Knowledge compounds over time rather than being re-derived. The wiki is a persistent, compounding artifact rather than ephemeral retrieved chunks." — Karpathy LLM Wiki gist

## 関連 Source

- [[sources/2026-04-17-pivot-from-supabase-to-markdown]]

## 関連概念

- [[concepts/markdown-first-data-layer]] — データ層を markdown に揃える拡張発想
- [[concepts/single-user-web-app-design]] — single-user 前提と相性が良い

## 関連エンティティ

- [[entities/andrej-karpathy]]
