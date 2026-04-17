# Product Requirements Document (PRD) - Personal Agent 構想の第一歩 — 目標と実績の可視化ダッシュボード

## Branch

`ralph/personal-agent`

## Overview

peintangos 個人の **目標（行動目標 / 結果目標）と実績を可視化** する Web ダッシュボードを作る。3 年 / 1 年 / 半年 / 1 ヶ月 の 4 時間軸で目標を管理し、2026 年 2 月からの実績を集約する。実績は自動取得可能なもの（note / Zenn 記事数 = RSS）は自動、残り（X ポスト・アポ・イベント・商談）は手入力するハイブリッド方式。事業計画は PPT として配置する。

本 PRD は**最終ゴールである Personal Agent の第一マイルストーン**であり、MVP では対話 UI を含めない。対話・レコメンド・AI による判断補助は次期 PRD のスコープ。

同時に、本 PRD は前 PRD（`prd-llm-wiki`）が構築した LLM Wiki 足場の **organic growth 実験対象** である。実装中に参照した外部ドキュメント（ビジネス書、業界調査、YC 動画、競合リサーチなど）は `raw/` に逐次投下し、`wiki/` が自然に育つ過程を `knowledge.md` に記録する。この観察記録は後続の Phase E（記事執筆）の一次素材になる。

## Background

peintangos は個人事業 / スタートアップの立ち上げに向けて動いており、自分の行動と成果を俯瞰するツールが欲しい。既存 SaaS（Notion、Obsidian、スプレッドシート）はどれも「目標と実績の時間軸接続」「自分の発信活動の自動集計」を一望させる用途には手が回らない。

一方、本リポジトリでは前 PRD で Karpathy の LLM Wiki 足場を構築済み。Personal Agent の将来形はこの wiki を知識層として参照し、「このペースで目標に届くか」「次に何をすべきか」の判断補助を提供する。MVP ダッシュボードは、その前提となる**数字と目標の可視化層**を先に作る。

## Product Principles

- **MVP は可視化に絞る** — 対話・レコメンド・AI 判断は本 PRD のスコープ外
- **ハイブリッド実績取得** — RSS で取れるもの（note / Zenn）は即自動化、残りは手入力。最初から全自動を狙わない
- **LLM Wiki と並走** — 開発中に `raw/` に参考資料を投下し、`wiki/` を organic に育てる。これが後続 PRD で Personal Agent が読む知識層になる
- **身の丈スタック** — Next.js + Supabase + Vercel の定番構成で速く作り、動くものを早く回す
- **段階的可視性** — 目標は自分だけ。事業計画のみ、将来メンター / 投資家に共有できる公開 URL を発行できる

## Scope

### In Scope

- `personal-agent/` サブディレクトリに Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui のアプリを配置
- Supabase 接続（Postgres + Auth + RLS）
- 4 時間軸の目標管理 UI（3 年 / 1 年 / 半年 / 1 ヶ月）
- 目標ラベル: 行動目標 / 結果目標
- note / Zenn の記事数を RSS で日次自動取得（Vercel Cron）
- X / 社長アポ / イベント / 商談 の手入力フォーム
- ダッシュボード: 時間軸タブ + 目標カード + 実績グラフ + 進捗率
- 事業計画 PPT の配置（Google Slides 埋め込み or 静的 pptx 配信）＋共有 URL

### Out of Scope

- Personal Agent の対話 UI（次期 PRD）
- 複雑な権限モデル（本人 + 事業計画公開 URL のみで十分）
- X API 有料プランの契約
- モバイルアプリ化
- 多言語化
- リアルタイム通知（Push / メール）
- KPI 予測・AI レコメンド

## Target Users

- **peintangos 本人** — MVP の主たる利用者。週次で目標と実績をレビュー
- **メンター / 共同創業者候補 / 投資家（将来）** — 事業計画セクションのみ共有 URL で閲覧

## Use Cases

1. 週次で「今月の行動目標に対して実績はどれくらい積み上がったか」を 1 ヶ月ビューで確認する
2. 3 年後のビジョンと今期の OKR が 1 画面で接続して見える
3. note / Zenn の投稿数が自動集計されているので、手入力なしで最新値が見える
4. X の投稿数と商談成功数を日別または月別に手入力し、ダッシュボードに即時反映する
5. 事業計画のたたき台を外部に見せる際、共有 URL 1 つで開いてもらえる

