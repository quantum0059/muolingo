import Constants from "expo-constants";

export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/u, "");
  if (configured) {
    return configured;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return `http://${hostUri}`;
  }

  return "";
}

export async function fetchApi(
  path: string,
  options: RequestInit & { clerkToken?: string | null } = {},
): Promise<Response> {
  const { clerkToken, headers, ...rest } = options;
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(clerkToken ? { Authorization: `Bearer ${clerkToken}` } : {}),
      ...headers,
    },
  });
}
