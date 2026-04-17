# personal-agent/

`llm-as-wiki` リポジトリの `prd-personal-agent` PRD の成果物として、peintangos の **目標と実績を可視化するダッシュボード** を構築する Next.js アプリ。最終ゴールは Personal Agent（LLM Wiki を知識層に持つ AI エージェント）。MVP ではまず可視化層のみを作る。

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI components**: shadcn/ui（`base-nova` preset、`@base-ui/react` ベース）
- **DB / Auth**: Supabase（spec-002 で導入予定）
- **Hosting**: Vercel
- **Cron**: Vercel Cron（spec-005 で RSS 自動取得ジョブを配置予定）

## Getting Started

```bash
cd personal-agent
npm install              # 初回のみ
npm run dev              # http://localhost:3000
```

開発サーバは Turbopack で動く。hot reload は page.tsx 等を編集すれば自動で反映される。

## Project Structure

```text
personal-agent/
├── app/
│   ├── layout.tsx
│   ├── page.tsx         # MVP: Hello ページ（以降の spec でダッシュボードに置換）
│   └── globals.css      # Tailwind v4 + shadcn CSS variables
├── components/
│   └── ui/              # shadcn/ui（button / card / input）
├── lib/
│   └── utils.ts         # cn() など
├── public/              # 静的アセット
├── components.json      # shadcn 設定
├── next.config.ts       # Turbopack root を本ディレクトリに固定
├── AGENTS.md            # Next.js 16 由来の注意喚起（Claude への指示）
├── CLAUDE.md            # AGENTS.md を参照
├── tsconfig.json
└── package.json
```

## 関連ドキュメント

- `../docs/prds/prd-personal-agent/prd.md` — PRD 本体
- `../docs/prds/prd-personal-agent/specifications/` — 7 specs
- `../CLAUDE.md` — リポジトリ全体の規約（LLM Wiki セクション含む）
- `AGENTS.md` — Next.js 16 の注意喚起（この版は breaking change あり、`node_modules/next/dist/docs/` も確認）

## LLM Wiki との関係

本アプリは将来、リポジトリ root の `../wiki/` を知識層として参照する Personal Agent に育つ予定。現段階では可視化のみだが、開発中に参照した外部資料は `../raw/` に投下し、`../wiki/` が organic に育つ過程を `../docs/prds/prd-personal-agent/knowledge.md` に記録する。

## Deploy

Vercel に link 後、`ralph/personal-agent` ブランチへの push で preview deploy、`main` へのマージで production deploy の想定。

```bash
# Vercel link（ブラウザ認証が必要なので peintangos が手動で 1 回だけ実行）
cd personal-agent
npx vercel link
```

## ワークスペース注記

リポジトリ root (`/llm-as-wiki`) には Ralph Matsuo 用の `package-lock.json` が別途存在する。Next.js の Turbopack は `npm run build` 時に「multiple lockfiles を検出した」という警告を出すが、動作には影響しない。`next.config.ts` で `turbopack.root` を設定すれば警告は消えるが、`import.meta.url` 経由のパス解決が build に失敗するケースがあり、現状は警告を受け入れている（詳細: `../docs/prds/prd-personal-agent/knowledge.md` の Gotchas 参照）。