## Functional Requirements

- FR-1: 目標を CRUD できる（時間軸 4 段、行動/結果ラベル、対象メトリクスと目標値）
- FR-2: 実績を手入力できる（メトリクス種別、日付、数量、メモ）
- FR-3: note と Zenn の記事数を RSS 経由で日次取得し実績として記録する
- FR-4: ダッシュボードで時間軸タブを切り替え、目標 vs 実績の進捗率を表示する
- FR-5: 事業計画 PPT を配置し、認証不要の共有 URL を発行できる
- FR-6: ログインは Supabase Auth（Email OTP）で行う
- FR-7: すべてのテーブルに RLS を設定し、本人以外は読み書きできない（事業計画公開 URL 経由を除く）
- FR-8: 開発中に参照した外部資料は `raw/` に投下し、spec 完了時に必要に応じて Ingest を実行して `wiki/` を育てる

## UX Requirements

- トップページ = ダッシュボード（時間軸タブでビュー切替）
- 目標管理と実績入力は別画面、ダッシュボードから遷移
- デスクトップ優先。モバイル対応は MVP スコープ外
- ログイン後は即ダッシュボード
- 事業計画は別ページ、共有 URL で認証スキップできる

## System Requirements

- **フレームワーク**: Next.js 16 (App Router) + TypeScript + Turbopack
- **スタイリング**: Tailwind CSS + shadcn/ui
- **DB / Auth**: Supabase (Postgres + Auth、RLS 必須)
- **ホスティング**: Vercel
- **バッチ**: Vercel Cron（RSS 日次取得）
- **事業計画配信**: Google Slides 埋め込み or Vercel 配信の静的 pptx（spec-007 で決定）
- **認証方式**: Email OTP（Supabase Auth）
- **ブランチ / PR**: `ralph/personal-agent`。spec 完了ごとにコミット、最後に main へ PR

## Repository Layout

本 PRD の成果物は `personal-agent/` サブディレクトリに配置する。LLM Wiki と共存する構造:

```text
/llm-as-wiki
├── personal-agent/              # 本 PRD の Next.js アプリ（新規）
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── supabase/migrations/
│   └── package.json
├── raw/                         # LLM Wiki（既存、外部資料を逐次投下）
├── wiki/                        # LLM Wiki（既存、organic に育てる）
├── docs/prds/
│   ├── prd-llm-wiki/            # 凍結済み
│   └── prd-personal-agent/      # 本 PRD
└── CLAUDE.md                    # LLM Wiki スキーマ定義済み
```

## Observation Protocol（LLM Wiki organic growth）

本 PRD 実行中に以下を徹底する:

1. **開発中に参照した外部ドキュメント**（ビジネス書、業界記事、YC 動画の文字起こし、競合リサーチ、技術記事など）はすべて `raw/` に投下する。分類は `raw/articles/`・`raw/papers/`・`raw/transcripts/` など既存分類を使う
2. **spec 完了時に任意で Ingest 実行**。新たに投下された raw がある場合、`CLAUDE.md` の LLM Wiki セクションの Ingest 手順に従い `wiki/` を更新する
3. **観察は `knowledge.md` に逐次記録**。特に以下の観点を書き残す:
   - どの spec 実装中に何を raw に投下したか
   - Ingest が生成したページのうち、想定外に価値があったもの / 期待外れだったもの
   - 開発と wiki の育ち方の同期が取れている / ズレている点
   - Personal Agent の次期 PRD で wiki をどう使いたくなったか

## Milestones

| Milestone | Description | Target Date |
|-----------|-------------|-------------|
| M1 | spec-001 完了（Next.js 基盤 + Vercel 接続） | 2026-04-20 |
| M2 | spec-002 完了（Supabase + データモデル） | 2026-04-22 |
| M3 | spec-003 完了（目標管理 UI） | 2026-04-25 |
| M4 | spec-004 + spec-005 完了（手入力 + RSS 自動取得） | 2026-04-29 |
| M5 | spec-006 完了（ダッシュボード可視化） | 2026-05-03 |
| M6 | spec-007 完了（事業計画 PPT） → MVP 公開 | 2026-05-05 |
| M7 | Phase E 準備 — knowledge.md が記事素材として充実 | 2026-05-07 |
