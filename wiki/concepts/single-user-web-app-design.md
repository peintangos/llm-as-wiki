# 単一ユーザー Web アプリの設計

## 定義

ユーザーが 1 人（自分自身）と限定されている Web アプリの設計方針。複数ユーザー前提の「Web アプリ = Auth + DB が要る」という慣習を剥がし、必要最小限の構成にする。

## ポイント

- **Auth 不要**: リポジトリへのアクセス権 = authn。外に出ない前提なら cookie / session すら不要
- **RLS 不要**: 他ユーザーがいないので行レベル権限の対象がない
- **マネージド DB 不要**: データは markdown ファイルまたは SQLite 等で十分（[[concepts/markdown-first-data-layer]]）
- **書き込みはローカル限定で OK**: 本番は read-only snapshot として配信、書き込みは自分のマシンでしか起きない
- **LLM との相性**: データが markdown なら、Personal Agent が `raw/` / `wiki/` と同じ方法でアクセスできる

## 代表的な引用

> 「Auth も RLS も『他者』を前提にした機能で、1 人の持ち物に銀行金庫を設置した状態」— [[sources/2026-04-17-pivot-from-supabase-to-markdown]]

## 無意識に置かれやすい前提（Claude が剥がすべき）

1. 「Web アプリ = Auth + DB が要る」→ 単一ユーザーには不要
2. 「複数ユーザー想定」→ 明示されない限り置かない
3. 「スマホから編集する可能性」→ 本当に必要か確認する

## いつこの設計を選ばないか

- **他者と共有する機能が必要**: 認証と権限が要る
- **書き込みがスマホ / 外部端末から発生**: ローカル限定の設計では足りない
- **強整合性やトランザクション要件**: DB が必要

## 関連 Source

- [[sources/2026-04-17-pivot-from-supabase-to-markdown]]

## 関連概念

- [[concepts/markdown-first-data-layer]]
- [[concepts/llm-wiki-pattern]]
