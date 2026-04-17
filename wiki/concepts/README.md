# wiki/concepts/ — Concept Pages

概念・パターン・方法論・手法など **抽象名詞** のページを置く。

## 運用規約

- 1 コンセプト = 1 ファイル
- ファイル名: `{slug}.md`（例: `llm-wiki-pattern.md`、`spec-driven-development.md`）
- slug は半角英小文字・数字・ハイフンのみ

## 最小構成

```markdown
# {Concept Name}

## 定義

1〜2 文で簡潔に定義する。誰が言い出したか、いつ提唱されたかが分かる場合は含める。

## ポイント

- 要素 1
- 要素 2
- 要素 3

## 代表的な引用

> 原文 pullquote — source へのリンクを必ず付ける

## 関連 Source

- [[sources/xxx]]

## 関連概念

- [[concepts/yyy]]
- [[entities/zzz]]
```

## 書き方の注意

- 定義は原典の言葉を尊重し、意訳しすぎない
- 複数の source で定義がズレる場合は、ズレを明示する（後の Lint で検知されやすくなる）
- 他 concept や entity との関係は、`## 関連概念` に必ずリンクする（orphan 防止）
