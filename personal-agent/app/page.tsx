import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
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
          <p className="text-sm text-muted-foreground">
            spec-001 の成果物として最小の Hello ページを表示しています。
            以降の spec で Supabase 接続、目標管理、実績入力、RSS 取得、
            ダッシュボード可視化を順次積み上げます。
          </p>
          <Input placeholder="例: 今週の行動目標を 1 行で" />
          <Button className="w-full">Continue (未実装)</Button>
        </CardContent>
      </Card>
    </main>
  );
}
