# spec-007: 事業計画 PPT の配置と共有 URL 発行

## Overview

事業計画 PPT をダッシュボードから 1 クリックで開けるようにする。方式は 2 案から選択可能にする:
- **A**: Google Slides の公開埋め込み URL を DB に登録、iframe で表示
- **B**: 静的 pptx を Vercel 配信、ダウンロード or 外部ビューア（Office online 等）で開く

デフォルトは A（運用が楽）。共有 URL は認証なしで閲覧可能にし、URL を知る人だけが見られる unlisted 形態。

## Acceptance Criteria

```gherkin
Feature: Business plan hosting

  Background:
    spec-001〜006 で dashboard と認証は揃っている

  Scenario: 事業計画ページが存在する
    Given 認証済みユーザー
    When /business-plan へアクセスする
    Then 事業計画ビューアページが表示される

  Scenario: Google Slides 埋め込み（方式 A）が動く
    Given business_plans テーブルに type='google_slides'、embed_url が登録されている
    When /business-plan を開く
    Then iframe で Google Slides のスライドが表示される
    And ナビゲーション（前後）と fullscreen が機能する

  Scenario: 静的 pptx（方式 B）も動く
    Given business_plans テーブルに type='pptx'、file_path が登録されている
    When /business-plan を開く
    Then ダウンロードボタンと、Office Online で開くリンクが表示される

  Scenario: 共有 URL が発行される
    Given peintangos が現在版の business_plan レコードを「共有可能」にする
    When 「共有 URL を発行」ボタンを押す
    Then share_token が生成される
    And /share/plan/{token} で認証なし閲覧できる
    And トークンは失効ボタンで無効化できる

  Scenario: 共有ページは最低限の情報のみ表示する
    Given 共有 URL で閲覧する第三者
    When /share/plan/{token} を開く
    Then 事業計画のスライド（or ダウンロード）だけが表示される
    And ダッシュボード本体・目標・実績は一切見えない

  Scenario: RLS で直接 DB 経由の漏洩が防がれている
    Given Supabase の business_plans テーブル
    When anon ユーザーが business_plans を SELECT する
    Then RLS で 0 行しか返らない
    And 共有 URL 経由のみ、share_token 一致で読み取り可能

  Scenario: ダッシュボードから 1 クリックで開ける
    Given ダッシュボード画面
    When ヘッダ or サイドに「事業計画を見る」ボタンを表示する
    Then クリックで /business-plan に遷移する
```

## Implementation Steps

- [ ] Supabase に `business_plans` テーブル追加（owner_id、type、embed_url、file_path、share_token、share_enabled、version、created_at）
- [ ] RLS policy: 本人のみ書き込み、share_token 経由で読み取り可能
- [ ] `personal-agent/app/(authed)/business-plan/page.tsx` — 本人用ビューア
- [ ] `personal-agent/app/share/plan/[token]/page.tsx` — 公開共有ビューア
- [ ] Google Slides 埋め込みコンポーネント（iframe）
- [ ] pptx ダウンロード / Office Online リンクコンポーネント
- [ ] 共有トークン生成ロジック（UUID or nanoid）
- [ ] ダッシュボードに「事業計画」ナビリンク追加
- [ ] 参照した Google Slides 埋め込み docs を `raw/articles/` に投下
- [ ] `knowledge.md` に観察を記録（A と B どちらを選んだか、理由）
- [ ] Review（`/code-review`）
