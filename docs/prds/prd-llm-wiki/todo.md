# TODO — LLM Wiki パターンを spec-driven 開発に適用する

<!--
Keep tasks in priority order.
Each unchecked task should be small enough to complete in one `/implement` run or one Ralph iteration.
Mark completed tasks with `- [x]` instead of removing them.
-->

- [x] spec-001: `./raw/README.md` を作成（コンベンション明記）
- [x] spec-001: `./raw/{articles,gists,papers,transcripts}/` を作成し `.gitkeep` を配置
- [x] spec-001: `.gitignore` を確認し `docs/architecture.md` に `raw/` を追記
- [x] spec-002: `./wiki/README.md` を作成
- [x] spec-002: `./wiki/index.md` 初版を作成（空カタログ + フォーマット規約）
- [x] spec-002: `./wiki/log.md` 初版を作成（bootstrap エントリ）
- [x] spec-002: `./wiki/{entities,concepts,sources,synthesis}/` を作成し `.gitkeep` + `README.md` を配置
- [x] spec-002: `docs/architecture.md` に `wiki/` を追記
- [x] spec-003: `CLAUDE.md` に「## LLM Wiki」セクションを追加（Three-Layer Architecture）
- [x] spec-003: Ingest / Query / Lint のサブセクションを命令形で記述
- [x] spec-003: `## Document System` に raw/ と wiki/ を追加し、spec-driven との責務分離を明記
- [x] spec-003: `README.md` overview を 1 段落更新
- [ ] spec-004: `raw/` に 10〜15 ソースを配置（Karpathy gist、Vibe Coding 記事、spec-driven 解説など）
- [ ] spec-004: Ingest を実行し `wiki/sources/`、`wiki/concepts/`、`wiki/entities/`、`wiki/synthesis/` を生成
- [ ] spec-004: `wiki/index.md` と `wiki/log.md` の反映を確認
- [ ] spec-004: Ingest 段階の観察を `knowledge.md` に記入
- [ ] spec-005: Query 1〜2 回実行（citation 付き回答、必要に応じて synthesis 還流）
- [ ] spec-005: Query ログを `wiki/log.md` に追記
- [ ] spec-005: Lint 実行（4 カテゴリのレポート）
- [ ] spec-005: Lint 結果を `wiki/log.md` に追記し、明らかな問題を curate
- [ ] spec-005: `knowledge.md` の全観点を埋めて記事素材を確定
