#!/usr/bin/env tsx
/**
 * RSS 自動取得スクリプト。
 *
 * note.com と Zenn の RSS を fetch し、当日の data/actuals/{today}.md を
 * writeDayActuals で upsert する。source は 'rss' に設定。
 *
 * Usage:
 *   NOTE_USERNAME=peintangos ZENN_USERNAME=peintangos \
 *     npm run rss-ingest
 *
 *   もしくは:
 *     tsx scripts/rss-ingest.ts <note_user> <zenn_user>
 *
 * Vercel 本番は read-only snapshot のため、このスクリプトは peintangos の
 * ローカル macOS で launchd / cron から実行し、結果を git commit + push で
 * Vercel snapshot に反映する。
 */
import { fetchFeedItemCount } from "../lib/rss/fetchFeedItemCount";
import { writeDayActuals } from "../lib/data/actuals";
import type { MetricKey, Source } from "../lib/data/schema";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

async function safeFetch(
  label: string,
  url: string,
): Promise<number | null> {
  try {
    const count = await fetchFeedItemCount(url);
    console.log(`[${label}] ${url} -> ${count} items`);
    return count;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[${label}] failed: ${message}`);
    return null;
  }
}

async function main(): Promise<void> {
  const noteUser = process.env.NOTE_USERNAME || process.argv[2];
  const zennUser = process.env.ZENN_USERNAME || process.argv[3];

  if (!noteUser && !zennUser) {
    console.error(
      "NOTE_USERNAME / ZENN_USERNAME が未設定。argv[2]/argv[3] に user 名を渡すか .env を読み込んでから再実行してください。",
    );
    process.exit(0);
  }

  const metrics: Partial<Record<MetricKey, number>> = {};
  const sources: Partial<Record<MetricKey, Source>> = {};

  if (noteUser) {
    const count = await safeFetch("note", `https://note.com/${noteUser}/rss`);
    if (count !== null) {
      metrics.note_count = count;
      sources.note_count = "rss";
    }
  }

  if (zennUser) {
    const count = await safeFetch("zenn", `https://zenn.dev/${zennUser}/feed`);
    if (count !== null) {
      metrics.zenn_count = count;
      sources.zenn_count = "rss";
    }
  }

  if (Object.keys(metrics).length === 0) {
    console.warn("書き込む metrics がありません（全 fetch 失敗）。");
    process.exit(0);
  }

  const today = todayIso();
  await writeDayActuals(today, { metrics, sources });
  console.log(`書き込み完了: data/actuals/${today}.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(0);
});
