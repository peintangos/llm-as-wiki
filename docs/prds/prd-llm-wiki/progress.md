# Progress — LLM Wiki パターンを spec-driven 開発に適用する

Use only these status values: `pending`, `in-progress`, `done`

## Specification Status

| Specification | Title | Status | Completed On | Notes |
|---------------|-------|--------|--------------|-------|
| spec-001-raw-directory | raw/ ディレクトリを immutable source 層として新設する | done | 2026-04-17 | raw/ scaffolding 完了、architecture.md 更新済み |
| spec-002-wiki-scaffolding | wiki/ ディレクトリを LLM 維持層として scaffolding する | done | 2026-04-17 | index.md / log.md / 4 サブディレクトリ + README を配置 |
| spec-003-claude-md-schema | CLAUDE.md に LLM Wiki スキーマを追加する | done | 2026-04-17 | Three-Layer Architecture + Ingest/Query/Lint を命令形で記述、README.md 更新 |
| spec-004-seed-ingest | Seed ingest — raw/ への配置と wiki 生成 | pending | | **Postponed**（2026-04-17）: seed ingest の自己言及的な性格より、新お題（目標 + 事業計画の可視化）での organic growth の方が記事として強いと判断。新 PRD の実運用結果を踏まえて後で書き直す可能性あり |
| spec-005-query-lint | Query / Lint の実行と knowledge.md の確定 | pending | | **Postponed**（2026-04-17）: spec-004 とセットで保留。新 PRD での実運用から得られる知見を反映して再設計する想定 |

## Summary

- Done: 3/5
- Postponed: 2/5（spec-004、spec-005）
- Current focus: 本 PRD は足場フェーズ完了で一旦凍結。新お題用の PRD（`prd-<slug>`）を別途作成し、そこで organic growth 実験を行う
