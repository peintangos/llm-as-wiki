---
source_url: internal-decision-record
author: peintangos（Claude との対話経由）
captured_at: 2026-04-17
---

# spec-002 で Supabase から markdown データ層にピボットした意思決定記録

## 背景

`prd-personal-agent` の spec-002 で Supabase（Postgres + Auth + RLS）のコード側を配置した直後、peintangos から「そもそもなぜ Supabase が必要なの？」という根本的な問い。

## 前提の言語化

私（Claude）が無意識に置いていた前提:

1. **「Web アプリ = Auth + DB が要る」という Web 業界の慣習前提**
2. **「複数ユーザー想定」**（しかし実際は peintangos 本人のみ）
3. **「スマホから編集する可能性」**（しかし実際はローカル開発が主体）

peintangos の実際のユースケース:

- **単一ユーザー**（見る人・目標は本人、事業計画のみ将来共有）
- **ローカル開発 + Vercel snapshot** が主運用
- Personal Agent が将来読む知識層が欲しい

この前提で考えると、Auth も RLS も**他者**を前提にした機能で、1 人の持ち物に銀行金庫を設置した状態だった。

## 選んだ代替案: Option A（markdown-based ローカル運用）

```
personal-agent/
├── data/
│   ├── goals/{id}.md          # 1 目標 = 1 markdown
│   └── actuals/{yyyy-mm-dd}.md  # 1 日 = 1 markdown（frontmatter に 6 メトリクス）
├── lib/data/
│   ├── schema.ts              # zod スキーマ
│   ├── goals.ts               # read helpers
│   └── actuals.ts             # read helpers
```

**データそのものが markdown** なので、LLM Wiki の `raw/` `wiki/` と完全に整合する。Personal Agent が `data/` を読む際、特別な DB アクセスを挟まない。

## 消したもの

- `@supabase/ssr`、`@supabase/supabase-js` 依存
- `personal-agent/lib/supabase/` ディレクトリ
- `personal-agent/proxy.ts`（Next.js 16 の middleware リネーム対応、もう不要）
- `personal-agent/app/login/page.tsx`（Auth 不要）
- `personal-agent/app/auth/callback/route.ts`（Auth 不要）
- `personal-agent/supabase/migrations/0001_init.sql`（DB 不要）
- `personal-agent/.env.example`（環境変数不要）

## 教訓

- **「Claude に指摘されて無意識の前提を剥がす」は Karpathy の LLM Wiki 思想と親和性が高い** — wiki を compile する過程で思考が整理されるのと同じ
- **単一ユーザーツールに Web 業界慣習を持ち込むと過剰設計になる**。身の丈に合った選択肢を最初から検討すべき
- **データ形式の選択は LLM との協働を想定すべき時代**になっている。markdown を選ぶと Personal Agent が後で楽をする
- **sunk cost への執着を捨てる**: すでに書いた Supabase コードは 1 時間の work だが、残すと将来の開発全体を汚染する。消すのが正解

## 記事ネタとして

この決定記録自体が Phase E の記事の核心の 1 つになる。Karpathy の LLM Wiki が「wiki に整理させる」だけでなく「**データ層そのものを markdown にする**」方向に拡張できることを実証する例。

記事の構成案への追加節:

> ### 4 章（仮）: "Supabase はやめた" — データ層を markdown に揃える
>
> Next.js アプリのデフォルトを Supabase にした直後、「なぜ Supabase が必要なのか」と問い返された。答えられなかった。単一ユーザーのツールに認証とマネージド DB を持ち込むのは、Web 業界の慣習を無思考に適用しただけだった。データ層を markdown に揃えると、LLM Wiki の `raw/` `wiki/` とシームレスに連続する。Personal Agent は DB アクセスではなく `fs.readdir` でデータに触る。
