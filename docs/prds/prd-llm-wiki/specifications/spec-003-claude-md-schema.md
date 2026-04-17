# spec-003: CLAUDE.md に LLM Wiki スキーマを追加する

## Overview

既存 `CLAUDE.md` に「LLM Wiki」セクションを追加し、Ingest / Query / Lint の 3 操作を明文化する。Karpathy 原典の手順に忠実な形で、各操作の入力・LLM の成果物・人間の役割・実行手順を記述する。既存の Ralph Matsuo ワークフロー（`docs/prds/` 中心の spec-driven）と LLM Wiki の責務分離を明記する。

## Acceptance Criteria

```gherkin
Feature: CLAUDE.md documents the LLM Wiki schema

  Background:
    spec-001 により raw/ が存在する
    spec-002 により wiki/ が存在する
    既存 CLAUDE.md は Ralph Matsuo の spec-driven ワークフローを定義している

  Scenario: 「## LLM Wiki」セクションが追加されている
    Given CLAUDE.md
    When セクション構成を確認する
    Then 「## LLM Wiki」見出しが存在する
    And セクションは既存構造を壊さない位置に追加されている
    And Three-Layer Architecture（raw / wiki / schema）の ASCII 図と説明を含む

  Scenario: Ingest 操作が明文化されている
    Given 「### Ingest」サブセクション
    When 読む
    Then 入力として「raw/ に置かれた新規ソース」が明記される
    And LLM の成果物として以下が明記される:
      | artifact |
      | wiki/sources/*.md のサマリページ |
      | wiki/entities/*.md と wiki/concepts/*.md の追加・更新 |
      | wiki/synthesis/*.md の追加・更新（必要時） |
      | wiki/index.md の更新 |
      | wiki/log.md への追記 |
    And 人間の役割として「原典を選ぶ / curate する / 結果をレビューする」が明記される

  Scenario: Query 操作が明文化されている
    Given 「### Query」サブセクション
    When 読む
    Then wiki/index.md 経由で関連ページを特定する手順が記述される
    And citation 付きで回答を生成する手順が記述される
    And 価値ある回答は wiki/synthesis/ に還流可能、と記述される
    And wiki/log.md に Query エントリを追記する、と記述される

  Scenario: Lint 操作が明文化されている
    Given 「### Lint」サブセクション
    When 読む
    Then 検出対象が以下と明記される:
      | target |
      | 矛盾する記述 |
      | stale claim（新ソースで更新されるべき古い記述）|
      | orphan page（どこからもリンクされていない）|
      | missing cross-reference |
    And 結果を wiki/log.md に追記する手順が記述される

  Scenario: spec-driven ワークフローとの責務分離が明記されている
    Given CLAUDE.md の「## Workflow」または新設の責務分離セクション
    When 読む
    Then wiki/ は「横断的・永続的な知識の堆積」、docs/prds/ は「delivery scope の実行制御」という責務分離が明記される
    And 両者が参照し合うときの原則（wiki から docs/prds/ の一次コンテンツを指さない、docs/prds/ は wiki/ を参考資料として引用してよい）が記述される

  Scenario: Document System セクションが wiki/ と raw/ を含む
    Given 「## Document System」セクションの「### Other Documents」
    When 読む
    Then raw/ と wiki/ の項目が追加されている
    And 各項目に 1 行の役割説明が付いている

  Scenario: 手順は Claude Code が実行できる命令形で書かれている
    Given Ingest / Query / Lint の各サブセクション
    When 記述を読む
    Then 手順は Claude Code への命令として書かれている
      （例: "raw/ に新規ソースを検出したら、読んで要約し wiki/sources/{slug}.md を書く" のように二人称命令形）
    And 「〜は〜である」という説明的記述だけで終わらない
    And CLAUDE.md を読んだだけで Claude Code が Ingest を実行できる粒度にする
```

## Implementation Steps

- [ ] `CLAUDE.md` に「## LLM Wiki」セクションを追加する（既存構造を壊さない位置）
- [ ] Three-Layer Architecture の ASCII 図と説明を記載する
- [ ] Ingest / Query / Lint それぞれのサブセクションを記述する
- [ ] 「## Document System」の「### Other Documents」に raw/ と wiki/ を追加する
- [ ] spec-driven ワークフローとの責務分離を明記する
- [ ] `README.md` の overview セクションを更新し、LLM Wiki を試験導入中であることを 1 段落で紹介する
- [ ] Review（`/code-review`）
