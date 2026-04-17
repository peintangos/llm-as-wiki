# Knowledge — LLM Wiki パターンを spec-driven 開発に適用する

本ファイルは、Karpathy の LLM Wiki パターンを本リポジトリに実装した過程で得た気づき・差分・ハマりどころを蓄積する場所。後続の記事執筆で一次素材として使う前提で、日付付きで追記する。

## Reusable Patterns

<!-- 実装中に見つけた、他の PRD でも再利用できるパターンを記録する。 -->

### 2026-04-17 — 足場フェーズ完了時点のピボット判断

spec-001〜003（足場作成）の完了後、spec-004 の seed ingest を実行する直前で方針を変更した。

- **変更前の想定**: AI ネイティブ開発方法論に関する 10〜15 ソースを raw/ に配置し、Ingest を走らせて記事素材を得る
- **変更後の方針**: seed ingest は保留。peintangos が別のお題（目標 + 事業計画の可視化）で実開発する過程で、wiki が organic に育つかを観察する
- **理由**: seed ingest は「LLM Wiki について LLM Wiki を作る」という自己言及的な構造になり、記事のオチが弱くなる。Karpathy が想定した use case（Research / Personal）は、実作業の中で知識が堆積する方式なので、実開発と合わせた方が本物の運用感を記事に書ける
- **記事構成への影響**: Phase E の記事は「Karpathy の gist を読んで spec-driven に接続した → 新お題で実運用してみた」の 2 段構成に変わる。本 PRD（足場作成）は記事の前半、新 PRD（実運用）が後半

### 2026-04-17 — CLAUDE.md の Ingest trigger は自動発火しない

現行 CLAUDE.md の Ingest 定義は「raw/ に新規ファイルが現れた時に実行する」という受動的な trigger のみ。開発中に Claude Code が自発的にコンセプトを wiki/concepts/ に抽出することはない。organic growth を実現するには:

- 開発中に参照した外部ドキュメントを人間が raw/ へ投下する
- spec 完了時などのタイミングで Ingest を手動実行する
- （将来）CLAUDE.md に「spec 完了時 Ingest」などの新トリガーを追加する検討

この発見自体が、記事で「Karpathy の原典のままだと開発で勝手に育たない」という考察ポイントになる。

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
