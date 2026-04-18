import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getBusinessPlan, toSlidesEmbedUrl } from "@/lib/data/business-plan";

export default async function BusinessPlanPage() {
  const plan = await getBusinessPlan();

  if (!plan || !plan.slides_url) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">事業計画</h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← ダッシュボード
          </Link>
        </header>
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="mb-2 text-sm text-muted-foreground">
            まだ Slides URL が設定されていません。
          </p>
          <p className="text-xs text-muted-foreground">
            <code className="font-mono">
              personal-agent/data/business-plan.md
            </code>{" "}
            の frontmatter{" "}
            <code className="font-mono">slides_url</code> に Google Slides の
            share URL を記入してください。
          </p>
        </div>
      </main>
    );
  }

  const embedUrl = toSlidesEmbedUrl(plan.slides_url);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{plan.title || "事業計画"}</h1>
          {plan.updated_at && (
            <p className="text-xs text-muted-foreground">
              updated_at: {plan.updated_at} · visibility: {plan.visibility}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <a href={plan.slides_url} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">Slides を開く ↗</Button>
          </a>
          <Link
            href="/"
            className="self-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← ダッシュボード
          </Link>
        </div>
      </header>

      {embedUrl ? (
        <div className="aspect-video w-full overflow-hidden rounded-md border">
          <iframe
            src={embedUrl}
            title={plan.title || "Business plan"}
            className="h-full w-full"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          slides_url が Google Slides の URL 形式として解釈できませんでした。
          frontmatter を確認してください。
        </div>
      )}

      {plan.body && (
        <section className="mt-8">
          <h2 className="mb-3 text-base font-medium">メモ</h2>
          <div className="rounded-md border p-4 text-sm whitespace-pre-wrap text-muted-foreground">
            {plan.body}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            body は{" "}
            <code className="font-mono text-xs">
              data/business-plan.md
            </code>{" "}
            にプレーンテキストとして保存されている（markdown 整形はしていない）。
          </p>
        </section>
      )}
    </main>
  );
}
