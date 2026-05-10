import http from "k6/http";
import { check, sleep } from "k6";
/* global __ENV */

const gatewayBaseUrl = __ENV.GATEWAY_BASE_URL || "http://localhost:3002";
const token = __ENV.GATEWAY_TOKEN || "";

export const options = {
  vus: 2,
  duration: "20s",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<300"],
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
    "gateway responded": (res) => res.status > 0,
    "status is expected": (res) =>
      res.status === 200 || res.status === 403 || res.status === 429,
  });

  sleep(1);
}