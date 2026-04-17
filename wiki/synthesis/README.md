# wiki/synthesis/ — Cross-Source Synthesis Pages

複数の source を横断した **分析・比較・deep dive** を置く。source / concept / entity の単独ページでは表現しきれない「横の関係」を扱う層。

## 運用規約

- 1 synthesis = 1 ファイル。1 つのテーマに対する横断解析
- ファイル名: `{theme-slug}.md`（例: `karpathy-vs-ralph-matsuo-mapping.md`、`rag-vs-llm-wiki.md`）
- 必ず複数の source を参照する（単一 source しか引かない場合は concept / source ページで完結させる）

## 使いどころ

- **比較表**: 2 つ以上のパターン・プロダクト・考え方の構造的比較
- **対応マッピング**: 自リポジトリと外部パターンの対応関係
- **矛盾解析**: 複数 source で食い違う主張を並べて整理
- **時系列整理**: あるテーマの議論がどう推移したか
- **議論整理**: 賛否両論の整理

## 最小構成

```markdown
# {テーマ}

## 問い

この synthesis が答えようとしている問いを 1〜2 文で書く。

## 主要な観点

観点ごとに段落 or 表で整理する。比較は必ず表で。

## 参照元

- [[sources/aaa]]
- [[sources/bbb]]
- [[concepts/ccc]]

## 残された論点

この synthesis では解決しなかった問いを列挙する（次の ingest / query / synthesis の種になる）。
```

## 書き方の注意

- 事実（source が何を言ったか）と評価（どう解釈したか）を分ける
- 参照した source / concept / entity はすべて `## 参照元` に列挙する（orphan 防止）
- 残った論点を `## 残された論点` に書き残すことで、Lint が次の作業候補を抽出しやすくなる
