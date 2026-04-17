# Karpathy の LLM Wiki を spec-driven 開発に適用するとどうなるか

## 問い

Andrej Karpathy の [LLM Wiki パターン](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)（[[concepts/llm-wiki-pattern]]）を、Ralph Matsuo 風の docs-first spec-driven 開発に組み合わせると何が起きるか？ 本リポジトリ `llm-as-wiki` が実験台。

## 観察 1: 足場はほぼ自動で組める

`prd-llm-wiki` で `raw/` / `wiki/` / `CLAUDE.md` のスキーマを追加した。spec-001〜003（3 spec）で scaffold 完了。足場作成は spec-driven の得意分野 — AC を Gherkin で書き、implementation steps をチェックリストにすれば Claude Code が淡々と作れる。

## 観察 2: organic growth は **自動発火しない**

**最大の発見**: 足場が整って実コード（`prd-personal-agent`）を書き始めると、`raw/` は参照した docs が 3 ファイル増えただけ、`wiki/` は完全に空のままだった。Ingest を誰も呼ばない。

現 `CLAUDE.md` の定義は "Run Ingest **when** new files appear under `raw/`" と書かれていたが、**"when" を判定するアクター**が存在しない。Claude Code は spec 実装モードに入ると curator モードに戻らない。

### 含意

- Karpathy の原典は **Ingest の trigger を明示していない** — 個人運用を想定していたため
- spec-driven に組み込む場合、明示的なトリガーが必要:
  - **spec 完了時に Ingest を走らせる**（`/implement` の最後の step として追加）
  - **セッション終了時の review で Ingest を走らせる**
  - **ユーザーが「そういえば wiki 育ってる？」と気づいた時**（本リポジトリでの発火トリガーは実質これ）
- 本リポジトリでは 2026-04-17 に peintangos が「wiki, raw が育たない」と指摘したことで初めて Ingest が走った。**observation-driven trigger** が現状唯一

## 観察 3: データ層を markdown にすると wiki と連続する

`prd-personal-agent` spec-002 で Supabase から markdown にピボットした結果（[[synthesis/supabase-vs-markdown-data-layer]]）、**`raw/` / `wiki/` / `data/` の 3 階層すべてが markdown** になった。Personal Agent は将来、この 3 階層を区別なく読める。

これは Karpathy 原典では言及されていない拡張。原典は「LLM が整理する」wiki を想定したが、**本人のログ層（`data/`）**も markdown にすると、agent からは連続する知識空間に見える。

## 観察 4: Ralph Matsuo 本家への backport 候補

本実験から、本家 Ralph Matsuo テンプレートに逆流させる価値のある要素:

- **`raw/` と `wiki/` の opt-in 導入**（全 PRD への強制は重い）
- **spec 完了時の Ingest trigger** を `/implement` スキルに組み込む
- **markdown-first データ層のテンプレート**（`docs/prds/_template/` に追加）

## 残された論点

- Ingest の自動化はどこまで踏み込むべきか？ 完全自動化すると wiki が無意味に肥大する可能性
- `docs/prds/prd-{slug}/knowledge.md` と `wiki/` の責務分離（現状はやや重複）
- wiki のメンテナンスコストは長期的にどの程度か未検証（50〜500 source の範囲で運用して測るべき）

## 参照元

- [[sources/2026-04-17-pivot-from-supabase-to-markdown]]
- [[concepts/llm-wiki-pattern]]
- [[concepts/markdown-first-data-layer]]
- [[concepts/single-user-web-app-design]]
- [[concepts/nextjs-16-proxy-convention]]
- [[entities/andrej-karpathy]]
- [[synthesis/supabase-vs-markdown-data-layer]]
