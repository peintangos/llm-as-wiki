---
entity_type: product
---

# Supabase

## 概要

Postgres をバックエンドにしたマネージド BaaS。Auth、Row Level Security、Storage、Realtime などを統合提供する。`@supabase/ssr` パッケージで Next.js App Router 向けの server-side auth パターンを公式サポート。

## 本リポジトリとの関係

`prd-personal-agent` spec-002 で当初採用したが、**単一ユーザーツールには過剰**と判断して 2026-04-17 に markdown データ層にピボット（[[sources/2026-04-17-pivot-from-supabase-to-markdown]]）。Supabase プロジェクト自体は作成済みだが現状参照していない。

## 主要な関連概念

- [[concepts/supabase-ssr-pattern]] — Next.js App Router との統合パターン（本リポジトリでは不採用）
- [[concepts/markdown-first-data-layer]] — Supabase の代替として採用した設計
- [[concepts/single-user-web-app-design]] — Supabase を入れなかった理由の根拠

## このエンティティが登場する Source

- [[sources/2026-04-17-supabase-ssr-nextjs-notes]]
- [[sources/2026-04-17-pivot-from-supabase-to-markdown]]
