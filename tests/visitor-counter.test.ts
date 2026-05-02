import assert from "node:assert/strict";
import test from "node:test";

import { getPublicIpFromHeaders, getSiteVisitorStats, recordSiteVisit } from "@/lib/visitor-service";

function headers(values: Record<string, string | null>) {
  return {
    get(name: string) {
      return values[name.toLowerCase()] ?? null;
    },
  };
}

test("getPublicIpFromHeaders prefers the first forwarded IP", () => {
  assert.equal(
    getPublicIpFromHeaders(headers({ "x-forwarded-for": "203.0.113.10, 10.0.0.1" })),
    "203.0.113.10",
  );
});

test("recordSiteVisit is a safe no-op without DATABASE_URL", async () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    await assert.doesNotReject(() => recordSiteVisit("203.0.113.10"));
    assert.deepEqual(await getSiteVisitorStats(), { totalVisitors: 0, uniqueVisitors: 0 });
  } finally {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }
});
