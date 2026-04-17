# Wiki Log

本ファイルは Ingest / Query / Lint 操作の時系列記録。**追記専用**で、過去のエントリは編集しない。

## フォーマット規約

- エントリは `## [YYYY-MM-DD] operation | title` 形式
- operation は `bootstrap` / `ingest` / `query` / `lint` のいずれか
- 本文は自由記述だが、以下は必ず含める:
  - ingest: 取り込んだ source 数、新規 / 更新された wiki ページ数
  - query: 実行した question、引用した wiki ページ
  - lint: 検出された問題のカテゴリ別件数

grep で `^## \[` パターンを引けばタイムラインが取れるように、prefix は崩さない。

---

## [2026-04-17] bootstrap | wiki scaffolding created

spec-002 に基づき `wiki/` ディレクトリ構造を初期化した。

- `wiki/README.md`、`wiki/index.md`、`wiki/log.md` を配置
- サブディレクトリ `entities/`、`concepts/`、`sources/`、`synthesis/` を作成し、それぞれに `README.md` と `.gitkeep` を配置
- 新規ページ数: 0（カタログ枠のみ）
- 次ステップ: spec-003 で `CLAUDE.md` にスキーマを追加、spec-004 で seed ingest
