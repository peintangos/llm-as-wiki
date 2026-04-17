# Knowledge — Personal Agent 構想の第一歩

本ファイルは、Personal Agent ダッシュボードの実装中に得た気づき、技術的ハマり、LLM Wiki の organic growth 観察を蓄積する場所。Phase E（記事執筆）の一次素材として使う前提で、日付付きで追記する。

## Reusable Patterns

<!--
他の PRD / 他のリポジトリでも再利用できる実装パターンを記録する。
例: フォーム共通化、Server Actions + zod、RLS policy のテンプレなど。
-->

## Integration Notes

<!--
Supabase / Next.js / Vercel の組み合わせで、忘れやすい接続ポイント。
例: Auth の redirect URL、Service role key の扱い、Vercel Cron の Authorization。
-->

## Gotchas

### 2026-04-17 — Next.js 16 が入った（15 ではなく）

`create-next-app@latest` は Next.js 16.2.4 をインストール。PRD と spec は「Next.js 15」と書いていたが、実際は 16 系だった。PRD / spec-001 を「Next.js 16」に修正済み。

- `@base-ui/react` ベースの shadcn（`base-nova` preset）になっており、古い radix-based shadcn とは API が微妙に異なる可能性
- `lucide-react` が `^1.8.0`（非常に新しい major）— デフォルトで `icon library: lucide` と components.json に記録されるが、旧来の 0.x 系とは import path が違う可能性あり（使うとき注意）

### 2026-04-17 — Vercel の `-green` サフィックス

`vercel link` で project 名を `personal-agent` として作ったら、Vercel 側が既存プロジェクトとの衝突を避けるため `-green` サフィックスを付けた。結果、本番 URL は `https://personal-agent-green.vercel.app`。

- Vercel のプロジェクト名は Vercel アカウント内でユニーク性が要求される
- 同名プロジェクトが既にある場合、Vercel は `-red` / `-blue` / `-green` などのランダムな色サフィックスを付ける
- dashboard 上で rename は可能だが、URL は固定。記事では「プロジェクト名衝突で green になった」という小ネタとして使える

### 2026-04-17 — `create-next-app` が embedded .git を作ってしまう

`npx create-next-app@latest personal-agent` は `personal-agent/.git/` を自動生成する。outer repo（llm-as-wiki）から見ると personal-agent はネストした git リポジトリとみなされ、`git add` すると gitlink（submodule 相当）として staged される。warning: `adding embedded git repository: personal-agent`。

解決:

1. `git rm --cached -f personal-agent`（gitlink を index から外す）
2. `rm -rf personal-agent/.git`（embedded リポジトリを物理削除）
3. `git add -A` で個別ファイルとして再追加

この操作後、29 ファイルが personal-agent/ 配下で個別追跡されるようになった。

**記事ネタ候補**: 「モノレポ風にサブディレクトリへ Next.js を置くときの落とし穴」— サブディレクトリの `.git` を残すと submodule 化される。Ralph Matsuo のような docs-first テンプレートでアプリを同居させる際、最初に踏む罠。

### 2026-04-17 — ネストした AGENTS.md / CLAUDE.md

`create-next-app` は `personal-agent/AGENTS.md` と `personal-agent/CLAUDE.md` を自動生成。内容は「この Next.js は breaking change があるので docs/ を確認してから書け」という注意喚起。

- リポジトリ root にも Ralph Matsuo の `AGENTS.md` と `CLAUDE.md` が存在するため、Claude Code から見ると**ネストした指示ファイル**になる
- ルートと personal-agent/ のどちらが優先されるか、どう解釈されるかは未検証。実装を進めるうちに差分が出たら記録する
- 記事ネタとして: 「Next.js 16 の自動生成した AGENTS.md が、Ralph Matsuo のものと共存できるかどうか」は重要なエコシステム観察点

### 2026-04-17 — Turbopack root lockfile 警告（未解消、受容）

初回 build で「複数の lockfile を検出したので root を自動選択した」という警告。`/llm-as-wiki/package-lock.json`（Ralph Matsuo 用）と `/llm-as-wiki/personal-agent/package-lock.json` が競合。

試した修正と結果:

1. **試行 1**: `next.config.ts` に `turbopack.root: __dirname`（`fileURLToPath(import.meta.url)` 経由で ESM 風に）→ build が `Failed to load next.config.ts` で失敗
2. **現状**: `next.config.ts` を空 config に戻し、警告は受け入れる

