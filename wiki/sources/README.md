# wiki/sources/ — Source Summary Pages

`raw/` の原典 **1 件に対応する要約ページ** を置く。wiki 内で原典を参照するときのエントリポイント。

## 運用規約

- 1 原典 = 1 source ページ
- ファイル名は `raw/` の slug を踏襲する
  - 例: `raw/articles/2026-04-14-karpathy-llm-wiki.md` → `wiki/sources/2026-04-14-karpathy-llm-wiki.md`
- frontmatter で対応する raw ファイルへのパスを必ず示す

## 最小構成

```markdown
---
source_path: raw/articles/2026-04-14-karpathy-llm-wiki.md
source_url: https://example.com/original-article
author: Author Name
captured_at: 2026-04-17
---

# {原典タイトル}

## 要約

300〜500 字程度で原典の主張を要約する。意訳ではなく論旨を保つ。

## 重要な引用

> 原文 pullquote（必要に応じて複数）

> 別の pullquote

## このページから派生したコンセプト・エンティティ

- [[concepts/xxx]]
- [[entities/yyy]]

## 派生した synthesis

- [[synthesis/zzz]]（該当がある場合のみ）
```

## Ingest 時の注意

- 要約は原典の**主張**を保つ。評価・解釈は入れない（評価は `synthesis/` で行う）
- pullquote は 1 ファイルあたり 3〜5 件を目安。引用しすぎない
- 原典に無い情報を source ページに書かない（新規情報は concept / synthesis 側で）
