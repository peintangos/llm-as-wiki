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

### 2026-04-17 — base-ui Select の API は radix-based shadcn と異なる（spec-003 で遭遇）

shadcn の `base-nova` preset は `@base-ui/react` ベース。従来の radix-based shadcn との差分:

- **`onValueChange` シグネチャ**: `(value: string) => void` ではなく `(value: string | null, eventDetails) => void`。null を受けうるので handler で `if (!v) return` が必要
- **`SelectValue` の表示**: children が空だと selected value（生の `"month"` や `"__none__"`）がそのまま表示される。label を出すには render function を渡す:

  ```tsx
  <SelectValue>
    {(value) => typeof value === "string" ? LABEL[value] ?? value : ""}
  </SelectValue>
  ```

- controlled / uncontrolled の切り替え: `defaultValue` では初期表示の SelectValue render function が値を受け取れず空になる可能性がある。`value` + `onValueChange` + `useState` の controlled パターンが安全

**記事ネタ候補**: 「shadcn の preset（base-nova vs classic）で API が微妙に違う」— LLM の訓練データが古いと radix-based の書き方をしてしまい、deprecation でない"正しい書き方"なのに挙動がズレる。LLM Wiki 的には、shadcn preset ごとに concept ページを分けて記録する必要がある、という知見

### 2026-04-17 — gray-matter の stringify は undefined キーも emit してしまう

`writeGoal` で `matter.stringify(body, frontmatter)` に `target_value: undefined` を含む object を渡すと YAML に `target_value: undefined` と出力されてしまう。

対策: zod parse 後に `Object.fromEntries(Object.entries(fm).filter(([, v]) => v !== undefined))` で undefined を除外してから stringify。

### 2026-04-17 — Server Actions で `redirect` は success path でのみ throw する

`upsertGoalAction` は `useActionState` のシグネチャ `(prev, formData) => Promise<State>` を満たす必要があるが、`redirect()` は内部的に throw する。パターン:

- 失敗時: `return { error: "..." }` で State を返す
- 成功時: `revalidatePath("/goals")` → `redirect("/goals?tab=...")` を throw（戻り値は未到達なので型は合う）

この「return か throw か」の分岐が Server Actions のクセ。TypeScript の型推論は緩いので、signature は `Promise<{ error?: string } | undefined>` にしてある。

### 2026-04-18 — spec-004: `[date]/[metric]/edit` という二段動的ルートと flattened row モデル

実績データは日別ファイル（`data/actuals/{yyyy-mm-dd}.md`）1 つに 6 メトリクス分の数量を持たせている。画面の一覧は「日付 × メトリクス」の flat row に展開して表示する。編集は行単位で必要なので URL は `/actuals/[date]/[metric]/edit` の二段動的ルートになった。

**観察:**

- 行の一意キーは `(date, metricKey)` の組。これをルート params に持たせれば Server Component だけで編集ページが完結する（`params: Promise<{ date: string; metric: string }>`）
- 削除は「ファイル削除」ではなく「metrics[metric] を 0 に戻す」セマンティクス。ファイル内の他メトリクスが生き残るため、行削除と「ファイル自体の削除」を分けて考える必要があった
- 一覧で表示するかどうかのフィルタは `value > 0 || source === "rss"` にした。zero かつ manual は「未記録」と同義なので除外

**実装メモ:**

- `writeDayActuals(date, patch: { metrics?, sources?, appendBody? })` を `getDayActuals` → 存在すれば merge / なければ `zeroedDayActuals` で初期化 の方針で 1 関数に集約
- body の append は `# {date}` の見出しに ISO timestamp 付きリスト行を足す形式。編集履歴としても機能する（後で `## 変更履歴` セクションに整理しても良い）
- フィルタ UI は base-ui Select ではなくネイティブ `<select>`。`<form method="get">` で URL クエリ駆動にすれば Server Component の searchParams で完結する。base-ui Select は `onValueChange` が必要な client state なのでフィルタ用途には重い

### 2026-04-18 — spec-006: HorizonTabs を `components/shared/` に抽出した

spec-003 で作った `components/goals/HorizonTabs.tsx` をダッシュボードでも使うため、`components/shared/HorizonTabs.tsx` に移動した。元から `usePathname` + `useSearchParams` で URL 駆動の設計にしていたので、ダッシュボード（`/`）と /goals の両方から同じインスタンスで呼び出せば「tab state が親 page 側に閉じる」構造が自然に維持される。

**観察:**

- `pathname` を読むので、/ でも /goals でも動作が自動で分岐する（/goals?tab=X と /?tab=X のどちらにも正しくリンク）
- クライアント側で `useRouter().push` を使うより、Link + URL クエリ駆動のほうがシンプルで Server Component 親が searchParams を読めば即状態を取り戻せる
- spec-003 時点で「URL 駆動」を選んだ判断が、spec-006 での共通化を摩擦なく進めさせた。**先行 spec の小さな設計判断が後続 spec を楽にする例**