原因の仮説: Next.js 16 の config loader が `import.meta.url` を含むファイルを CJS として評価しようとして失敗している可能性。より良い解決策は後続 spec で Next.js docs を `raw/` に投下した後に再検討する。build 自体は 3.5 秒で成功するため、実害はない。

**記事ネタ候補**: 「create-next-app@latest + Ralph Matsuo テンプレート（root に package-lock.json がある）の相性問題」— ネスト環境での Next.js 16 のワークスペース推論の挙動

### 2026-04-17 — Next.js 16 `middleware` が `proxy` にリネームされた（spec-002 で遭遇）

`@supabase/ssr` の推奨配置で `personal-agent/middleware.ts` を作って build したら deprecation 警告:

> The "middleware" file convention is deprecated. Please use "proxy" instead.

Next.js 16 で以下がリネームされた:

| 旧 | 新 |
|-----|-----|
| `middleware.ts` | `proxy.ts` |
| `export function middleware()` | `export function proxy()` |
| `config.matcher` | 変更なし |

公式の理由:

- Express.js の middleware と混同されやすい
- "highly capable" すぎて濫用されがちだった（最後の手段として使うべき機能）
- "Proxy" はネットワーク境界性と Edge Runtime での動作を正しく表す

詳細は `raw/articles/2026-04-17-nextjs-16-middleware-to-proxy.md` を参照。

**記事ネタ候補**: 「Next.js 16 のこの rename は、技術的には小さな変更だが思想的には大きい。"middleware" は Express 的濫用を招くので "proxy" に名前を変えて最後の手段として格下げした」という API 設計哲学の話が書ける。

### 2026-04-17 — Supabase 公式 docs が WebFetch で summary しか返さなかった

`https://supabase.com/docs/guides/auth/server-side/nextjs` を WebFetch したところ、完全なコード block が返らず「documentation directs you to copy the lib utility functions」という summary が返ってきた。JavaScript の多い SPA 型ドキュメントサイトは WebFetch に弱い。

対策:

- peintangos の作業知識（Jan 2026 cutoff 内）で `@supabase/ssr` の確立パターンを書いた
- `raw/articles/2026-04-17-supabase-ssr-nextjs-notes.md` に peintangos 要約を配置（原典そのものではなく二次資料扱い）
- Next.js 16 の middleware-to-proxy は素直な docs ページだったのでフル fetch できた。この差は SPA vs SSR な docs 配信の差

**記事ネタ候補**: 「LLM Wiki に取り込むときの一次資料と二次資料」— 原典が SPA で取れないとき、Ingest 側で要約を作って二次資料として配置する運用。Karpathy の raw/ 原則と完全一致とは言えない変則だが、現実運用では必須。

### 2026-04-17 — Supabase `@supabase/ssr` は getAll/setAll のペアに単純化されている

旧 `@supabase/auth-helpers-nextjs` では `get`/`set`/`remove` の 3 メソッドが必要だったが、`@supabase/ssr` では getAll と setAll の 2 つに統一された。cookie を配列で一括管理するほうが forward の正確性が上がる。

- Server Component の文脈で setAll を呼ぶと throw する（Next.js の制約）→ try/catch で握りつぶす
- Middleware（proxy）側で setAll が動くので、Server Component での throw は無害

### 2026-04-17 — spec-002 で Supabase から markdown データ層にピボット（最重要）

spec-002 で Supabase（Postgres + Auth + RLS）のコード側を配置した直後、peintangos から「そもそもなぜ Supabase が必要なの？」と問われ、答えられなかった。

**剥がした前提:**

1. 「Web アプリ = Auth + DB が要る」という Web 業界の慣習前提
2. 「複数ユーザー想定」（実際は peintangos 本人のみ）
3. 「スマホから編集する可能性」（実際はローカル開発主体、Vercel は snapshot 閲覧用）

**選んだ代替案**: Option A — ローカル + markdown データ層

- `personal-agent/data/goals/{id}.md`（1 目標 = 1 ファイル）
- `personal-agent/data/actuals/{yyyy-mm-dd}.md`（1 日 = 1 ファイル、frontmatter に 6 メトリクス + sources）
- `lib/data/{schema.ts, goals.ts, actuals.ts}` に zod スキーマと read ヘルパー
- 書き込みは Server Action が `fs` で（ローカルのみ）
- 認証・RLS・migration・environment variables すべて不要

**削除したもの（30 分で剥がせた）:**

