import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { type Goal, GoalFrontmatterSchema } from "./schema";

const GOALS_DIR = path.join(process.cwd(), "data", "goals");

export async function listGoals(): Promise<Goal[]> {
  const entries = await fs.readdir(GOALS_DIR).catch(() => [] as string[]);
  const goals: Goal[] = [];

  for (const entry of entries) {
    if (!entry.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(GOALS_DIR, entry), "utf8");
    const parsed = matter(raw);
    const data = GoalFrontmatterSchema.parse(parsed.data);
    goals.push({ ...data, body: parsed.content.trim() });
  }

  return goals.sort((a, b) => b.period_start.localeCompare(a.period_start));
}

export async function getGoal(id: string): Promise<Goal | null> {
  const filePath = path.join(GOALS_DIR, `${id}.md`);
  const raw = await fs.readFile(filePath, "utf8").catch(() => null);
  if (!raw) return null;
  const parsed = matter(raw);
  const data = GoalFrontmatterSchema.parse(parsed.data);
  return { ...data, body: parsed.content.trim() };
}
