# spec-004: Seed ingest — raw/ への配置と wiki 生成

## Overview

`raw/` に「AI ネイティブ開発方法論」テーマの実ソースを 10〜15 件配置し、Claude Code に `CLAUDE.md` の Ingest 手順を実行させる。本 spec の成果物は `wiki/sources/*.md`、`wiki/concepts/*.md`、`wiki/entities/*.md`、`wiki/synthesis/*.md`、および更新された `wiki/index.md` と `wiki/log.md`。Query と Lint は本 spec には含めず、spec-005 で実施する。

## Acceptance Criteria

```gherkin
Feature: Seed ingest produces the first version of the wiki

  Background:
    spec-001〜003 が完了している
    CLAUDE.md に Ingest の手順が命令形で明文化されている

  Scenario: raw/ に 10〜15 ソースが配置されている
    Given 「AI ネイティブ開発方法論」というテーマ
    When 以下のカテゴリから実ソースを収集して raw/ 配下に配置する:
      | category | example |
      | Karpathy 発信 | LLM Wiki gist、Vibe Coding 関連の発言 |
      | Vibe Coding 解説 | コミュニティ記事 2〜3 件 |
      | Spec-driven / agentic | Ralph Wiggum loop、Geoffrey Huntley 関連、spec-driven 解説 |
      | Claude Code エコシステム | Anthropic 公式記事、skills/hooks 解説 |
      | LLM Wiki 派生記事 | analyticsvidhya、medium、aiia などの解説 |
    Then raw/articles/ と raw/gists/ を中心に合計 10〜15 件の .md / .txt が配置される
    And 各ソースは web から取得した原文（markdown 化済み）

  Scenario: Ingest が wiki/sources を生成する
    Given raw/ に 10〜15 ソース
    When Claude Code に CLAUDE.md の Ingest 手順を実行させる
    Then 各原典に対応する wiki/sources/{slug}.md が生成される
    And 各 source ページは「原典へのポインタ」「要約」「抜粋」「関連 concept/entity へのリンク」を含む

  Scenario: Ingest が concepts, entities, synthesis を生成する
    Given 生成された wiki/sources
    When Ingest 手順に従って横断ページを作成する
    Then wiki/concepts/ に以下の主要コンセプトページが生成される:
      | concept |
      | LLM Wiki |
      | RAG との対比 |
      | Vibe Coding |
      | spec-driven development |
      | Ralph Loop |
      | Claude Code skills |
    And wiki/entities/ に以下の主要エンティティページが生成される:
      | entity |
      | Andrej Karpathy |
      | Geoffrey Huntley |
      | Anthropic |
      | Claude Code |
    And wiki/synthesis/ に少なくとも 1 件の横断 synthesis が生成される
      （例: 「Karpathy LLM Wiki パターンと spec-driven ワークフローの対応表」）

  Scenario: Ingest が index.md と log.md を更新する
    Given 生成された wiki ページ群
    When Ingest 操作の最終ステップを実行する
    Then wiki/index.md が全新規ページを反映して更新される
    And wiki/log.md に `## [YYYY-MM-DD] ingest | seed ingest for AI-native development methodology` エントリが追記される
    And log エントリには取り込んだ source 数と新規 page 数が記録される
```

## Implementation Steps

- [ ] `raw/articles/` と `raw/gists/` にソース 10〜15 件を配置する（web 取得・markdown 化）
- [ ] `CLAUDE.md` の Ingest 手順に従い、Claude Code に `wiki/sources/*.md` を生成させる
- [ ] `wiki/concepts/`、`wiki/entities/`、`wiki/synthesis/` を生成させる
- [ ] `wiki/index.md` の更新を確認する
- [ ] `wiki/log.md` に Ingest エントリが追記されていることを確認する
- [ ] 生成結果を人間がレビューし、明らかな誤りだけ curate する
- [ ] `knowledge.md` の「Karpathy 原典に忠実に従えた点」「逸脱せざるを得なかった点」節に Ingest 段階の観察を記入する
- [ ] Review（`/code-review`）
