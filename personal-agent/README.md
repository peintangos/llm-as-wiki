# personal-agent/

`llm-as-wiki` リポジトリの `prd-personal-agent` PRD の成果物として、peintangos の **目標と実績を可視化するダッシュボード** を構築する Next.js アプリ。最終ゴールは Personal Agent（LLM Wiki を知識層に持つ AI エージェント）。

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI components**: shadcn/ui（`base-nova` preset、`@base-ui/react` ベース）
- **データ層**: **markdown ファイル**（`data/goals/*.md`、`data/actuals/{yyyy-mm-dd}.md`）
- **Parser**: gray-matter（frontmatter）、zod（スキーマ検証）
- **認証**: なし（単一ユーザー、ローカル運用、リポジトリアクセスが authn 相当）
- **Hosting**: Vercel（静的 snapshot として配信、書き込みは無効）

当初 Supabase（Postgres + Auth + RLS）前提で scaffold したが、単一ユーザーに過剰と判断し 2026-04-17 に markdown データ層へピボット。詳細: `../docs/prds/prd-personal-agent/knowledge.md` と `../raw/articles/2026-04-17-pivot-from-supabase-to-markdown.md`。

## Getting Started

```bash
cd personal-agent
npm install              # 初回のみ
npm run dev              # http://localhost:3000
```

開発サーバは Turbopack で動く。`data/` 配下の markdown を編集すると reload で即反映。

## 運用モード

| モード | 書き込み | 読み込み |
|--------|---------|----------|
| ローカル `npm run dev` | ○（Server Action が fs 経由で markdown を書き換える） | ○ |
| Vercel 本番 | ×（ephemeral fs、永続化しない） | ○（build 時の snapshot） |

データ更新フロー: ローカルで `npm run dev` → フォーム経由 or markdown 直編集 → git commit + push → Vercel が自動 redeploy → snapshot 更新。

## Project Structure

```text
personal-agent/
├── app/
│   ├── layout.tsx
│   ├── page.tsx             # ダッシュボード入口（spec-006 で置換予定）
│   └── globals.css
├── components/
│   └── ui/                  # shadcn/ui (button / card / input)
├── lib/
│   ├── data/
│   │   ├── schema.ts        # zod schemas, METRIC_KEYS, HORIZONS
│   │   ├── goals.ts         # listGoals, getGoal
│   │   └── actuals.ts       # listDayActuals, getDayActuals, sumByMetric
│   └── utils.ts             # cn() など
├── data/                    # markdown データ層（本アプリの DB 相当）
│   ├── README.md            # 運用ルール・ファイル形式・メトリクス語彙
│   ├── goals/{id}.md
│   └── actuals/{yyyy-mm-dd}.md
├── public/
├── components.json
├── next.config.ts
├── AGENTS.md                # Next.js 16 由来の注意喚起
├── CLAUDE.md                # AGENTS.md 参照
├── tsconfig.json
└── package.json
```

## 関連ドキュメント

- `../docs/prds/prd-personal-agent/prd.md` — PRD 本体
- `../docs/prds/prd-personal-agent/specifications/` — 7 specs
- `../CLAUDE.md` — リポジトリ全体の規約（LLM Wiki セクションも参照）
- `data/README.md` — データ層の運用ルール

## LLM Wiki との関係

`../raw/`（外部資料）・`../wiki/`（LLM 整理の二次資料）・`personal-agent/data/`（本人のログ）の 3 階層すべてが markdown。Personal Agent は将来、この 3 つを区別なく読む設計。

## RSS 自動取得（spec-005）

note.com と Zenn の RSS から記事数を取得し、`data/actuals/{today}.md` の
`metrics.note_count` / `metrics.zenn_count` を `source='rss'` で書き込む
ローカル node スクリプト。**Vercel Cron は使わない**（本番は read-only
snapshot で書き込みが永続化しないため）。

```bash
# .env.example を参考に username を設定
cp .env.example .env.local
# .env.local を編集: NOTE_USERNAME=peintangos / ZENN_USERNAME=peintangos

# 手動実行
npm run rss-ingest

# 環境変数を明示的に渡す
NOTE_USERNAME=peintangos ZENN_USERNAME=peintangos npm run rss-ingest

# argv から渡す
tsx scripts/rss-ingest.ts peintangos peintangos
```

### macOS launchd で日次実行

`~/Library/LaunchAgents/com.peintangos.rss-ingest.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.peintangos.rss-ingest</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>cd /Users/matsuojumpei/Projects/llm-as-wiki/personal-agent &amp;&amp; NOTE_USERNAME=peintangos ZENN_USERNAME=peintangos /opt/homebrew/bin/npm run rss-ingest</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>23</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>/tmp/rss-ingest.log</string>
  <key>StandardErrorPath</key><string>/tmp/rss-ingest.err.log</string>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/com.peintangos.rss-ingest.plist
```

### cron で日次実行（代替）

```cron
0 23 * * * cd /Users/matsuojumpei/Projects/llm-as-wiki/personal-agent && NOTE_USERNAME=peintangos ZENN_USERNAME=peintangos /opt/homebrew/bin/npm run rss-ingest >> /tmp/rss-ingest.log 2>&1
```

書き込まれた markdown は手動で `git commit + push` する（自動コミットは現状入れていない）。

## Deploy

- **Production**: https://personal-agent-green.vercel.app
- Vercel に link 済み。`ralph/personal-agent` ブランチへの push で preview deploy、`main` へのマージで production deploy が自動実行される。

```bash
# 初回 link（完了済み）
cd personal-agent
npx vercel link
```
