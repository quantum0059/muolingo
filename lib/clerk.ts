import { type Href, type Router } from "expo-router";

export const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export function finalizeAuthNavigation(
  router: Router,
  decorateUrl: (url: string) => string,
  homePath = "/",
) {
  const url = decorateUrl(homePath);

  if (url.startsWith("http")) {
    return;
  }

  router.replace(url as Href);
}
