import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listGoals } from "@/lib/data/goals";
import { listDayActuals } from "@/lib/data/actuals";

export default async function Home() {
  const goals = await listGoals();
  const days = await listDayActuals();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Hello, Personal Agent</CardTitle>
          <CardDescription>
            markdown ベースのデータ層（spec-002）が配置されました。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted-foreground">data/goals</dt>
            <dd className="font-mono text-right">{goals.length} 件</dd>
            <dt className="text-muted-foreground">data/actuals</dt>
            <dd className="font-mono text-right">{days.length} 日分</dd>
          </dl>
          <p className="text-sm text-muted-foreground">
            以降の spec で目標管理 UI（spec-003）、実績入力（spec-004）、
            RSS 自動取得（spec-005）、ダッシュボード可視化（spec-006）を順次積み上げます。
          </p>
          <Button className="w-full" disabled>
            ダッシュボード（spec-006 で実装）
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
