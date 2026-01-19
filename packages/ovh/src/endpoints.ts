export const OVH_ENDPOINTS = {
  "ovh-eu": "https://eu.api.ovh.com/1.0",
  "ovh-ca": "https://ca.api.ovh.com/1.0",
  "ovh-us": "https://api.us.ovhcloud.com/1.0",
  "kimsufi-eu": "https://eu.api.kimsufi.com/1.0",
  "kimsufi-ca": "https://ca.api.kimsufi.com/1.0",
  "soyoustart-eu": "https://eu.api.soyoustart.com/1.0",
  "soyoustart-ca": "https://ca.api.soyoustart.com/1.0",
} as const;

export type OVHEndpoint = keyof typeof OVH_ENDPOINTS;

export const DEFAULT_ENDPOINT: OVHEndpoint = "ovh-eu";
