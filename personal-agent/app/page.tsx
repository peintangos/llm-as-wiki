import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listDayActuals } from "@/lib/data/actuals";
import { listGoals } from "@/lib/data/goals";

export default async function Home() {
  const goals = await listGoals();
  const days = await listDayActuals();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Hello, Personal Agent</CardTitle>
          <CardDescription>
            目標と実績を可視化するダッシュボードの入口。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted-foreground">data/goals</dt>
            <dd className="text-right font-mono">{goals.length} 件</dd>
            <dt className="text-muted-foreground">data/actuals</dt>
            <dd className="text-right font-mono">{days.length} 日分</dd>
          </dl>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/goals">
              <Button className="w-full">目標を見る</Button>
            </Link>
            <Link href="/actuals">
              <Button variant="secondary" className="w-full">
                実績を見る
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            spec-003 で目標管理 UI、spec-004 で実績手入力フォームが有効になりました。
            spec-005 以降で RSS 自動取得とダッシュボード可視化を追加します。
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
