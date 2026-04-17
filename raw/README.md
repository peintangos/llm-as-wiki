# raw/ — Immutable Source Layer

`raw/` は LLM Wiki パターンにおける**不変の原典層**。Andrej Karpathy が [LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) で定義した raw / wiki / schema 三層のうち最下層にあたる。

本ディレクトリに置かれたファイルは「知識のグラウンドトゥルース」として扱う。LLM が生成する二次資料（`wiki/`）は、ここを必ず引用元として参照する。

## 運用ルール

- **write する主体は人間のみ**。LLM は read のみ行う。
- **既存の原典は編集しない**。誤りや追加情報があっても上書きではなく、新版として別ファイルを追加する（例: `2026-04-14-karpathy-llm-wiki.v2.md`）。
- **版管理対象**。`.gitignore` で除外しない。本リポジトリの履歴は「原典セットがいつ更新されたか」の記録でもある。
- **機微情報は置かない**。private リポジトリでも、後で public 化する可能性を考慮する。
- **ファイルの粒度は "1 ソース = 1 ファイル"**。複数原典を 1 ファイルに混ぜない。

## ディレクトリ分類

| ディレクトリ | 用途 |
|------------|------|
| `articles/` | ブログ記事、メディア記事、個人サイト投稿 |
| `gists/` | GitHub Gist、短いスニペット、非公式メモ |
| `papers/` | 論文、技術ホワイトペーパー、PDF から変換した markdown |
| `transcripts/` | 動画、ポッドキャスト、カンファレンス発表の文字起こし |

目的に合う分類が無ければ新規ディレクトリを追加してよい。その際は本 README の表に 1 行追記する。

## ファイル命名

- 推奨: `YYYY-MM-DD-slug.md`
  - 例: `2026-04-14-karpathy-llm-wiki.md`
  - 日付は**原典が公開された日**（取得日ではない）
- スラッグは半角英小文字・数字・ハイフンのみ
- 拡張子は原則 `.md`。どうしても markdown 化できない原本（PDF、画像など）は `.pdf`・`.png` のまま置いてよいが、可能なら markdown 版も併置する

## YAML Frontmatter

取得情報がある場合は先頭に以下を付ける:

```yaml
---
source_url: https://example.com/original-article
author: Author Name
captured_at: 2026-04-17
license: CC-BY-4.0  # わかれば
---
```

## なぜ raw を wiki と分けるのか

Karpathy の主張は「RAG は取得と合成を毎回やり直すから、何を原典としたかが拡散する」。本パターンでは raw と wiki を物理的に分離することで:

- **責務分離**: 人間が curate する一次資料（`raw/`）と、LLM が compile する二次資料（`wiki/`）が別場所になる
- **検証可能性**: `wiki/` の記述に疑義が生じたとき、`raw/` を辿れば真偽を確認できる
- **差分再生成**: 原典セットを差し替えれば、`wiki/` を部分的に再生成できる

本層のオペレーション手順（Ingest / Query / Lint）は、spec-003 で `CLAUDE.md` に追加される「LLM Wiki」セクションに定義される。
