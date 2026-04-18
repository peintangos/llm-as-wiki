// RSS 2.0 は `<item>`、Atom は `<entry>` を要素名として使う。
// note.com の RSS は RSS 2.0、Zenn は Atom を返すため両方を数える。
// XML パーサー依存を避け、タグ数を正規表現で数える軽量実装にする。
const ITEM_PATTERN = /<item\b[^>]*>/g;
const ENTRY_PATTERN = /<entry\b[^>]*>/g;

export function countItemsFromFeed(xml: string): number {
  const items = xml.match(ITEM_PATTERN)?.length ?? 0;
  const entries = xml.match(ENTRY_PATTERN)?.length ?? 0;
  return items + entries;
}

export interface FetchFeedOptions {
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export async function fetchFeedItemCount(
  url: string,
  options: FetchFeedOptions = {},
): Promise<number> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 15_000,
  );
  try {
    const res = await fetchImpl(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
    }
    const xml = await res.text();
    return countItemsFromFeed(xml);
  } finally {
    clearTimeout(timeout);
  }
}
