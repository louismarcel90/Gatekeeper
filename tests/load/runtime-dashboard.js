import http from "k6/http";
import { check, sleep } from "k6";

/* global __ENV */

const gatewayBaseUrl = __ENV.GATEWAY_BASE_URL || "http://localhost:3002";

export const options = {
  vus: 5,
  duration: "20s",
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<250"],
  },
};

export default function () {
  const response = http.get(`${gatewayBaseUrl}/runtime/dashboard`);

  check(response, {
    "dashboard status 200": (res) => res.status === 200,
    "dashboard has instance": (res) => {
      const body = res.json();
      return Boolean(body.instance);
    },
    "dashboard has snapshot": (res) => {
      const body = res.json();
      return Boolean(body.snapshot);
    },
  });

  sleep(1);
}