# Roadmap

このドキュメントはリポジトリ全体の方向性を管理します。実行レベルの細かな進捗は各 PRD の `progress.md` に置きます。

## 現在の注力点

- OSS テンプレートとして再利用しやすい状態を維持する
- Claude Code、Codex、Ralph Loop、GitHub Actions の契約を安定させる
- 導入時のセットアップと公開ドキュメントをわかりやすくする
- Ralph/Codex の位置づけを README でより明確にする

## アクティブ PRD

このリポジトリは Ralph Matsuo テンプレートをベースにした実験環境で、現在 1 件の PRD がアクティブです。

- `docs/prds/prd-llm-wiki/` — **凍結済み（2026-04-17）**。Andrej Karpathy の LLM Wiki パターンを spec-driven 開発と組み合わせる足場（`raw/`、`wiki/`、`CLAUDE.md` スキーマ）の構築まで完了（spec-001〜003）。seed ingest（spec-004/005）は保留し、`prd-personal-agent` での organic growth 実験で得た知見を踏まえて再設計する想定。
- `docs/prds/prd-personal-agent/` — **アクティブ**。peintangos 個人の目標と実績を可視化するダッシュボードを `personal-agent/` サブディレクトリに構築。Next.js 15 + Supabase + Vercel + shadcn/ui。MVP は対話 UI なし。実装中に参照した外部資料を `raw/` に投下し、`wiki/` が organic に育つ過程を `knowledge.md` に記録することで、Phase E（記事執筆）の一次素材とする。

本家テンプレートリポジトリに戻す際は、プロダクト固有の PRD を同梱しない方針を保ちます。テンプレート自身を改善するとき、または別リポジトリへ Ralph を導入するときに `docs/prds/prd-{slug}/` を作成してください。

## 今後の候補

- オンボーディングガイドを多言語化する
- リポジトリ健全性チェックを増やす
- npm 以外のリポジトリ向けセットアップ例を追加する
- ヘッドレス実行の可観測性を改善する
- このテンプレートで作った小さな公開サンプルリポジトリを出す
- 初回 GitHub Release を公開し、commit SHA ではなくバージョンで pin できるようにする
- docs-first ループが 30 秒で伝わる README 用スクリーンキャストか GIF を追加する
- ドキュメント契約を保ったまま、オーケストレーションコアを Python か TypeScript に寄せる余地を検討する
- 隣接する specs-first / agent orchestration 系テンプレートとの差別化を README でさらに明確にする