### 2026-04-18 — spec-006: Recharts は shadcn/ui Chart primitive を使わず直接

shadcn/ui 2.x には `chart` component があり、Recharts をラップしてテーマトークンと ChartContainer / ChartTooltipContent を提供する。今回 spec は「Recharts（or similar）」「shadcn/ui Chart の docs を raw/ に投下」と書いていたが、実装時に直接 Recharts を呼ぶ選択をした。

**理由:**

- Chart primitive は `ChartConfig` で label / color / icon を宣言する前置が必要。今回は 6 メトリクスに `METRIC_META` で既に label を持っており、二重定義になる
- 色は Recharts の `stroke={COLORS[i]}` で直接指定、CSS variable `var(--color-chart-N, fallback)` を使うことで Tailwind v4 theme を尊重する余地も残した
- ラップ層を薄く保つことで、Recharts 標準 API のドキュメントがそのまま読める

**観察:**

- Recharts v3 の `ResponsiveContainer` は親に `height` 指定が必要（% だと動かない）。`className="h-64 w-full"` で固定してから `<ResponsiveContainer width="100%" height="100%" />` が最小構成
- `isAnimationActive={false}` を指定しないと page navigation のたびに linear 補間アニメが走って散漫に見える
- Server Component からは `<ActualsChart>` を呼ぶと `"use client"` が必要（Recharts は DOM 依存）。ただし データ集計（`buildMultiMetricSeries`）は pure なので Server Component 側で計算してから渡す形にするとクライアント JS バンドルが減る

### 2026-04-18 — spec-006: 進捗計算を 3 種の pure util に分離してテストした

`lib/dashboard/progress.ts` に:

- `sumMetricInPeriod(days, metric, start, end)` — 境界は inclusive
- `computeGoalProgress(goal, days)` — 目標側の `target_value` と `metric_key` を見て percentage を返す。未設定なら `null`、超過は 100 にクランプ
- `buildMultiMetricSeries(days, metrics, start, end)` — chart 用の flat row（date + metric1 + metric2 + ...）

を切り出し、node:test で 8 ケース（ハッピーパス / 期間外除外 / target 0 / target undefined / metric_key undefined / 100 クランプ / inclusive 境界 / 複数メトリクス / 空メトリクス配列）を通した。

**観察:**

- pure 関数に切り分けると、React / Recharts を一切ロードせずに単体テストできる
- `@/lib/data/schema` の path alias は tsx が tsconfig を読んで解決してくれた（別途 tsconfig-paths-loader 不要）
- `makeGoal` / `makeDay` の factory を test 内に置くだけでテスト可読性が上がる

### 2026-04-18 — spec-005: RSS パーサー依存を捨てて正規表現 + fetch で十分

spec は「RSS parser を導入（`fast-xml-parser` or `rss-parser`）」と書いていたが、実装時に「記事数を数えるだけなら正規表現で十分」と判断して parser 依存を落とした。

**観察:**

- `<item\b[^>]*>` と `<entry\b[^>]*>` のタグ数を数えるだけ。RSS 2.0 と Atom の両方をカバーできる
- `<itemCount>` のような紛らわしいタグは `\b` 境界で除外される
- テストで RSS 2.0 / Atom / 空フィード / 紛らわしいタグ / fetch 成功 / 非 2xx の 6 ケースを確認。全て pass
- 依存追加ゼロで完結したため、next build に影響なし、devDependencies も増やさない（tsx は test runner 用途で別途追加）

**方針として:**

- 「依存を入れるかどうか」は spec が規定する要求ではなく実装側の判断対象。spec に `fast-xml-parser` と書いてあっても、成果が同等ならより軽量な実装を優先する
- 「参照した parser docs を raw/ に投下」という spec 項目は、parser を使わなかったので該当なし → skip と記録

### 2026-04-18 — spec-005: node:test + tsx でテスト基盤を最小構成で立ち上げた

プロジェクトは jest / vitest を入れていない状態だった。spec-005 が `fetchFeedItemCount` の単体テストを要求したので、最小工数でテスト基盤を整えた。

**採用:**

- `node --test`（Node 20 以降の組み込みテストランナー）+ tsx（TypeScript を Node に直接読み込ませる loader）
- `package.json` の test script: `tsx --test lib/rss/*.test.ts`
- テストは `lib/rss/fetchFeedItemCount.test.ts` に配置し、`import test from "node:test"; import assert from "node:assert/strict"` を使う

**理由:**

