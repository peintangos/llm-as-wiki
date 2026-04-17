---
entity_type: product
---

# Next.js

## 概要

Vercel が開発する React-based Web framework。App Router（RSC 前提）を正規ルートとし、2026 年 4 月時点の安定版は Next.js 16.2。本リポジトリの `personal-agent/` で採用。

## 主要な関連概念

- [[concepts/nextjs-16-proxy-convention]] — Next.js 16 で `middleware` → `proxy` にリネーム
- [[concepts/supabase-ssr-pattern]] — Supabase Auth と組み合わせるときの標準パターン

## 本リポジトリでの採用内容

- **Framework**: Next.js 16.2.4（App Router、Turbopack）
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui（`base-nova` preset、`@base-ui/react` backend）
- **Deploy**: Vercel（静的 snapshot として配信）

## このエンティティが登場する Source

- [[sources/2026-04-17-nextjs-16-middleware-to-proxy]]
- [[sources/2026-04-17-supabase-ssr-nextjs-notes]]

## 関連エンティティ

- [[entities/supabase]]
