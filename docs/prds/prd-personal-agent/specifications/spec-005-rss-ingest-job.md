# spec-005: RSS 自動取得（note / Zenn）を data/actuals に反映する

## Overview

note (`https://note.com/{user}/rss`) と Zenn (`https://zenn.dev/{user}/feed`) の RSS を取得し、記事数を `data/actuals/{today}.md` の frontmatter に `source='rss'` で書き込む。**Vercel Cron は使わない**（本番は read-only snapshot のため書き込みが永続化しない）。代わりに **ローカル実行の node スクリプト**として配置し、peintangos が手動 or macOS の launchd / cron で走らせる。結果は git commit + push で Vercel snapshot に反映される。

## Acceptance Criteria

```gherkin
Feature: RSS ingestion into data/actuals/ markdown

  Background:
    spec-002 で data/actuals/ と lib/data/actuals.ts は準備済み
    note と Zenn のユーザー名は scripts の引数 or .env で指定

  Scenario: node スクリプトが存在する
    Given personal-agent/
    When scripts/rss-ingest.ts（or .mjs）を確認する
    Then tsx or node で直接実行できる
    And 入力は NOTE_USERNAME と ZENN_USERNAME（環境変数 or argv）
    And 実行すると data/actuals/{today}.md の metrics.note_count と metrics.zenn_count を RSS の記事数で上書き、sources.note_count と sources.zenn_count を 'rss' に設定

  Scenario: note の RSS から記事数を取得
    Given NOTE_USERNAME が設定されている
    When スクリプトを実行
    Then https://note.com/{NOTE_USERNAME}/rss を fetch
    And フィードの item 数を数える
    And data/actuals/{today}.md を upsert（既存ファイルがなければ zeroedDayActuals で初期化）

  Scenario: Zenn の RSS から記事数を取得
    Given ZENN_USERNAME が設定されている
    When スクリプトを実行
    Then https://zenn.dev/{ZENN_USERNAME}/feed を fetch
    And フィードの item 数を数え、metric_key='zenn_count' で markdown を更新

  Scenario: 取得失敗時にフォールバックする
    Given ネットワークエラー or 404
    When fetch が失敗する
    Then console.error にログ
    And 対象メトリクスの書き込みはスキップ（前日値を維持）
    And exit code 0 で終了（手動再実行できるように）

  Scenario: 手動実行と自動実行
    Given peintangos の macOS ローカル
    When `npm run rss-ingest`（or `tsx scripts/rss-ingest.ts`）を実行
    Then 同じ処理が走る
    And launchd / cron で日次トリガーできる（設定は README に書く）
```

## Implementation Steps

- [x] `personal-agent/scripts/rss-ingest.ts` を作成（または .mjs でもよい）
- [x] RSS parser を導入（`fast-xml-parser` or `rss-parser`）→ 依存追加を避け、正規表現で `<item>` / `<entry>` を数える軽量実装に変更（knowledge.md 参照）
- [x] 共通関数 `fetchFeedItemCount(url)` を `lib/rss/` に分離、単体テスト付き（node:test + tsx、6 tests）
- [x] `lib/data/actuals.ts` の `writeDayActuals` を利用してファイルを upsert
- [x] `package.json` に `rss-ingest` スクリプトを追加（`tsx scripts/rss-ingest.ts`）
- [x] `.env.example` を追加（NOTE_USERNAME、ZENN_USERNAME）
- [x] README に launchd または cron の設定例を記載
- [x] 参照した RSS parser docs を `raw/articles/` に投下 → 今回は parser を導入しなかったため skip。代わりに「正規表現で十分だった」という観察を knowledge.md に記録
- [x] `knowledge.md` に観察を記録（Vercel Cron をやめて node script にしたことで認証不要の副次的メリットを獲得、など）
- [x] Review（`/code-review`）
