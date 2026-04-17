# Progress — Personal Agent 構想の第一歩

Use only these status values: `pending`, `in-progress`, `done`

## Specification Status

| Specification | Title | Status | Completed On | Notes |
|---------------|-------|--------|--------------|-------|
| spec-001-nextjs-app-scaffold | Next.js アプリ基盤を personal-agent/ に scaffold する | done | 2026-04-17 | Production: https://personal-agent-green.vercel.app |
| spec-002-markdown-data-layer | Markdown-based データ層を配置する | done | 2026-04-17 | Supabase からピボット、gray-matter + zod ベース、data/ + lib/data/ 完成、build 静的生成、warning なし |
| spec-003-goals-management-ui | 目標管理 UI（4 時間軸、行動/結果区別） | pending | | |
| spec-004-manual-actuals-form | 実績手入力フォーム（X / アポ / イベント / 商談） | pending | | |
| spec-005-rss-ingest-job | RSS 自動取得（note / Zenn）を data/actuals に反映 | pending | | Vercel Cron ではなくローカル node script に方針変更 |
| spec-006-dashboard-view | ダッシュボード可視化（時間軸タブ + 進捗グラフ） | pending | | |
| spec-007-business-plan-hosting | 事業計画（Google Slides URL）を data/business-plan.md で管理 | pending | | Supabase business_plans テーブル → URL ファイルに簡素化 |

## Summary

- Done: 2/7
- Current focus: spec-003（目標管理 UI）
- Production URL: https://personal-agent-green.vercel.app
- 並行化候補: spec-003 / spec-004 / spec-005 / spec-007 を並列で進められる
