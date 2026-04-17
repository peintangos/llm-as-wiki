# Supabase vs Markdown データ層 — 単一ユーザーツールでの選定

## 問い

単一ユーザーの Personal Agent ダッシュボードで、データ永続化として Supabase（Postgres + Auth + RLS）を使うべきか、それとも markdown ファイルで十分か？

本リポジトリは 2026-04-17 に一旦 Supabase を入れた後、markdown に切り替えた。その比較整理。

## 主要な観点

| 観点 | Supabase | Markdown データ層 |
|------|----------|-------------------|
| **セットアップ** | プロジェクト作成、URL / anon key、env 設定、migration、Auth provider 設定 | `mkdir data/` と zod schema を書くだけ |
| **認証** | Email OTP / OAuth / Magic Link、RLS で保護 | 不要（リポジトリアクセスが authn） |
| **Next.js 統合** | `@supabase/ssr` + 4 ファイル（client / server / middleware + root middleware） | `fs` + `gray-matter` のみ |
| **書き込み** | どこからでも可（RLS で権限管理） | Server Action 経由、ローカル `npm run dev` のみ。本番（Vercel）は read-only |
| **履歴** | DB dump / 別途監査ログが必要 | `git log` / `git blame` が標準装備 |
| **LLM との相性** | SQL / REST 経由で抽出、スキーマ依存 | 全部 markdown、`raw/` `wiki/` と同じ方法で読める |
| **スケール** | 大規模・多ユーザーに強い | 〜数千ファイル程度、単一ユーザー前提 |
| **依存関係** | `@supabase/ssr`、`@supabase/supabase-js`、Supabase アカウント | `gray-matter` と `zod`（軽量） |
| **取り消しコスト** | migration revert、データ export | `git revert` のみ |

## 本リポジトリで Markdown を選んだ理由

1. **単一ユーザー**: peintangos 本人のみが読み書きする（[[concepts/single-user-web-app-design]]）。RLS も Auth も対象がない
2. **LLM Wiki との整合**: `raw/` / `wiki/` がすでに markdown。`data/` も markdown なら Personal Agent が 3 階層を同じ方法で触れる（[[concepts/llm-wiki-pattern]]）
3. **身の丈**: 「Web アプリ = Auth + DB」という慣習前提を剥がすと、markdown で足りた

## いつ Supabase を選ぶべきか

- 複数ユーザーが同じデータを触る
- リアルタイム同期が必要
- 書き込みが本番環境（Vercel 等）から発生する
- 強整合性 / トランザクションが必要
- 「将来の multi-user 拡張」が具体的に視野に入っている

## 含意

**Web 業界の慣習を無思考に個人ツールに適用すると、銀行金庫を作ってしまう**。Claude のような LLM に最初に「なぜ DB が必要か」を問わせる訓練が、個人開発では価値が高い。

## 参照元

- [[sources/2026-04-17-pivot-from-supabase-to-markdown]]
- [[sources/2026-04-17-supabase-ssr-nextjs-notes]]
- [[concepts/markdown-first-data-layer]]
- [[concepts/single-user-web-app-design]]
- [[concepts/supabase-ssr-pattern]]
- [[entities/supabase]]
- [[entities/nextjs]]

## 残された論点

- **書き込み頻度の閾値**: markdown では何千ファイルまで実用的か？1 日 1 ファイル × 5 年 = 1825 ファイルなら余裕
- **Vercel 書き込み制限の緩和方法**: GitHub API 経由で書き込みする運用は可能か？
- **iCloud sync などと併用**: ローカル markdown をクラウドに同期しつつ、リポジトリでも管理する運用
