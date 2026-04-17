# Knowledge — LLM Wiki パターンを spec-driven 開発に適用する

本ファイルは、Karpathy の LLM Wiki パターンを本リポジトリに実装した過程で得た気づき・差分・ハマりどころを蓄積する場所。後続の記事執筆で一次素材として使う前提で、日付付きで追記する。

## Reusable Patterns

<!-- 実装中に見つけた、他の PRD でも再利用できるパターンを記録する。 -->

## Integration Notes

<!--
raw/ ↔ wiki/ ↔ docs/prds/ の責務境界や、Claude Code への指示の与え方など、
クロスカッティングな挙動・依存関係・セットアップで忘れやすい点を記録する。
-->

## Gotchas

<!--
Karpathy 原典どおりに実装したら逆に破綻した点、
Ralph Matsuo 運用と衝突した点、
Ingest / Query / Lint の実行で LLM が予想外の振る舞いをした点などを記録する。
-->

## Observations for Article

<!--
Zenn / note 記事ドラフトに使う観察。観点ごとに箇条書きで溜める。
-->

### Karpathy 原典に忠実に従えた点

- （spec-004 で Ingest を回した後に記入）

### 逸脱せざるを得なかった点

- （ローカル制約や spec-driven との整合で変えた点を記入）

### Ralph Matsuo 本家に backport したい要素

- （本リポジトリでの実験結果から、テンプレ本体に戻すべきだと判断した設計要素を記入）

### 感想・次に試したいこと

- （記事の「おわり」素材として、率直な体感を記入）

## Testing Notes

<!-- 本 PRD は手順主体なので、テスト観点は lint-repo / doc-contracts 等の既存テストが通ることで確認する。 -->
