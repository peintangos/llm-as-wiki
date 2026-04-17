# Markdown-first データ層

## 定義

アプリケーションのデータ層を DB ではなく **markdown ファイル**で実装する設計。本リポジトリ `prd-personal-agent` で 2026-04-17 に Supabase からピボットして採用した。

## ポイント

- **1 データ = 1 markdown**: 目標は `data/goals/{id}.md`、日別実績は `data/actuals/{yyyy-mm-dd}.md`
- **frontmatter にスキーマ**: zod で検証、`gray-matter` で parse
- **Git が履歴層**: `git log` / `git blame` で「いつ何を変えたか」が追える。DB migration 不要
- **LLM Wiki との連続性**: `raw/`（外部資料）・`wiki/`（二次資料）・`data/`（本人のログ）の 3 階層すべてが markdown なら、Personal Agent は区別なく読める
- **書き込みはローカル dev のみ**: Next.js Server Action が `fs` 経由で書き込む。Vercel 本番は read-only snapshot（ephemeral fs）
- **単一ユーザー前提**: Auth / RLS / migration 不要、リポジトリアクセスが認証を兼ねる

## 代表的な引用

> 「単一ユーザーのツールに Supabase は銀行金庫を設置した状態。markdown ファイルで十分」— [[sources/2026-04-17-pivot-from-supabase-to-markdown]]

## 適用条件

- ユーザー数: **単一または少数**
- 書き込み頻度: **中〜低**（日次〜週次）
- 共有: リポジトリアクセス or 静的 snapshot 配信で足りる

書き込み頻度が高い / 複数ユーザー / 強整合性が必要な場合は DB を使うべき。

## 関連 Source

- [[sources/2026-04-17-pivot-from-supabase-to-markdown]]

## 関連概念

- [[concepts/llm-wiki-pattern]] — データ層を markdown にすると wiki とシームレスに連続する
- [[concepts/single-user-web-app-design]] — この設計の前提条件
