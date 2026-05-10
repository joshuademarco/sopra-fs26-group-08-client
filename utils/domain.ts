import process from "process";
import { isProduction } from "./environment";
/**
 * Returns the API base URL based on the current environment.
 * In production it retrieves the URL from NEXT_PUBLIC_PROD_API_URL (or falls back to a hardcoded url).
 * In development, it returns "http://localhost:8080".
 */
export function getApiDomain(): string {
  const prodUrl = process.env.NEXT_PUBLIC_PROD_API_URL ||
    "https://api.bettertogeter.ch";
  const devUrl = "http://localhost:8080";
  return isProduction() ? prodUrl : devUrl;
}

export function buildApiUrl(endpoint: string): string {
  return `${getApiDomain()}${endpoint}`;
}

/**
 * Returns the websocket base URL derived from the API base URL.
 */
export function getWebSocketDomain(): string {
  const apiUrl = new URL(getApiDomain());
  apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
  return apiUrl.toString();
}
