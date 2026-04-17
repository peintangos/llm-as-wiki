# wiki/entities/ — Named Entity Pages

人物・プロダクト・組織など **固有名詞** のページを置く。

## 運用規約

- 1 エンティティ = 1 ファイル
- ファイル名: `{slug}.md`（例: `andrej-karpathy.md`、`claude-code.md`）
- slug は半角英小文字・数字・ハイフンのみ
- frontmatter に `entity_type`（`person` / `product` / `organization`）を記載

## 最小構成

```markdown
---
entity_type: person
---

# {Entity Name}

## 概要

1〜3 段落で who/what を説明する。

## 主な発信・成果

- 箇条書きで代表的な成果を列挙（それぞれ source へのリンク付き）

## 関連ページ

- [[concepts/xxx]]
- [[entities/yyy]]
- [[sources/zzz]]
```

## リンクのルール

- 他 wiki ページへのリンクは相対パス or Obsidian スタイルの `[[path]]` いずれかで統一する
- source ページへのリンクを最低 1 件含める（原典のない entity は追加しない）
