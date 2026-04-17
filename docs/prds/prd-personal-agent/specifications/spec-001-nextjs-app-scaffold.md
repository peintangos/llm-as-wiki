# spec-001: Next.js アプリ基盤を personal-agent/ に scaffold する

## Overview

リポジトリ直下の `personal-agent/` サブディレクトリに Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui のアプリを init する。Vercel に接続し、`ralph/personal-agent` への push で preview deploy が走る状態にする。最小の「Hello」ページが表示されれば完了。

## Acceptance Criteria

```gherkin
Feature: Next.js app scaffolded under personal-agent/

  Background:
    リポジトリ root には既に raw/、wiki/、docs/prds/ が存在する
    PRD のスコープは personal-agent/ サブディレクトリへの配置

  Scenario: Next.js 15 app が personal-agent/ に init されている
    Given リポジトリ root
    When personal-agent/package.json を読む
    Then Next.js 15 (App Router) + React 19 + TypeScript 構成である
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

- [ ] `cd /Users/matsuojumpei/Projects/llm-as-wiki && npx create-next-app@latest personal-agent` を実行（TypeScript Yes、Tailwind Yes、App Router Yes、ESLint Yes、`src/` dir はどちらでも）
- [ ] shadcn/ui を init（`cd personal-agent && npx shadcn@latest init` → theme は Neutral、CSS variables Yes）
- [ ] button、card、input コンポーネントを追加（`npx shadcn@latest add button card input`）
- [ ] `personal-agent/app/page.tsx` を minimal な "Hello, Personal Agent" ページに差し替え
- [ ] `personal-agent/README.md` を作成（セットアップ手順、開発コマンド、deploy 方法）
- [ ] root `.gitignore` を確認し、`personal-agent/node_modules/`・`personal-agent/.next/`・`personal-agent/out/` が無視されるか検証（必要なら追記）
- [ ] Vercel CLI で project を link（`cd personal-agent && npx vercel link` → Vercel アカウントの peintangos/personal-agent プロジェクトを作成）
- [ ] `ralph/personal-agent` に push し、Vercel preview deploy が動くことを確認
- [ ] `knowledge.md` に spec-001 の観察を記録（ハマりポイント・参照した外部資料があれば `raw/` に投下）
- [ ] Review（`/code-review`）
