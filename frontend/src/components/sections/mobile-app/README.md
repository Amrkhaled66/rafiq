# Rafiq app download hero

Route: `/mobile-app`.

- `DownloadHero`: responsive section and layout.
- `AppDownloadCopy`: Arabic badge, headline, and supporting copy.
- `StoreDownloadLinks`: official store artwork, links, and availability.
- `AppPhoneVisual`: the supplied, unmodified phone composition and accents.
- Styling uses Tailwind utilities within each component, including responsive
  breakpoints, focus states, and reduced-motion-aware entrance transitions.

The shared Navbar uses its `download` variant here. The shared Footer omits this
route so the page contains only the requested hero.

## Store links

Set these in the frontend environment when the Rafiq listings are published:

```dotenv
NEXT_PUBLIC_RAFIQ_APP_STORE_URL=https://apps.apple.com/...
NEXT_PUBLIC_RAFIQ_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=...
```

Restart the dev server or rebuild production after changing them. Missing links
render disabled badges with an accessible coming-soon label. The availability
note updates for Android, iOS, or both; the requested “متاح الآن على أندرويد و iOS”
appears when both URLs are set. Never use guessed store IDs.

## Artwork sources

- Phones and accents: `src/assets/app.webp`, `app-float1.webp`, `app-float2.webp`.
  The phone asset already includes the device frames, real screens, and shadows.
- App Store: https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83
- Google Play: https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png
- Phone icon: Solar via https://api.iconify.design/solar/smartphone-linear.svg

Downloaded badges are stored locally under `public/store-badges` so the hero
does not depend on an external image service at runtime. Google Play artwork
retains the transparent space included in the original image.
