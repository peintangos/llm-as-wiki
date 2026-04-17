import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  type Goal,
  type GoalFrontmatter,
  GoalFrontmatterSchema,
} from "./schema";

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

export async function writeGoal(goal: Goal): Promise<void> {
  // Revalidate frontmatter through zod to drop unknown fields and coerce types.
  const frontmatter: GoalFrontmatter = GoalFrontmatterSchema.parse({
    id: goal.id,
    title: goal.title,
    goal_type: goal.goal_type,
    horizon: goal.horizon,
    period_start: goal.period_start,
    period_end: goal.period_end,
    metric_key: goal.metric_key,
    target_value: goal.target_value,
  });

  // Strip undefined keys so gray-matter doesn't emit `key: undefined`.
  const cleanFrontmatter = Object.fromEntries(
    Object.entries(frontmatter).filter(([, v]) => v !== undefined),
  );

  const content = matter.stringify(goal.body?.trim() ?? "", cleanFrontmatter);

  await fs.mkdir(GOALS_DIR, { recursive: true });
  await fs.writeFile(path.join(GOALS_DIR, `${goal.id}.md`), content, "utf8");
}

export async function deleteGoal(id: string): Promise<void> {
  const filePath = path.join(GOALS_DIR, `${id}.md`);
  await fs.unlink(filePath).catch(() => {
    // Ignore "file not found" — deletion of nonexistent goals is a no-op.
  });
}
