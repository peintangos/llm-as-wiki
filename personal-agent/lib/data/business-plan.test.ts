import test from "node:test";
import assert from "node:assert/strict";
import { toSlidesEmbedUrl } from "./business-plan";

test("toSlidesEmbedUrl: rewrites /pub URL", () => {
  const result = toSlidesEmbedUrl(
    "https://docs.google.com/presentation/d/ABC123xyz/pub?start=false",
  );
  assert.equal(
    result,
    "https://docs.google.com/presentation/d/ABC123xyz/embed",
  );
});

test("toSlidesEmbedUrl: rewrites /edit URL", () => {
  const result = toSlidesEmbedUrl(
    "https://docs.google.com/presentation/d/ABC123xyz/edit#slide=id.p1",
  );
  assert.equal(
    result,
    "https://docs.google.com/presentation/d/ABC123xyz/embed",
  );
});

test("toSlidesEmbedUrl: already-embed URL stays stable", () => {
  const result = toSlidesEmbedUrl(
    "https://docs.google.com/presentation/d/ABC123xyz/embed",
  );
  assert.equal(
    result,
    "https://docs.google.com/presentation/d/ABC123xyz/embed",
  );
});

test("toSlidesEmbedUrl: returns null for non-Slides URL", () => {
  assert.equal(toSlidesEmbedUrl("https://example.com/foo"), null);
  assert.equal(toSlidesEmbedUrl(""), null);
});
