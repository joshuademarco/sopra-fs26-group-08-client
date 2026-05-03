import process from "process";
import { isProduction } from "./environment";
/**
 * Returns the API base URL based on the current environment.
 * In production it retrieves the URL from NEXT_PUBLIC_PROD_API_URL (or falls back to a hardcoded url).
 * In development, it returns "http://localhost:8080/api".
 */
export function getApiDomain(): string {
  const prodUrl = process.env.NEXT_PUBLIC_PROD_API_URL ||
    "https://grounded-jetty-490810-t0.oa.r.appspot.com";
  const devUrl = "http://localhost:8080";
  return isProduction() ? prodUrl : devUrl;
}

/**
 * Returns the websocket base URL. In production, uses the same origin as the
 * page so WebSocket connections go through the Vercel proxy (which forwards
 * the auth cookie). In development, connects directly to the local backend.
 */
export function getWebSocketDomain(): string {
  if (isProduction() && typeof window !== "undefined") {
    return window.location.origin.replace(/^https/, "wss").replace(/^http/, "ws");
  }
  return "ws://localhost:8080";
}
