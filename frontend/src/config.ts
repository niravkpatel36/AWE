function requireEnv(name: string): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`${name} is not defined`);
  }
  return value;
}
export const API_BASE_URL = requireEnv("VITE_API_BASE_URL");

export const WS_BASE_URL = API_BASE_URL.startsWith("https")
  ? API_BASE_URL.replace("https", "wss")
  : API_BASE_URL.replace("http", "ws");
