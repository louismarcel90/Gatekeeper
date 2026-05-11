import crypto from "node:crypto";

type JsonPrimitive = string | number | boolean | null;

type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

type JsonObject = {
  [key: string]: JsonValue;
};

type SnapshotPayload = {
  version: number;
  generated_at: string;
  routes: JsonValue[];
  policies: JsonValue[];
};

type SnapshotDocument = SnapshotPayload & {
  integrity: {
    algorithm: "sha256";
    hash: string;
    generated_at: string;
  };
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

function createHash(payload: SnapshotPayload): string {
  return crypto
    .createHash("sha256")
    .update(stableSerialize(payload))
    .digest("hex");
}

export function verifySnapshotIntegrity(snapshot: SnapshotDocument): boolean {
  if (snapshot.integrity.algorithm !== "sha256") {
    return false;
  }

  const payload: SnapshotPayload = {
    version: snapshot.version,
    generated_at: snapshot.generated_at,
    routes: snapshot.routes,
    policies: snapshot.policies,
  };

  const computedHash = createHash(payload);

  return computedHash === snapshot.integrity.hash;
}