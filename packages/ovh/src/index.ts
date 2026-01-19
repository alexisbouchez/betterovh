export { OVHClient, OVHApiError } from "./client";
export { OVH_ENDPOINTS, DEFAULT_ENDPOINT, type OVHEndpoint } from "./endpoints";
export type {
  OVHClientConfig,
  OVHCredentialRequest,
  OVHCredentialResponse,
  OVHAccessRule,
  OVHError,
  HTTPMethod,
} from "./types";

// Convenience function to create a client from environment variables
export function createOVHClientFromEnv(): import("./client").OVHClient {
  const appKey = process.env.OVH_APP_KEY;
  const appSecret = process.env.OVH_APP_SECRET;
  const consumerKey = process.env.OVH_CONSUMER_KEY;
  const endpoint = process.env.OVH_ENDPOINT;

  if (!appKey || !appSecret) {
    throw new Error(
      "Missing required environment variables: OVH_APP_KEY and OVH_APP_SECRET"
    );
  }

  const { OVHClient } = require("./client");
  return new OVHClient({
    appKey,
    appSecret,
    consumerKey,
    endpoint,
  });
}

// Common access rules for full API access
export const FULL_ACCESS_RULES: import("./types").OVHAccessRule[] = [
  { method: "GET", path: "/*" },
  { method: "POST", path: "/*" },
  { method: "PUT", path: "/*" },
  { method: "DELETE", path: "/*" },
];

// Read-only access rules
export const READ_ONLY_RULES: import("./types").OVHAccessRule[] = [
  { method: "GET", path: "/*" },
];
