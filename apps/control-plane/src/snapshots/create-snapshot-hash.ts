import crypto from "node:crypto";

type JsonPrimitive = string | number | boolean | null;

type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

type JsonObject = {
  [key: string]: JsonValue;
};

function stableSerialize(value: JsonValue): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }

  const keys = Object.keys(value).sort();

  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key] ?? null)}`)
    .join(",")}}`;
}

export function createSnapshotHash(payload: JsonValue): string {
  return crypto
    .createHash("sha256")
    .update(stableSerialize(payload))
    .digest("hex");
}