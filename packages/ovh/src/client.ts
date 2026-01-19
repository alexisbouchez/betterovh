import { OVH_ENDPOINTS, DEFAULT_ENDPOINT, type OVHEndpoint } from "./endpoints";
import type {
  OVHClientConfig,
  OVHCredentialRequest,
  OVHCredentialResponse,
  OVHError,
  HTTPMethod,
} from "./types";

export class OVHClient {
  private readonly baseUrl: string;
  private readonly appKey: string;
  private readonly appSecret: string;
  private consumerKey: string | undefined;
  private timeDelta: number = 0;

  constructor(config: OVHClientConfig) {
    this.appKey = config.appKey;
    this.appSecret = config.appSecret;
    this.consumerKey = config.consumerKey;

    if (config.endpoint && config.endpoint.startsWith("http")) {
      this.baseUrl = config.endpoint;
    } else {
      const endpoint = (config.endpoint || DEFAULT_ENDPOINT) as OVHEndpoint;
      this.baseUrl = OVH_ENDPOINTS[endpoint];
    }
  }

  /**
   * Synchronize time with OVH servers to handle clock differences
   */
  async syncTime(): Promise<void> {
    const serverTime = await this.getServerTime();
    const localTime = Math.floor(Date.now() / 1000);
    this.timeDelta = localTime - serverTime;
  }

  /**
   * Get OVH server time
   */
  private async getServerTime(): Promise<number> {
    const response = await fetch(`${this.baseUrl}/auth/time`);
    if (!response.ok) {
      throw new Error(`Failed to get server time: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Compute signature for OVH API request
   * Format: $1$<sha1(appSecret+consumerKey+method+url+body+timestamp)>
   */
  private async computeSignature(
    method: HTTPMethod,
    url: string,
    body: string,
    timestamp: number
  ): Promise<string> {
    const toSign = `${this.appSecret}+${this.consumerKey}+${method}+${url}+${body}+${timestamp}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(toSign);

    // Use Web Crypto API for SHA-1 (works in Bun, Node, and browsers)
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return `$1$${hashHex}`;
  }

  /**
   * Make an authenticated request to the OVH API
   */
  private async request<T>(
    method: HTTPMethod,
    path: string,
    data?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const body = data ? JSON.stringify(data) : "";
    const timestamp = Math.floor(Date.now() / 1000) - this.timeDelta;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Ovh-Application": this.appKey,
      "X-Ovh-Timestamp": timestamp.toString(),
    };

    if (this.consumerKey) {
      headers["X-Ovh-Consumer"] = this.consumerKey;
      headers["X-Ovh-Signature"] = await this.computeSignature(
        method,
        url,
        body,
        timestamp
      );
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body || undefined,
    });

    if (!response.ok) {
      const error: OVHError = await response.json();
      throw new OVHApiError(error, response.status);
    }

    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    return JSON.parse(text);
  }

  /**
   * Request credentials (consumer key) from OVH
   * Returns a validation URL that the user must visit to authorize the app
   */
  async requestCredentials(
    request: OVHCredentialRequest
  ): Promise<OVHCredentialResponse> {
    const url = `${this.baseUrl}/auth/credential`;
    const body = JSON.stringify(request);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Ovh-Application": this.appKey,
      },
      body,
    });

    if (!response.ok) {
      const error: OVHError = await response.json();
      throw new OVHApiError(error, response.status);
    }

    const result: OVHCredentialResponse = await response.json();
    this.consumerKey = result.consumerKey;
    return result;
  }

  /**
   * Set the consumer key after user validation
   */
  setConsumerKey(consumerKey: string): void {
    this.consumerKey = consumerKey;
  }

  /**
   * Check if the client has a consumer key configured
   */
  hasConsumerKey(): boolean {
    return !!this.consumerKey;
  }

  // HTTP method shortcuts
  async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>("POST", path, data);
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>("PUT", path, data);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}

export class OVHApiError extends Error {
  readonly errorCode: string;
  readonly httpCode: number;

  constructor(error: OVHError, httpCode: number) {
    super(error.message);
    this.name = "OVHApiError";
    this.errorCode = error.errorCode;
    this.httpCode = httpCode;
  }
}
