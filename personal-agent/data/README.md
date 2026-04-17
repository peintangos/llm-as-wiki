# data/ — Markdown-Backed Data Layer

本ディレクトリは Personal Agent の **データ層**。Supabase のようなマネージド DB は使わず、目標と実績をすべて **プレーンな markdown ファイル** としてコミットする。

## なぜ markdown？

- **LLM Wiki と整合する**: `raw/`（外部資料）・`wiki/`（整理）・`data/`（本人のログ）の 3 階層すべてが markdown。Personal Agent は区別なく読める
- **Git が履歴層になる**: 「10 月にこの目標を追加した」「12 月にこの実績を記録した」が git log / git blame で追える
- **認証不要の単一ユーザー前提**: peintangos 本人のみが読み書きする
- **依存ゼロ**: DB サーバも接続文字列も環境変数もない

## 書き込みのルール

- **ローカル `npm run dev` のみで書き込む**。Server Action が `fs` でファイルを書く
- Vercel デプロイ版は **read-only snapshot**。本番で Server Action が呼ばれても ephemeral fs でデータは永続化されない
- 書き込み後は **git commit + push** でリポジトリに反映 → Vercel が自動 redeploy してスナップショットが更新される

## ディレクトリ

- `goals/{id}.md` — 1 目標 = 1 markdown
- `actuals/{yyyy-mm-dd}.md` — 1 日 = 1 markdown（frontmatter に各メトリクス）

## ファイル形式

### goals/{id}.md

```markdown
---
id: 2026-04-monthly-note-posts
title: note を月 4 本書く
goal_type: behavior     # behavior | outcome
horizon: month          # 3yr | 1yr | half | month
period_start: 2026-04-01
period_end: 2026-04-30
metric_key: note_count
target_value: 4
---

本文（任意）。目標の背景・意図・参考資料へのリンクなど。
```

### actuals/{yyyy-mm-dd}.md

```markdown
---
date: 2026-04-17
metrics:
  note_count: 0
  zenn_count: 1
  x_posts: 3
  meetings: 0
  events: 1
  deals: 0
sources:
  note_count: rss
  zenn_count: rss
  x_posts: manual
  meetings: manual
  events: manual
  deals: manual
---

本文（任意）。その日の振り返り、印象的な出来事など。
```

## メトリクスの語彙

`lib/data/schema.ts` の `METRIC_KEYS` で固定定義する 6 メトリクス:

| key | label | unit | 取得方法 |
|-----|-------|------|---------|
| `note_count` | note 記事数 | articles | RSS 自動（spec-005） |
| `zenn_count` | Zenn 記事数 | articles | RSS 自動（spec-005） |
| `x_posts` | X ポスト数 | posts | 手入力 |
| `meetings` | 社長アポ数 | meetings | 手入力 |
| `events` | イベント出席数 | events | 手入力 |
| `deals` | 商談成功数 | deals | 手入力 |

新規メトリクス追加時は `schema.ts` の `METRIC_KEYS` と `METRIC_META` に追記し、既存の actuals ファイルに 0 の初期値を追加する。

## LLM Wiki との関係

`data/` 配下のファイルは、将来 Personal Agent が `wiki/` と並んで読み込む知識源になる。`raw/` は外部資料、`wiki/` は整理済み二次資料、`data/` は**本人が発信したログ**という位置づけ。全部 markdown なので、Agent からは一貫して扱える。
