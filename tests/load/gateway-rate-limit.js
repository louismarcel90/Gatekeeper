import http from "k6/http";
import { check } from "k6";

/* global __ENV */

const gatewayBaseUrl = __ENV.GATEWAY_BASE_URL || "http://localhost:3002";
const token = __ENV.GATEWAY_TOKEN || "";

export const options = {
  vus: 20,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.10"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const response = http.get(`${gatewayBaseUrl}/search`, {
    headers,
  });

  check(response, {
    "runtime returned controlled status": (res) =>
      res.status === 200 || res.status === 403 || res.status === 429,
  });
}
