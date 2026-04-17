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

## LLM Wiki Organic Growth Observations

本 PRD の核心。実開発を通じて LLM Wiki がどう育つかの観察記録。後で記事化する素材。

### 各 spec 実行中に raw/ に投下した資料

- **spec-001（2026-04-17）**: 特になし。scaffold は `npx create-next-app@latest` と `shadcn@latest init -d` の定型操作だけで済んだため外部ドキュメント参照は不要だった。初回の organic growth observation: 「scaffolding 系の spec は raw/ が育たない」という事実自体が次の教訓

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
