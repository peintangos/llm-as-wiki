# spec-005: RSS 自動取得（note / Zenn）を Vercel Cron で日次実行

## Overview

note (`https://note.com/{user}/rss`) と Zenn (`https://zenn.dev/{user}/feed`) の RSS を日次で取得し、記事数を `actuals` テーブルに `source='rss'` として記録するジョブを作る。Vercel Cron から叩く Next.js Route Handler として実装する。

## Acceptance Criteria

```gherkin
Feature: RSS-driven actuals ingestion

  Background:
    spec-002 で actuals スキーマは準備済み
    note と Zenn のユーザー名は .env で設定する

  Scenario: RSS fetch エンドポイントが存在する
    Given personal-agent/
    When app/api/cron/rss-ingest/route.ts を確認する
    Then GET ハンドラが定義されている
    And 認証は Vercel Cron の Authorization ヘッダで検証される（CRON_SECRET 経由）

  Scenario: note の RSS から記事数を取得し actuals に記録する
    Given NOTE_USERNAME が .env に設定されている
    When エンドポイントを叩く
    Then https://note.com/{NOTE_USERNAME}/rss を取得
    And フィードの item 数をカウント
    And actuals テーブルに以下で upsert する:
      | metric_key='note_count' |
      | value=<item 数> |
      | recorded_date=<今日> |
      | source='rss' |
      | owner_id=<サービスロール経由の peintangos user id> |
    And 同日同メトリクスの既存レコードがあれば UPDATE、なければ INSERT

  Scenario: Zenn の RSS でも同様
    Given ZENN_USERNAME が .env に設定されている
    When エンドポイントを叩く
    Then https://zenn.dev/{ZENN_USERNAME}/feed を取得し、metric_key='zenn_count' で upsert

  Scenario: Vercel Cron が日次実行する
    Given personal-agent/vercel.json
    When crons フィールドを確認する
    Then schedule='0 3 * * *' (JST 正午相当) 等で api/cron/rss-ingest にヒットする設定がある

  Scenario: 取得失敗時にフォールバックする
    Given ネットワークエラー or 404
    When エンドポイントが失敗する
    Then エラーを console.error でログ出力
    And その日の当該メトリクスは upsert をスキップ（前日値を維持）
    And HTTP 200 を返す（Vercel Cron のリトライを防ぐため）

  Scenario: 手動トリガーできる
    Given peintangos がローカルから叩きたい
    When CRON_SECRET を付けた curl で叩く
    Then 同じ処理が走る
```

## Implementation Steps

- [ ] `personal-agent/.env.local` に NOTE_USERNAME、ZENN_USERNAME、CRON_SECRET を追加
- [ ] `personal-agent/app/api/cron/rss-ingest/route.ts` を作成
- [ ] RSS parser（`fast-xml-parser` or `rss-parser`）を導入
- [ ] 共通関数 `fetchFeedItemCount(url)` を `personal-agent/lib/rss/` に分離、テスト付き
- [ ] Supabase の service_role key で owner_id を peintangos に固定して upsert
- [ ] `personal-agent/vercel.json` に crons 設定を追加
- [ ] Authorization ヘッダ検証（`Bearer ${CRON_SECRET}`）
- [ ] ローカルで curl テスト
- [ ] 初回 deploy 後、Vercel ダッシュボードで Cron が走ることを確認
- [ ] 参照した Vercel Cron / RSS parser の docs を `raw/articles/` に投下
- [ ] `knowledge.md` に観察を記録（X が手入力なのに note/Zenn だけ自動化した理由・ハマりなど）
- [ ] Review（`/code-review`）
