# spec-007: 事業計画（Google Slides URL）を data/business-plan.md で管理しダッシュボードから参照する

## Overview

事業計画は Google Slides で peintangos が作成・維持する。ダッシュボードからは **URL を 1 クリックで開ける**ようにする。Slides の可視性管理は Google 側の共有設定に委ねる（URL を知る人だけ閲覧可、などは Slides 側で設定）。本リポジトリでは URL を `data/business-plan.md` に保存するだけで、認証基盤・共有トークン・RLS などは一切不要。

## Acceptance Criteria

```gherkin
Feature: Business plan URL hosting

  Background:
    spec-001〜006 で dashboard は動いている
    事業計画 PPT は peintangos が Google Slides で作成

  Scenario: data/business-plan.md が URL を管理する
    Given personal-agent/data/business-plan.md
    When ファイルを読む
    Then frontmatter に slides_url が記載されている:
      ```yaml
      ---
      title: Personal Agent 事業計画 v0.1
      slides_url: https://docs.google.com/presentation/d/.../pub
      visibility: unlisted   # 'private' / 'unlisted' / 'public' のいずれか（ドキュメント用）
      updated_at: 2026-04-22
      ---
      ```
    And body に概要や章立てメモを自由に書ける

  Scenario: ダッシュボードから Slides を開ける
    Given dashboard
    When 「事業計画を見る」ボタンをクリック
    Then `slides_url` を新規タブで開く（target="_blank" + rel="noopener"）

  Scenario: 埋め込み表示オプション
    Given /business-plan ページ
    When /business-plan にアクセス
    Then data/business-plan.md の slides_url を iframe で埋め込み表示
    And body に書いた markdown メモも表示（下部 or 横に配置）

  Scenario: 共有 URL の運用
    Given 第三者にシェアしたい
    When peintangos が Slides 側の共有設定を "リンクを知っている全員" に変更
    Then そのまま URL を渡せば閲覧可能
    And 本アプリ側で共有トークン生成・失効の仕組みは不要

  Scenario: URL 未設定時のフォールバック
    Given data/business-plan.md が存在しない or slides_url が空
    When /business-plan にアクセス
    Then "まだ URL が設定されていません" のメッセージを表示
    And dashboard のボタンは disabled になる
```

## Implementation Steps

- [ ] `data/business-plan.md` のテンプレートを作成（placeholder URL 付き、peintangos があとで Slides URL に差し替え）
- [ ] `lib/data/business-plan.ts` を追加（read helper、zod schema: slides_url は URL 形式）
- [ ] `app/business-plan/page.tsx` — 埋め込みビューア（iframe + markdown body 表示）
- [ ] dashboard のヘッダ or サイドに「事業計画を見る」ナビリンク / ボタン
- [ ] URL 未設定時の空状態 UI
- [ ] Google Slides の共有設定（"リンクを知っている全員" = unlisted）を peintangos が手動で設定（spec 外、運用メモ）
- [ ] 参照した Google Slides 埋め込み docs を `raw/articles/` に投下
- [ ] `knowledge.md` に観察を記録（Supabase business_plans テーブル + share_token + RLS を全部捨てて URL だけにしたらどれだけ軽くなったか）
- [ ] Review（`/code-review`）
