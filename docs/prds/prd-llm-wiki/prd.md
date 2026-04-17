# Product Requirements Document (PRD) - LLM Wiki パターンを spec-driven 開発に適用する

## Branch

`ralph/llm-wiki`

## Overview

Andrej Karpathy が 2026 年 4 月に公開した "LLM Wiki" パターン（[gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)）を、本リポジトリに実装する。Karpathy が提案する三層構造（`raw/` / `wiki/` / `CLAUDE.md` スキーマ）を Ralph Matsuo の docs-first な spec-driven ワークフローと組み合わせ、peintangos が Ingest / Query / Lint を実際に運用して得た差分と気づきを、後続の記事化に利用できる形で記録する。

最終目的は以下の 2 つ:

1. LLM Wiki パターンを本リポジトリで動かし、運用感を体験する
2. 体験で得た知見を `knowledge.md` に蓄積し、記事ドラフトの一次素材にする

## Background

Karpathy の LLM Wiki は、RAG の「都度検索して合成する」モデルを「LLM が事前に wiki を compile しておく」モデルに置き換える。raw は immutable な原典、wiki は LLM が incremental に維持する二次資料、`CLAUDE.md` はその両者をつなぐスキーマ。知識は query の度に再導出されるのではなく、wiki ページに堆積して複利で育つ。

一方、本リポジトリ `llm-as-wiki` は Ralph Matsuo テンプレートをベースにした実験環境で、既に `docs/prds/prd-{slug}/` を LLM の単一コントロールプレーンとして扱っている。`progress.md`（カタログ）・git 履歴（時系列）・`CLAUDE.md`（スキーマ）など、LLM Wiki と思想的に対応する要素は既にあるが、次が欠けている:

- 原典と二次資料の明示的な層分離（`raw/` と `wiki/`）
- エンティティ / 概念ページによる cross-reference
- `lint` 操作（矛盾検出・orphan page 検出・stale claim 検出）

これらを補う実装を走らせ、spec-driven との共存可能性を実測する。成果は本リポジトリに残し、後で本家 Ralph Matsuo テンプレートへ `backport` する判断材料とする。

## Product Principles

- **Karpathy 原典への忠実度を優先する**: 三層構造、`index.md` と `log.md` のペア、Ingest / Query / Lint の 3 操作を原典どおりに採用する
- **docs-first と衝突させない**: `docs/prds/` は delivery scope の制御面、`wiki/` は横断的な知識面、と責務を分ける
- **実験可観測性を保つ**: 体験・差分・違和感はすべて `knowledge.md` に記録し、記事化で参照できる粒度にする
- **最小限で始める**: スクリプト化・Actions 化・外部ツール導入は後回し。`CLAUDE.md` 手順と人手のオペレーションで回す

## Scope

### In Scope

- リポジトリ root に `./raw/` と `./wiki/` を新設する
- `CLAUDE.md` に「LLM Wiki」セクションを追加し、Ingest / Query / Lint の手順を明文化する
- `raw/` に「AI ネイティブ開発方法論」に関するソースを 10〜15 件配置する
- LLM に Ingest を実行させ、`wiki/sources/`、`wiki/concepts/`、`wiki/entities/`、`wiki/synthesis/` にページを生成する
- Query 操作を 1〜2 回、Lint 操作を 1 回実行する
- 体験と差分を `docs/prds/prd-llm-wiki/knowledge.md` に記録する

### Out of Scope

- `/wiki-lint` などの専用スキル実装（操作手順は `CLAUDE.md` 記載のみ）
- GitHub Actions 側の自動化
- Obsidian や qmd など外部検索エンジンの導入
- Ralph Matsuo 本家テンプレートへの backport（本 PRD 完了後、別タスクで `backport` スキル経由で対応）

## Target Users

- peintangos（本リポジトリでの実験運用者 + 記事執筆者）
- 本テンプレートの将来的な採用者（backport 経由で LLM Wiki 導入オプションを受け取る）

## Use Cases

1. Karpathy の LLM Wiki パターンを、既存の spec-driven テンプレート上で実運用できる形に翻訳する
2. `wiki/` と `docs/prds/` の責務分離が運用で破綻しないかを実測する
3. Ingest / Query / Lint の 3 操作がドキュメント手順だけで回るかを確かめる
4. 実験ログを Zenn / note 記事の一次素材として蓄積する

## Functional Requirements

- FR-1: `./raw/` 配下の原典は不変として扱い、LLM は read のみ行う
- FR-2: `./wiki/` 配下の全ページは LLM が生成・更新可能で、人間はレビューと curate を担当する
- FR-3: `wiki/index.md` は Ingest のたびに LLM が更新し、全 wiki ページの 1 行要約カタログを保つ
- FR-4: `wiki/log.md` は追記専用で、各 Ingest / Query / Lint 操作を `## [YYYY-MM-DD] operation | title` 形式で記録する
- FR-5: `CLAUDE.md` の新セクションは、3 操作それぞれの入力・LLM の成果物・人間の役割を明記する
- FR-6: Seed ingest では実ソースを 10〜15 件配置し、対応する `wiki/sources/*.md` を生成する
- FR-7: 体験・気づき・Karpathy 原典との差分は `knowledge.md` に都度記録する

## UX Requirements

- `wiki/index.md` を読めば、全 wiki ページの存在と要約が 1 分で把握できる
- `wiki/log.md` を grep すれば、任意の操作履歴を時系列で追える
- `wiki/sources/*.md` から対応する `raw/` 原典へのポインタが辿れる

## System Requirements

- 既存の Ralph Matsuo 構成（Node.js 20+ / Bash）を変更しない
- 追加の外部依存は導入しない（`CLAUDE.md` 手順のみで Claude Code から実行）
- `ralph.toml` の既存ロール（`test_primary` 等）に影響を与えない

## Milestones

| Milestone | Description | Target Date |
|-----------|-------------|-------------|
| M1 | `raw/` と `wiki/` の scaffolding 完了 | 2026-04-18 |
| M2 | `CLAUDE.md` に LLM Wiki セクション追加 | 2026-04-19 |
| M3 | Seed ingest 完了・wiki 初版生成 | 2026-04-21 |
| M4 | Query / Lint 実施・`knowledge.md` 充足 | 2026-04-22 |
| M5 | 記事ドラフト準備完了（素材揃い） | 2026-04-23 |
