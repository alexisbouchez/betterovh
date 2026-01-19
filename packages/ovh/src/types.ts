import type { OVHEndpoint } from "./endpoints";

export interface OVHClientConfig {
  endpoint?: OVHEndpoint | string;
  appKey: string;
  appSecret: string;
  consumerKey?: string;
}

export interface OVHCredentialRequest {
  accessRules: OVHAccessRule[];
  redirection?: string;
}

export interface OVHAccessRule {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
}

export interface OVHCredentialResponse {
  validationUrl: string;
  consumerKey: string;
  state: string;
}

export interface OVHError {
  errorCode: string;
  httpCode: string;
  message: string;
}

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
