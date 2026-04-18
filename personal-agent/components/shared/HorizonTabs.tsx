"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { HORIZON_LABEL, HORIZONS, type Horizon } from "@/lib/data/schema";

interface Props {
  current: Horizon;
}

export function HorizonTabs({ current }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="mb-6 flex gap-1 border-b">
      {HORIZONS.map((horizon) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", horizon);
        const href = `${pathname}?${params.toString()}`;
        const isCurrent = current === horizon;

        return (
          <Link
            key={horizon}
            href={href}
            className={[
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              isCurrent
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {HORIZON_LABEL[horizon]}
          </Link>
        );
      })}
    </div>
  );
}
