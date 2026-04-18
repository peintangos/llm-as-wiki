import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const BUSINESS_PLAN_PATH = path.join(
  process.cwd(),
  "data",
  "business-plan.md",
);

// gray-matter が YAML 日付を Date に変換するのを string に戻す（schema.ts と同じ対応）。
const DateStringSchema = z.preprocess((v) => {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v;
}, z.string());

// slides_url は空 or 未設定も許容する（未設定フォールバックシナリオ）。
const SlidesUrlSchema = z.preprocess(
  (v) => (v === undefined || v === null ? "" : v),
  z.string(),
);

export const BusinessPlanFrontmatterSchema = z.object({
  title: z.string().default(""),
  slides_url: SlidesUrlSchema.default(""),
  visibility: z.enum(["private", "unlisted", "public"]).default("unlisted"),
  updated_at: DateStringSchema.optional(),
});

export type BusinessPlanFrontmatter = z.infer<
  typeof BusinessPlanFrontmatterSchema
>;

export interface BusinessPlan extends BusinessPlanFrontmatter {
  body: string;
}

export async function getBusinessPlan(): Promise<BusinessPlan | null> {
  const raw = await fs.readFile(BUSINESS_PLAN_PATH, "utf8").catch(() => null);
  if (!raw) return null;
  const parsed = matter(raw);
  const data = BusinessPlanFrontmatterSchema.parse(parsed.data);
  return { ...data, body: parsed.content.trim() };
}

/**
 * Google Slides の share URL（/pub、/edit、/present 等）を /embed 形式に
 * 書き換える。Presentation ID が抽出できなければ null を返す（フォールバック
 * で raw URL を iframe に入れてもブロックされるだけなので、呼び出し側が
 * 判断する）。
 */
export function toSlidesEmbedUrl(url: string): string | null {
  const match = url.match(/\/presentation\/d\/([^/]+)/);
  if (!match) return null;
  const id = match[1];
  return `https://docs.google.com/presentation/d/${id}/embed`;
}
