# spec-005: Query / Lint の実行と knowledge.md の確定

## Overview

spec-004 で生成された wiki に対して Query 操作を 1〜2 回、Lint 操作を 1 回実行する。citation 付き回答と Lint レポートを `wiki/log.md` に記録し、実験を通じた体験・差分・次の課題を `docs/prds/prd-llm-wiki/knowledge.md` に確定させる。本 spec の成果物は「動く Query / Lint の実行記録」と「記事ドラフトに直接使える知見ログ」の 2 つ。

## Acceptance Criteria

```gherkin
Feature: Query and Lint exercise the wiki, and knowledge.md captures article material

  Background:
    spec-004 が完了し、wiki 初版が存在する

  Scenario: Query 1〜2 回が citation 付きで回答を生成する
    Given 生成された wiki
    When 「LLM Wiki と spec-driven 開発の思想的差分は？」という Query を実行する
    And （任意）「Karpathy パターンのうち本リポジトリで再現できなかった要素は？」という Query を追加で実行する
    Then 各 Query に対して citation 付きの回答が生成される
    And 回答は wiki/ 配下のページを引用する
    And 価値ある回答は wiki/synthesis/ に還流される（必要に応じて）
    And wiki/log.md に各 Query エントリが `## [YYYY-MM-DD] query | {question}` 形式で追記される

  Scenario: Lint が 4 カテゴリのレポートを生成する
    Given 生成された wiki
    When Lint 操作を実行する
    Then 以下のカテゴリでレポートが生成される:
      | category | example |
      | 矛盾する記述 | concept A の定義が page X と Y で食い違う |
      | stale claim | 新ソースで更新されるべき古い記述 |
      | orphan page | どこからもリンクされていない |
      | missing cross-reference | 関連ページへのリンク漏れ |
    And レポートが wiki/log.md に `## [YYYY-MM-DD] lint | results summary` として追記される
    And 発見された問題のうち、明らかなものは人間が curate する

  Scenario: 記事素材が knowledge.md に蓄積されている
    Given Query / Lint の完了
    When docs/prds/prd-llm-wiki/knowledge.md を読む
    Then 以下の観点が記録されている:
      | observation |
      | Karpathy 原典に忠実に従えた点 |
      | 逸脱せざるを得なかった点（ローカル制約）|
      | Ralph Matsuo 運用との接続点・衝突点 |
      | Ingest / Query / Lint を実行してみての違和感 |
      | Ralph Matsuo 本家に backport したい要素 |
      | 感想・次に試したいこと（記事の「おわり」素材）|
    And 各観点は具体例・引用・行番号など第一次情報を伴う
```

## Implementation Steps

- [ ] Query を 1 回実行する（「LLM Wiki と spec-driven 開発の思想的差分は？」）
- [ ] （任意）追加 Query を実行する
- [ ] Query の結果を wiki/log.md に追記する
- [ ] 価値ある回答は wiki/synthesis/*.md に保存する
- [ ] Lint を実行し、4 カテゴリのレポートを生成する
- [ ] Lint レポートを wiki/log.md に追記する
- [ ] Lint で見つかった明らかな問題を curate する
- [ ] `knowledge.md` の全観点を埋めて、記事素材として確定する
- [ ] `progress.md` を更新する
- [ ] Review（`/code-review`）
