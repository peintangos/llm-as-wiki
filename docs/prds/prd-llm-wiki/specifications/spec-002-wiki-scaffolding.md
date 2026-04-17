# spec-002: wiki/ ディレクトリを LLM 維持層として scaffolding する

## Overview

リポジトリ root に `./wiki/` を新設し、LLM が incremental に compile・維持する二次資料層を構築する。Karpathy 原典に従い、`index.md`（カタログ）と `log.md`（追記専用の時系列）のペア、および `entities/`・`concepts/`・`sources/`・`synthesis/` の 4 サブディレクトリを bootstrap する。

## Acceptance Criteria

```gherkin
Feature: wiki/ directory as the LLM-maintained knowledge layer

  Background:
    spec-001 により raw/ は既に存在している
    Karpathy パターンでは wiki/ は LLM が incremental に維持する二次資料層である

  Scenario: wiki/ root に index.md と log.md が存在する
    Given ./wiki/ ディレクトリ
    When ./wiki/index.md が作成されている
    And ./wiki/log.md が作成されている
    Then index.md は全 wiki ページの 1 行要約カタログを保持する
    And log.md は追記専用で時系列記録を保持する
    And log.md の各エントリは `## [YYYY-MM-DD] operation | title` 形式

  Scenario: wiki サブディレクトリが 4 種存在する
    Given ./wiki/ の scaffolding
    When ./wiki/entities/、./wiki/concepts/、./wiki/sources/、./wiki/synthesis/ を確認する
    Then 4 ディレクトリすべてが存在する
    And 各ディレクトリに .gitkeep と README.md（責務説明）が置かれている

  Scenario: wiki README が全体を説明する
    Given ./wiki/README.md
    When README を読む
    Then 4 サブディレクトリそれぞれの責務が説明されている
    And index.md と log.md の役割が説明されている
    And raw/ との関係（原典 → wiki/sources/*.md の対応）が説明されている
    And 「ここは LLM が生成・更新する領域である」旨が明記されている

  Scenario: wiki/index.md 初版が空カタログとフォーマット規約を持つ
    Given 初版の ./wiki/index.md
    When 読む
    Then 以下のセクションが存在する:
      | section |
      | ## Entities |
      | ## Concepts |
      | ## Sources |
      | ## Synthesis |
    And 各セクションは空のリストで始まる
    And 先頭にフォーマット規約（1 行 1 ページ、`- [page](path) — 1 行要約`）が記載される

  Scenario: wiki/log.md 初版が bootstrap エントリを含む
    Given 初版の ./wiki/log.md
    When 読む
    Then `## [2026-04-17] bootstrap | wiki scaffolding created` のエントリが存在する
```

## Implementation Steps

- [ ] `./wiki/README.md` を作成する（サブディレクトリ責務、index/log の役割、raw との関係を明記）
- [ ] `./wiki/index.md` 初版を作成する（空カタログ + フォーマット規約）
- [ ] `./wiki/log.md` 初版を作成する（bootstrap エントリ 1 件）
- [ ] `./wiki/entities/`、`./wiki/concepts/`、`./wiki/sources/`、`./wiki/synthesis/` を作成する
- [ ] 各サブディレクトリに `.gitkeep` と `README.md`（責務説明）を配置する
- [ ] `docs/architecture.md` に `wiki/` 層を追記する
- [ ] Review（`/code-review`）
