# Progress — LLM Wiki パターンを spec-driven 開発に適用する

Use only these status values: `pending`, `in-progress`, `done`

## Specification Status

| Specification | Title | Status | Completed On | Notes |
|---------------|-------|--------|--------------|-------|
| spec-001-raw-directory | raw/ ディレクトリを immutable source 層として新設する | done | 2026-04-17 | raw/ scaffolding 完了、architecture.md 更新済み |
| spec-002-wiki-scaffolding | wiki/ ディレクトリを LLM 維持層として scaffolding する | done | 2026-04-17 | index.md / log.md / 4 サブディレクトリ + README を配置 |
| spec-003-claude-md-schema | CLAUDE.md に LLM Wiki スキーマを追加する | done | 2026-04-17 | Three-Layer Architecture + Ingest/Query/Lint を命令形で記述、README.md 更新 |
| spec-004-seed-ingest | Seed ingest — raw/ への配置と wiki 生成 | pending | | |
| spec-005-query-lint | Query / Lint の実行と knowledge.md の確定 | pending | | |

## Summary

- Done: 3/5
- Current focus: spec-004（Seed ingest — raw/ に 10〜15 ソース配置 + Ingest 実行）
