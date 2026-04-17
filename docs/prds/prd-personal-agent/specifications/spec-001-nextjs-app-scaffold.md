# spec-001: Next.js アプリ基盤を personal-agent/ に scaffold する

## Overview

リポジトリ直下の `personal-agent/` サブディレクトリに Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui のアプリを init する。Vercel に接続し、`ralph/personal-agent` への push で preview deploy が走る状態にする。最小の「Hello」ページが表示されれば完了。

## Acceptance Criteria

```gherkin
Feature: Next.js app scaffolded under personal-agent/

  Background:
    リポジトリ root には既に raw/、wiki/、docs/prds/ が存在する
    PRD のスコープは personal-agent/ サブディレクトリへの配置

  Scenario: Next.js 16 app が personal-agent/ に init されている
    Given リポジトリ root
    When personal-agent/package.json を読む
    Then Next.js 16 (App Router) + React 19 + TypeScript 構成である
    And app/page.tsx と app/layout.tsx が存在する
    And tsconfig.json、next.config.ts（or .mjs）、tailwind.config.ts が存在する

  Scenario: Tailwind と shadcn/ui がセットアップ済み
    Given personal-agent/
    When components/ui/ 配下を確認する
    Then shadcn/ui の button / card / input が少なくとも導入されている
    And globals.css に Tailwind directive（@tailwind base/components/utilities もしくは v4 の @import）が含まれる

  Scenario: 開発サーバが起動する
    Given personal-agent/ にインストール済み
    When cd personal-agent && npm run dev を実行する
    Then http://localhost:3000 で minimal "Hello" ページが表示される
    And コンソールに fatal エラーが出ない

  Scenario: Vercel に接続されている
    Given ralph/personal-agent ブランチ
    When このブランチに push する
    Then Vercel が preview deploy を開始する
    And deploy 完了後、発行された URL で「Hello」ページが見える

  Scenario: root .gitignore が personal-agent/ の成果物を適切に扱う
    Given 既存の root .gitignore
    When personal-agent/node_modules、.next、out/ 等を確認する
    Then これらは無視される
    And personal-agent/package.json、package-lock.json、ソースコードは追跡される
```

## Implementation Steps

- [x] `create-next-app@latest personal-agent` を非対話フラグで実行（結果: Next.js 16.2.4 / React 19.2.4 / Tailwind v4 が入った）
- [x] shadcn/ui を `init -d` で init（`base-nova` preset、`@base-ui/react` ベース、button が同時に追加される）
- [x] `shadcn add card input` で card、input を追加
- [x] `personal-agent/app/page.tsx` を Card + Input + Button で構成した Hello ページに差し替え
- [x] `personal-agent/README.md` を作成（Stack、Getting Started、関連ドキュメント、Vercel 手動実行手順）
- [ ] ~~`personal-agent/next.config.ts` に `turbopack.root` を設定~~（試行したが `import.meta.url` 経由の設定で config 読み込みが失敗。警告は受け入れ、knowledge.md の Gotchas に記録）
- [x] root `.gitignore` が `node_modules/`、`.next/`、`out/` を除外することを確認。personal-agent/ 自身の .gitignore も重ねて機能する
- [x] `npm run build` で production ビルドが成功することを確認（警告なし、3.5 秒でコンパイル）
- [ ] **Vercel link**（ユーザー手動実行）: `cd personal-agent && npx vercel link`。ブラウザ認証が必要なため自動化せず、peintangos が 1 回だけ実行
- [ ] Vercel link 後、`ralph/personal-agent` への push で preview deploy が動くことを確認
- [x] `knowledge.md` に spec-001 の観察（Next.js 16 が入った / shadcn base-nova preset / ネストした AGENTS.md / turbopack.root 設定）を記録
- [ ] Review（`/code-review`）