- Next.js ビルドと完全に分離できる（`next build` は `__tests__` や `.test.ts` を無視、`tsx --test` も production ビルド経路に影響しない）
- Jest / Vitest の設定ファイル、ts-jest / vite-config、jsdom などを一切入れなくて済む
- Node の組み込みテストランナーは TAP 出力、signal handling、並列実行をすべてサポート済み
- fetch はグローバルなので `fetchImpl` を DI する形にすれば stub 可能、モック lib も不要

**制限:**

- React コンポーネントのレンダリングテストはできない（jsdom + testing-library が必要）
- しかし本 PRD は UI 側は chrome-devtools の実ブラウザ検証で代替しているので問題なし
- util 層・データ層のテストだけが必要 → node:test で十分

この組み合わせは **「純関数層にだけテストを入れたい」軽量プロジェクト** のベースラインとして再利用できる。Ralph Matsuo テンプレ本家にも backport 候補。

### 2026-04-18 — spec-005: Vercel Cron を選ばなかったことで得た副次的メリット

PRD 段階で「Vercel Cron でサーバレス定期実行するか、ローカル node script で手動 / launchd 実行にするか」迷った末、後者を選んだ。実装してみて気づいた副次的メリット:

- **認証不要**: Vercel Cron は Authorization ヘッダー付き内部 request を route handler に送る構造。secret の env 配置・検証が必須。ローカル実行はリポジトリアクセス自体が authn 相当なので不要
- **書き込みが永続化する**: Vercel は ephemeral fs なので route handler で `fs.writeFile` しても reboot で消える。ローカル実行なら git commit + push のフローに自然に乗る
- **fetch 元 IP が自分**: note.com / Zenn 側から見ると普通のユーザーアクセス。Vercel の IP レンジから大量 fetch が飛ぶと rate limit リスクがあるが、個人 PC からの 1 日 1 回なら無関係
- **デバッグが容易**: 手元の terminal で `NOTE_USERNAME=... npm run rss-ingest` を打てば即座に結果が見える。Vercel Cron だと Functions ログを都度見る必要がある

**記事ネタ:**

> Karpathy 原典にもなかった観察: 「個人運用 LLM Wiki の自動化は、サーバレス Cron よりローカル scheduled script のほうが素直」

### 2026-04-18 — base-ui Select の `disabled` は SelectTrigger ではなく Root に渡す

編集ページでメトリクスと日付をロックするため、ActualForm に `lockMetricAndDate` フラグを入れた。base-ui の `Select` は `<Select disabled>` を Root に渡すと trigger が greyed out になる挙動で、shadcn の radix-based Select と同じ。ただし hidden input で値を送る必要がある（disabled な `<select>` は form submission に含まれない）ので、`{lockMetricAndDate && <input type="hidden" name="metric_key" value={metricKey} />}` を併設する。

### 2026-04-17 — initial Ingest は **observation-triggered** だった（重要）

spec-001〜003 完走の後、peintangos から「なかなか compile しないのね / wiki, raw が育たない」と指摘されて初めて、wiki/ の初回 Ingest を実行した。

**観察:**

- 現 CLAUDE.md の LLM Wiki セクションは "Run Ingest **when** new files appear under `raw/`" と書いていた
- 書き手（peintangos）が "when" を判断するかと思いきや、**Claude（俺）も書き手もどちらも when を判定していなかった**
- 俺は spec 実装モードに入ると curator モードに戻らず、raw/ に資料を投下しても wiki/ 生成の起動を忘れる
- wiki/ は 2 週間近く空のまま（scaffolding 以後ゼロ）だった可能性がある

**対策として実施:**

1. **initial Ingest を走らせた** — 15 wiki ページを生成（3 sources / 5 concepts / 3 entities / 2 syntheses + index + log entry）
2. **CLAUDE.md に "When to trigger Ingest" セクションを追記** — 4 種のトリガー（spec 完了時 / ユーザー要求時 / セッション終了時 / ユーザーの stagnation 指摘時）を明示
3. **observation-triggered を first-class trigger として位置づけた** — 「wiki 育たないね」を casual comment ではなく動作命令として扱う

**記事ネタとして核心 — Phase E 記事の 5 章（仮）:**

> "Karpathy の LLM Wiki は自動で育たない — 誰も Ingest を呼ばない"
>
> 原典には "when new files appear" とだけあり、トリガーの実装は読者任せになっている。個人運用なら自然に思い出すかもしれないが、spec-driven で Claude Code を回している環境では、Claude は実装モードに入ると curator モードに戻れない。2 週間近く wiki が空のまま放置されていたのを peintangos が「compile しないのね」と口にして初めて気づいた。
>
> これを受けて、CLAUDE.md に明示的なトリガー条項を追加した。**「ユーザーの停滞指摘を first-class trigger として扱う」** を Ingest の定義に組み込んだ。Karpathy の原典を spec-driven に接続するとき、この一行の追加が最も効いた修正だった。

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
