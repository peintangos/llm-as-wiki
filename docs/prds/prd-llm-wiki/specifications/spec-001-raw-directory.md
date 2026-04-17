# spec-001: raw/ ディレクトリを immutable source 層として新設する

## Overview

リポジトリ root に `./raw/` ディレクトリを新設し、Karpathy が原典で定義する "immutable source" 層を実装する。`raw/` は人間のみが追加・削除する不変の原典置き場で、LLM は read しか行わない。サブディレクトリ分類とコンベンションを `raw/README.md` に明示する。

## Acceptance Criteria

```gherkin
Feature: raw/ directory as the immutable source layer

  Background:
    本リポジトリは Karpathy の LLM Wiki パターンを実装する
    Karpathy パターンでは raw は「LLM が読んで wiki に compile する原典」であり編集されない

  Scenario: raw/ ディレクトリと README が存在する
    Given リポジトリ root
    When ./raw/ ディレクトリが作成されている
    Then ./raw/README.md が存在する
    And README は以下を明記している:
      | item |
      | raw は immutable であること |
      | LLM は raw を read のみ、write しないこと |
      | 推奨サブディレクトリ分類（articles/ gists/ papers/ transcripts/）|
      | 原典はすべて版管理対象（gitignore しない）|
      | 新規ソースの命名規約（YYYY-MM-DD-slug.md）|

  Scenario: サブディレクトリがすべて bootstrap されている
    Given ./raw/README.md が存在する
    When ./raw/articles/, ./raw/gists/, ./raw/papers/, ./raw/transcripts/ を確認する
    Then 4 ディレクトリすべてが存在する
    And 各ディレクトリに .gitkeep が置かれている

  Scenario: gitignore が raw を除外していない
    Given リポジトリの .gitignore
    When raw/ を含むパターンを検索する
    Then raw 配下を除外するパターンは存在しない
```

## Implementation Steps

- [ ] `./raw/README.md` を作成し、上記コンベンションを記述する
- [ ] `./raw/articles/`、`./raw/gists/`、`./raw/papers/`、`./raw/transcripts/` を作成する
- [ ] 各サブディレクトリに `.gitkeep` を置く
- [ ] `.gitignore` を確認し、`raw/` を誤って除外していないことを検証する
- [ ] `docs/architecture.md` に `raw/` 層を追記する
- [ ] Review（`/code-review`）
