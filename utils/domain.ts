import process from "process";
import { isProduction } from "./environment";
/**
 * Returns the API base URL based on the current environment.
 * In production it retrieves the URL from NEXT_PUBLIC_PROD_API_URL (or falls back to a hardcoded url).
 * In development, it returns "http://localhost:8080".
 */
export function getApiDomain(): string {
  const prodUrl = process.env.NEXT_PUBLIC_PROD_API_URL ||
    "https://grounded-jetty-490810-t0.oa.r.appspot.com/"; // TODO: update with your production URL as needed.
  const devUrl = "http://localhost:8080";
  return isProduction() ? prodUrl : devUrl;
}

/**
 * Returns the websocket base URL derived from the API base URL.
 */
export function getWebSocketDomain(): string {
  const apiUrl = new URL(getApiDomain());
  apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
  return apiUrl.toString();
}
