export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? window.location.origin;

export const WS_BASE_URL = API_BASE_URL.startsWith("https")
  ? API_BASE_URL.replace("https://", "wss://")
  : API_BASE_URL.replace("http://", "ws://");
