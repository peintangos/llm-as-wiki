# Progress — Personal Agent 構想の第一歩

Use only these status values: `pending`, `in-progress`, `done`

## Specification Status

| Specification | Title | Status | Completed On | Notes |
|---------------|-------|--------|--------------|-------|
| spec-001-nextjs-app-scaffold | Next.js アプリ基盤を personal-agent/ に scaffold する | done | 2026-04-17 | Next.js 16 + shadcn/ui + Vercel deploy 完了。Production: https://personal-agent-green.vercel.app |
| spec-002-supabase-schema | Supabase 接続とデータモデル定義 | in-progress | | コード側（@supabase/ssr helper、proxy.ts、login、auth callback、migration SQL、.env.example、Home 更新）完了。残: Supabase プロジェクト作成、.env.local 設定、migration 適用、Email OTP 有効化（すべてユーザー手動） |
| spec-003-goals-management-ui | 目標管理 UI（4 時間軸、行動/結果区別） | pending | | |
| spec-004-manual-actuals-form | 実績手入力フォーム（X / アポ / イベント / 商談） | pending | | |
| spec-005-rss-ingest-job | RSS 自動取得（note / Zenn）を Vercel Cron で日次実行 | pending | | |
| spec-006-dashboard-view | ダッシュボード可視化（時間軸タブ + 進捗グラフ） | pending | | |
| spec-007-business-plan-hosting | 事業計画 PPT の配置と共有 URL 発行 | pending | | |

## Summary

- Done: 1/7
- In progress: spec-002（Supabase 接続のコード側完了、ユーザー手動ステップ待ち）
- Current focus: ユーザーが Supabase プロジェクト作成 → env 設定 → migration 適用 → Email OTP 有効化を行った後、認証フロー動作確認
- Production URL: https://personal-agent-green.vercel.app
- 並行化候補: spec-002 完了後は spec-003 / spec-004 / spec-005 / spec-007 を並列で進められる
