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

<!--
ハマりどころ、予期せぬ挙動、「あとで痛い目にあった」ネタ。
-->

## LLM Wiki Organic Growth Observations

本 PRD の核心。実開発を通じて LLM Wiki がどう育つかの観察記録。後で記事化する素材。

### 各 spec 実行中に raw/ に投下した資料

<!--
spec 別に投下した外部資料をリストする。
例: spec-001 実装中に raw/articles/2026-04-18-nextjs-15-app-router.md を配置
-->

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
