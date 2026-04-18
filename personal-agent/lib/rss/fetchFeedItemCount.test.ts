import test from "node:test";
import assert from "node:assert/strict";
import {
  countItemsFromFeed,
  fetchFeedItemCount,
} from "./fetchFeedItemCount";

test("counts <item> elements (RSS 2.0)", () => {
  const xml = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>note/peintangos</title>
    <item><title>a</title></item>
    <item><title>b</title></item>
    <item><title>c</title></item>
  </channel>
</rss>`;
  assert.equal(countItemsFromFeed(xml), 3);
});

test("counts <entry> elements (Atom)", () => {
  const xml = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Zenn/peintangos</title>
  <entry><title>a</title></entry>
  <entry><title>b</title></entry>
</feed>`;
  assert.equal(countItemsFromFeed(xml), 2);
});

test("empty feed returns 0", () => {
  assert.equal(countItemsFromFeed(`<rss><channel/></rss>`), 0);
  assert.equal(countItemsFromFeed(`<feed/>`), 0);
});

test("ignores tags that start with item/entry prefix but not the same element", () => {
  const xml = `<rss><channel>
    <itemCount>5</itemCount>
    <item/>
    <entrypoint/>
    <entry/>
  </channel></rss>`;
  // `<item>` matches (1), `<entry>` matches (1) — `itemCount` / `entrypoint` do not.
  assert.equal(countItemsFromFeed(xml), 2);
});

test("fetchFeedItemCount uses injected fetch and counts items", async () => {
  const stubFetch: typeof fetch = async () =>
    new Response(
      `<rss><channel><item/><item/><item/><item/></channel></rss>`,
      { status: 200 },
    );
  const count = await fetchFeedItemCount("https://example.test/rss", {
    fetchImpl: stubFetch,
  });
  assert.equal(count, 4);
});

test("fetchFeedItemCount throws on non-2xx", async () => {
  const stubFetch: typeof fetch = async () =>
    new Response("not found", { status: 404, statusText: "Not Found" });
  await assert.rejects(
    () =>
      fetchFeedItemCount("https://example.test/missing", {
        fetchImpl: stubFetch,
      }),
    /HTTP 404/,
  );
});
