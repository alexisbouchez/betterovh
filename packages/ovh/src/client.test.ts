import { describe, test, expect, mock, beforeAll } from "bun:test";
import { OVHClient, OVHApiError } from "./client";

describe("OVHClient", () => {
  test("should create client with config", () => {
    const client = new OVHClient({
      appKey: "test-key",
      appSecret: "test-secret",
    });

    expect(client).toBeInstanceOf(OVHClient);
    expect(client.hasConsumerKey()).toBe(false);
  });

  test("should create client with consumer key", () => {
    const client = new OVHClient({
      appKey: "test-key",
      appSecret: "test-secret",
      consumerKey: "test-consumer",
    });

    expect(client.hasConsumerKey()).toBe(true);
  });

  test("should set consumer key", () => {
    const client = new OVHClient({
      appKey: "test-key",
      appSecret: "test-secret",
    });

    expect(client.hasConsumerKey()).toBe(false);
    client.setConsumerKey("new-consumer-key");
    expect(client.hasConsumerKey()).toBe(true);
  });

  test("should use custom endpoint URL", () => {
    const client = new OVHClient({
      appKey: "test-key",
      appSecret: "test-secret",
      endpoint: "https://custom.api.example.com/1.0",
    });

    expect(client).toBeInstanceOf(OVHClient);
  });

  test("should use predefined endpoint", () => {
    const client = new OVHClient({
      appKey: "test-key",
      appSecret: "test-secret",
      endpoint: "ovh-ca",
    });

    expect(client).toBeInstanceOf(OVHClient);
  });
});

describe("OVHApiError", () => {
  test("should create error with correct properties", () => {
    const error = new OVHApiError(
      {
        errorCode: "INVALID_CREDENTIAL",
        httpCode: "401",
        message: "Invalid credentials",
      },
      401
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("OVHApiError");
    expect(error.message).toBe("Invalid credentials");
    expect(error.errorCode).toBe("INVALID_CREDENTIAL");
    expect(error.httpCode).toBe(401);
  });
});
