import Link from "next/link";
import { deleteActualAction } from "@/app/actuals/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  METRIC_META,
  type MetricKey,
  type Source,
} from "@/lib/data/schema";

export interface ActualRow {
  date: string;
  metricKey: MetricKey;
  value: number;
  source: Source;
}

interface Props {
  rows: ActualRow[];
}

export function ActualTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          条件に一致する実績はありません。
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-medium">日付</th>
            <th className="px-3 py-2 text-left font-medium">メトリクス</th>
            <th className="px-3 py-2 text-right font-medium">値</th>
            <th className="px-3 py-2 text-left font-medium">ソース</th>
            <th className="px-3 py-2 text-right font-medium">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => {
            const isRss = row.source === "rss";
            const deleteWith = deleteActualAction.bind(
              null,
              row.date,
              row.metricKey,
            );
            return (
              <tr key={`${row.date}-${row.metricKey}`}>
                <td className="px-3 py-2 font-mono text-xs">{row.date}</td>
                <td className="px-3 py-2">
                  {METRIC_META[row.metricKey].label}
                </td>
                <td className="px-3 py-2 text-right font-mono">{row.value}</td>
                <td className="px-3 py-2">
                  {isRss ? (
                    <Badge variant="secondary">自動取得</Badge>
                  ) : (
                    <Badge>手入力</Badge>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {isRss ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/actuals/${row.date}/${row.metricKey}/edit`}
                        className="text-xs underline-offset-2 hover:underline"
                      >
                        編集
                      </Link>
                      <form action={deleteWith}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="h-auto px-2 py-0 text-xs text-destructive hover:text-destructive"
                        >
                          削除
                        </Button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
