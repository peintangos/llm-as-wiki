# TODO — Personal Agent 構想の第一歩

<!--
Keep tasks in priority order.
Each unchecked task should be small enough to complete in one `/implement` run or one Ralph iteration.
Mark completed tasks with `- [x]` instead of removing them.
-->

- [x] spec-001: `personal-agent/` に Next.js 16 + TS + Tailwind + shadcn/ui を scaffold
- [x] spec-001: shadcn/ui の button / card / input を導入
- [x] spec-001: minimal Hello ページを配置、README 追加
- [x] spec-001: root `.gitignore` の検証
- [x] spec-001: Vercel link → preview deploy 確認
- [x] spec-002: Supabase から markdown データ層にピボット決定（2026-04-17）
- [x] spec-002: `@supabase/*` 依存を uninstall、`gray-matter` + `zod` を install
- [x] spec-002: supabase 関連のソースを全削除（lib/supabase、proxy.ts、login、auth callback、supabase/migrations、.env.example）
- [x] spec-002: `lib/data/{schema.ts, goals.ts, actuals.ts}` を配置、YAML 日付 Date → string preprocess
- [x] spec-002: `data/README.md` + サンプル seed（1 goal + 1 day actuals）
- [x] spec-002: `app/page.tsx` を data/ 読み込みの Server Component に更新
- [x] spec-002: build 成功（静的生成、warning なし）
- [x] spec-002: ピボット意思決定記録を `raw/articles/` に投下、`knowledge.md` に詳細追記
- [x] spec-003: shadcn components（tabs / select / label / textarea / radio-group / badge）を追加
- [x] spec-003: `lib/goals/period-defaults.ts`（日本の年度ベース、3yr/1yr/half/month）と `lib/goals/slug.ts`（`{period}-{horizon}-{random4}`）
- [x] spec-003: `lib/data/goals.ts` に `writeGoal` / `deleteGoal`（gray-matter stringify + fs.writeFile）
- [x] spec-003: `components/goals/{HorizonTabs, GoalCard, GoalForm}.tsx`（URL-driven tabs、behavior/outcome バッジ、base-ui Select の render function 対応）
- [x] spec-003: `app/goals/{page, new/page, [id]/edit/page}.tsx` + `app/goals/actions.ts`（Server Action）
- [x] spec-003: `app/page.tsx` に /goals へのリンクを追加
- [x] spec-003: chrome-devtools で /goals と /goals/new を視覚確認、Select の label 表示修正
- [x] spec-004: `app/actuals/` のページ（一覧 + 新規 + 編集）と ActualForm / ActualTable
- [x] spec-004: `lib/data/actuals.ts` に `writeDayActuals(date, patch)` を追加（frontmatter merge）
- [x] spec-004: source='rss' 行は read-only 扱い、フィルタ UI
- [ ] spec-005: `scripts/rss-ingest.ts`（note + Zenn RSS fetch）
- [ ] spec-005: `lib/rss/` に fetchFeedItemCount util + テスト
- [ ] spec-005: package.json に `rss-ingest` スクリプト、launchd / cron 設定例を README に記載
- [ ] spec-006: トップページ = ダッシュボード化、HorizonTabs 統合
- [ ] spec-006: GoalProgressCard（進捗率計算 util + プログレスバー）
- [ ] spec-006: ActualsChart（Recharts）、空状態 UI、URL クエリ `?tab=<horizon>` と UI 同期
- [ ] spec-007: `data/business-plan.md` テンプレ + `lib/data/business-plan.ts` reader
- [ ] spec-007: `app/business-plan/page.tsx`（iframe 埋め込み + markdown メモ表示）
- [ ] spec-007: dashboard に「事業計画を見る」ナビリンク、URL 未設定時の空状態 UI
