# Progress — Personal Agent 構想の第一歩

Use only these status values: `pending`, `in-progress`, `done`

## Specification Status

| Specification | Title | Status | Completed On | Notes |
|---------------|-------|--------|--------------|-------|
| spec-001-nextjs-app-scaffold | Next.js アプリ基盤を personal-agent/ に scaffold する | done | 2026-04-17 | Production: https://personal-agent-green.vercel.app |
| spec-002-markdown-data-layer | Markdown-based データ層を配置する | done | 2026-04-17 | Supabase からピボット、gray-matter + zod ベース、data/ + lib/data/ 完成、build 静的生成、warning なし |
| spec-003-goals-management-ui | 目標管理 UI（4 時間軸、行動/結果区別） | done | 2026-04-17 | /goals の一覧・新規・編集・削除。4 時間軸タブ、行動/結果バッジ、period デフォルト util、shadcn form。chrome-devtools で視覚確認済み |
| spec-004-manual-actuals-form | 実績手入力フォーム（X / アポ / イベント / 商談） | done | 2026-04-18 | /actuals の一覧・新規・編集・削除、フィルタ、rss 読み取り専用、月別入力モード、writeDayActuals で frontmatter merge + body append。E2E で動作確認 |
| spec-005-rss-ingest-job | RSS 自動取得（note / Zenn）を data/actuals に反映 | done | 2026-04-18 | tsx scripts/rss-ingest.ts + lib/rss/fetchFeedItemCount、node:test で 6 tests 通過、実 fetch で Zenn 13 items 取得確認、launchd/cron 例を README に記載 |
| spec-006-dashboard-view | ダッシュボード可視化（時間軸タブ + 進捗グラフ） | done | 2026-04-18 | / が 4 時間軸タブ + GoalProgressCard + Recharts ActualsChart に。HorizonTabs を shared/ に移動し /goals と共通化。progress util は node:test で 8 ケース通過 |
| spec-007-business-plan-hosting | 事業計画（Google Slides URL）を data/business-plan.md で管理 | pending | | Supabase business_plans テーブル → URL ファイルに簡素化 |

## Summary

- Done: 6/7
- Current focus: spec-007（事業計画ホスティング）のみ残り
- Production URL: https://personal-agent-green.vercel.app
- 並行化候補: spec-004 / spec-005 / spec-007 を並列で進められる
