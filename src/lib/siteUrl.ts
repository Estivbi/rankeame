const publicSiteUrl = import.meta.env.PUBLIC_SITE_URL as string | undefined;

export function resolvePublicOrigin(fallbackOrigin: string) {
  if (!publicSiteUrl) {
    return fallbackOrigin;
  }

  try {
    return new URL(publicSiteUrl).origin;
  } catch {
    return fallbackOrigin;
  }
}
