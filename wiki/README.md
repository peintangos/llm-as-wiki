# wiki/ — LLM-Maintained Knowledge Layer

`wiki/` は Karpathy の LLM Wiki パターンにおける **二次資料層**。`raw/` に置かれた原典を LLM が incremental に compile して生成・維持する markdown ページが集まる。

`raw/` が「手付かずの原典」だとすれば、`wiki/` は「LLM が整理した参照用ページ群」。知識は query の度に再導出されるのではなく、ここに堆積して複利で育つ。

## 運用ルール

- **write する主体は LLM**。人間はレビューと curate を担当する
- 各ページは `raw/` の原典を必ず引用する（`sources/` 経由、またはインライン pullquote）
- 人間が直接書くページもあるが、その場合は frontmatter に `maintained_by: human` を明記する
- `index.md` は Ingest のたびに LLM が更新する（全ページの 1 行要約カタログ）
- `log.md` は追記専用。Ingest / Query / Lint の操作をすべて時系列に記録する

## サブディレクトリ

| ディレクトリ | 責務 | 例 |
|------------|------|----|
| `sources/` | raw/ の原典 1 件に対応するサマリページ | `sources/2026-04-14-karpathy-llm-wiki.md` |
| `entities/` | 人物・プロダクト・組織などの固有名詞ページ | `entities/andrej-karpathy.md` |
| `concepts/` | 概念・パターン・方法論などの抽象名詞ページ | `concepts/llm-wiki-pattern.md` |
| `synthesis/` | 複数 source を横断した analysis・比較表・deep dive | `synthesis/karpathy-vs-ralph-matsuo-mapping.md` |

各サブディレクトリの詳細な運用規約は、それぞれの `README.md` を参照。

## raw/ との対応

- `raw/articles/foo.md`（原典）→ `wiki/sources/foo.md`（LLM が書いた要約）
- 1 raw = 0 or 1 source（まだ Ingest していない raw もあり得る）
- 1 source は、frontmatter で対応する `source_path: raw/articles/foo.md` を必ず持つ

## index.md と log.md

- **`index.md`** — 全 wiki ページの 1 行要約カタログ。これを読めば全体像が 1 分で把握できる。埋め込み基盤（ベクター検索など）を導入しない代わりに、このカタログと grep で検索する
- **`log.md`** — 操作の時系列記録。追記専用で編集しない。`## [YYYY-MM-DD] operation | title` 形式で Ingest / Query / Lint をすべて記録する

## ページ生成手順

Ingest / Query / Lint の具体的な手順は、本リポジトリの `CLAUDE.md` の「LLM Wiki」セクションを参照（spec-003 で追加）。
