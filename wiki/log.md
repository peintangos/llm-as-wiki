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

## [2026-04-17] ingest | first real Ingest triggered by observation

peintangos の指摘「wiki, raw が育たない」を trigger に、累積していた raw/articles/ の 3 ファイルから初回 Ingest を実行。

取り込んだソース（3 件）:

- `raw/articles/2026-04-17-supabase-ssr-nextjs-notes.md`
- `raw/articles/2026-04-17-nextjs-16-middleware-to-proxy.md`
- `raw/articles/2026-04-17-pivot-from-supabase-to-markdown.md`

生成された wiki ページ（11 件）:

- sources: 3 件（1:1 対応）
- concepts: 5 件（llm-wiki-pattern、markdown-first-data-layer、single-user-web-app-design、nextjs-16-proxy-convention、supabase-ssr-pattern）
- entities: 3 件（andrej-karpathy、nextjs、supabase）
- synthesis: 2 件（supabase-vs-markdown-data-layer、karpathy-llm-wiki-meets-spec-driven）

index.md を全反映で更新。

**メタ観察（記事ネタの核心）**: これが「initial Ingest is observation-triggered」の実例。`CLAUDE.md` には "Run Ingest when new files appear" と書いたが、誰が "when" を判断するかが抜けていた。spec 実装モードに入った Claude は curator モードに戻らず、wiki が停滞していた。本件は `wiki/synthesis/karpathy-llm-wiki-meets-spec-driven.md` の観察 2 として記録済み。
