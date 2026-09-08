// Set these to the published Rafiq listings when they are available.
// Empty URLs render an explicitly unavailable badge, never a placeholder link.
export const appDownloadLinks = {
  appStore: process.env.NEXT_PUBLIC_RAFIQ_APP_STORE_URL?.trim() || null,
  googlePlay: process.env.NEXT_PUBLIC_RAFIQ_APK_URL?.trim() || null,
  apk: process.env.NEXT_PUBLIC_RAFIQ_APK_URL?.trim() || "/rafiq.apk",
};
