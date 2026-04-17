# TODO — Personal Agent 構想の第一歩

<!--
Keep tasks in priority order.
Each unchecked task should be small enough to complete in one `/implement` run or one Ralph iteration.
Mark completed tasks with `- [x]` instead of removing them.
-->

- [x] spec-001: `personal-agent/` に Next.js 16 (App Router) + TS + Tailwind + shadcn/ui を scaffold（Next.js 15 想定→実際は 16 がインストールされた）
- [x] spec-001: shadcn/ui の button / card / input を導入（`base-nova` preset）
- [x] spec-001: minimal "Hello" ページを配置、README 追加
- [x] spec-001: root `.gitignore` が personal-agent/node_modules などを拾うか確認（OK、personal-agent/ 自身の .gitignore も重ねて効く）
- [x] spec-001: Vercel link → preview deploy 確認（手動実行完了。Production: https://personal-agent-green.vercel.app）
- [x] spec-002: `.env.example` を placeholder 付きで作成
- [ ] spec-002: **ユーザー手動** Supabase プロジェクト作成、`.env.local` に URL と anon key を設定（Vercel 環境変数にも同値を登録）
- [x] spec-002: `@supabase/ssr` / `@supabase/supabase-js` 導入、client / server / middleware helper 配置
- [x] spec-002: Next.js 16 の file convention に合わせ `middleware.ts` → `proxy.ts` にリネーム（関数名も `proxy()`）、未認証リダイレクトを実装
- [x] spec-002: migration `0001_init.sql`（goals / metrics / actuals + RLS + metrics seed）を作成
- [ ] spec-002: **ユーザー手動** Supabase Dashboard の SQL Editor で `supabase/migrations/0001_init.sql` を実行、または `npx supabase db push`
- [x] spec-002: login ページ（Email OTP マジックリンク）、auth callback route handler、sign-out 付き Home 更新
- [ ] spec-002: **ユーザー手動** Supabase Auth で Email provider 有効化、redirect URL に `https://personal-agent-green.vercel.app/auth/callback` と `http://localhost:3000/auth/callback` を追加
- [ ] spec-002: ユーザーの手動手順完了後、localhost と Vercel preview で magic link 認証フローが動くことを確認
- [ ] spec-003: `/goals` 一覧ページ + 4 時間軸タブ
- [ ] spec-003: 新規・編集フォーム（GoalForm 共通化、zod + Server Actions）
- [ ] spec-003: behavior/outcome バッジ表示、horizon ごとの period デフォルト util
- [ ] spec-004: `/actuals` 一覧 + 入力 + 編集（ActualForm、zod + Server Actions）
- [ ] spec-004: 月別モード切り替え、フィルタ UI（metric_key + 日付レンジ）
- [ ] spec-004: source='rss' は read-only 扱い
- [ ] spec-005: `/api/cron/rss-ingest` Route Handler、CRON_SECRET 検証
- [ ] spec-005: note RSS → `metric_key='note_count'` で upsert
- [ ] spec-005: Zenn RSS → `metric_key='zenn_count'` で upsert
- [ ] spec-005: `vercel.json` に crons 設定、deploy 後に動作確認
- [ ] spec-006: トップページ = ダッシュボード化、HorizonTabs 実装
- [ ] spec-006: GoalProgressCard（進捗率計算 util + プログレスバー）
- [ ] spec-006: ActualsChart（Recharts）、空状態 UI
- [ ] spec-006: URL クエリ `?tab=<horizon>` と UI 同期
- [ ] spec-007: `business_plans` テーブル追加、RLS policy（本人書き込み + share_token 読み取り）
- [ ] spec-007: `/business-plan`（本人用）と `/share/plan/[token]`（公開）の 2 ページ実装
- [ ] spec-007: Google Slides 埋め込みコンポーネント + pptx ダウンロード両対応
- [ ] spec-007: 共有トークン発行 / 失効フロー、ダッシュボードにナビリンク
