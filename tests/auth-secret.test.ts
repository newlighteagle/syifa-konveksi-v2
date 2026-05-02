import assert from "node:assert/strict";
import test from "node:test";

import { getAuthSecret } from "@/lib/auth";

const ORIGINAL_AUTH_SECRET = process.env.AUTH_SECRET;
const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

function restoreEnv() {
  if (ORIGINAL_AUTH_SECRET === undefined) {
    delete process.env.AUTH_SECRET;
  } else {
    process.env.AUTH_SECRET = ORIGINAL_AUTH_SECRET;
  }

  if (ORIGINAL_NODE_ENV === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  }
}

test("getAuthSecret uses AUTH_SECRET when provided", () => {
  try {
    process.env.NODE_ENV = "production";
    process.env.AUTH_SECRET = "super-secret";

    assert.equal(getAuthSecret(), "super-secret");
  } finally {
    restoreEnv();
  }
});

test("getAuthSecret keeps development fallback without AUTH_SECRET", () => {
  try {
    process.env.NODE_ENV = "development";
    delete process.env.AUTH_SECRET;

    assert.equal(getAuthSecret(), "syifa-konveksi-dev-secret-change-me");
  } finally {
    restoreEnv();
  }
});

test("getAuthSecret throws a clear error in production without AUTH_SECRET", () => {
  try {
    process.env.NODE_ENV = "production";
    delete process.env.AUTH_SECRET;

    assert.throws(
      () => getAuthSecret(),
      /AUTH_SECRET is required in production for secure admin sessions/,
    );
  } finally {
    restoreEnv();
  }
});