- `@supabase/ssr`、`@supabase/supabase-js` 依存
- `lib/supabase/`
- `proxy.ts`（Next.js 16 の middleware リネーム対応、もう不要）
- `app/login/page.tsx`、`app/auth/callback/route.ts`
- `supabase/migrations/0001_init.sql`
- `.env.example`

**残したもの（すべて価値がある）:**

- Next.js 16 基盤・shadcn/ui・Hello ページの型
- Vercel 接続（静的 export で read-only snapshot として活きる）
- `raw/articles/2026-04-17-nextjs-16-middleware-to-proxy.md`（知識として有効）

**教訓:**

- **Claude に指摘されて無意識の前提を剥がすのは LLM Wiki 思想そのもの** — wiki を compile するときの「この claim の根拠は？」と同じ問い
- **単一ユーザーツールに Web 業界慣習を持ち込むと過剰設計**。身の丈に合った選択肢を最初から検討すべきだった
- **データ形式は LLM との協働を想定すべき時代** — markdown を選ぶと Personal Agent が後で楽をする（raw/ や wiki/ と同じ方法で読める）
- **sunk cost は諦める**。1 時間の作業を惜しむより、開発全体を汚染しないほうが優先

**技術的 gotcha:**

- `gray-matter` は YAML の `date` リテラル（`2026-04-17`）を JS Date オブジェクトに変換する → zod schema で `z.preprocess` を使って string に戻す必要がある
- Next.js 16 で `middleware.ts` は `proxy.ts` にリネームされた（spec-002 のピボットで結果的にどちらも不要になったが）

**記事ネタとして核心:**

Phase E 記事の構成に「Supabase はやめた」章を追加する。Karpathy の LLM Wiki が「wiki に整理させる」だけでなく、**データ層そのものを markdown にする**方向に拡張できることを実証する例。**計画と現実のズレ、そして実装中の方針転換がそのまま記事の山場になる**。

- `raw/articles/2026-04-17-pivot-from-supabase-to-markdown.md` に詳細な意思決定記録
- 「Claude に『なんで Supabase が必要なの』と聞かれて答えられなかった」瞬間が記事の clip になる

## LLM Wiki Organic Growth Observations

本 PRD の核心。実開発を通じて LLM Wiki がどう育つかの観察記録。後で記事化する素材。

### 各 spec 実行中に raw/ に投下した資料

- **spec-001（2026-04-17）**: 特になし。scaffold は `npx create-next-app@latest` と `shadcn@latest init -d` の定型操作だけで済んだため外部ドキュメント参照は不要だった。初回の organic growth observation: 「scaffolding 系の spec は raw/ が育たない」という事実自体が次の教訓
- **spec-002（2026-04-17）**: 2 件投下
  - `raw/articles/2026-04-17-supabase-ssr-nextjs-notes.md` — Supabase の `@supabase/ssr` + Next.js App Router の確立パターン要約（docs fetch が summary しか返さなかったので二次資料として配置）
  - `raw/articles/2026-04-17-nextjs-16-middleware-to-proxy.md` — Next.js 16 の `middleware` → `proxy` リネーム docs の抜粋。Next.js 公式 docs は完全 fetch できた
  - organic growth observation: **「コードを書く spec で初めて raw/ が育ち始めた」**。spec-001（scaffold）では外部資料参照不要だった contrast が鮮明。Karpathy パターンが活性化するのは spec-002 以降と体感できた

### Ingest で生成された wiki ページの品質

<!--
生成された wiki/sources, concepts, entities, synthesis のうち、
想定外に価値があったもの / 期待外れだったものを記録する。
-->

### 開発と wiki の同期

<!--
開発のどのタイミングで Ingest を回したか。
開発スピードと wiki 更新頻度のバランス、違和感など。
-->

### Personal Agent（次期 PRD）で wiki をどう使いたいか

<!--
実開発中に「ここで wiki を参照してくれたら嬉しい」と感じたシーン。
これが次期 PRD の要件の種になる。
-->

## Observations for Article

<!--
Phase E（記事執筆）でそのまま使える気づき。観点ごとに箇条書き。
-->

### Karpathy 原典に忠実に従えた点

- （随時追記）

### 逸脱せざるを得なかった点

- （随時追記）

### Ralph Matsuo 本家に backport したい要素

- （随時追記）

### 感想・次に試したいこと（記事の「おわり」素材）

- （随時追記）

## Testing Notes

<!--
zod schema、util 関数の単体テスト方針、E2E の粒度などを記録。
-->
