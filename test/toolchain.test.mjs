import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);

function read(path) {
  try {
    return readFileSync(new URL(path, root), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

test("development tooling pins Node 24", () => {
  const packageJson = JSON.parse(read("package.json"));
  const packageLock = JSON.parse(read("package-lock.json"));
  const nvmrc = read(".nvmrc")?.trim() ?? null;

  assert.deepEqual(
    {
      nvmrc,
      packageEngine: packageJson.engines?.node ?? null,
      lockfileEngine: packageLock.packages?.[""]?.engines?.node ?? null,
    },
    {
      nvmrc: "24",
      packageEngine: ">=24 <25",
      lockfileEngine: ">=24 <25",
    },
  );
});
