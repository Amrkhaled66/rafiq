# Mobile app download hero QA

final result: passed

## Scope and visual source

- Route: http://localhost:3000/mobile-app
- Source visual truth: `src/assets/app.webp` (1122 × 1402 px),
  `src/assets/app-float1.webp` and `src/assets/app-float2.webp` (1280 × 1280 px).
- Layout truth: the user's Arabic RTL hero brief and the existing Rafiq Navbar,
  typography, and brand tokens. A separate full-page reference image was not
  available; this report does not claim a pixel-identical full-page recreation.
- Original app artwork is used intact, including phone frames, screens,
  perspective, and grounding shadows. No screen content was recreated.
- Implementation captures: `.qa-artifacts/1440x900.png`, `1440x810.png`,
  `1024x768.png`, `768x1024.png`, `390x844.png`, and `320x740.png`.
- Browser: temporary headless Edge through Playwright, explicitly approved by
  the user after the in-app browser was unavailable.
- Device scale factor: 1. Desktop screenshot pixels equal CSS viewport dimensions.
  Mobile full-page captures are 390 × 978 and 320 × 911 CSS/pixel dimensions,
  from 390 × 844 and 320 × 740 viewports. They include the complete single hero.
- State: initial hero, reduced motion, missing store URLs shown as coming soon.
  External analytics were blocked during testing to avoid synthetic tracking.

## Fidelity review

- **Typography:** browser confirms IBM Plex Sans Arabic, inherited from the
  website. Bold two-line headline, black/red hierarchy, controlled paragraph
  width, legible Arabic text, and no headline wrapping within either line.
- **Layout:** floating 80px pill Navbar, 1224px desktop container, copy on the
  right and dominant phone composition on the left. The entire desktop hero
  fits both 1440 × 900 and 1440 × 810 viewports. Mobile uses centered RTL copy
  above the product visual. No extra section or footer appears on this route.
- **Colors:** inherited Rafiq primary red, near-black headline, cool-gray copy,
  pale #fbeaea backdrop, no gradient or extra device shadow. Four restrained
  decorative accents on desktop; only the supplied accent strokes on mobile.
- **Images:** original transparent WebP assets were opened alongside the
  implementation captures for comparison. Both original app screens, black
  device frames, overlap, and shadows are preserved. No stretch or crop of the
  source phones. Store badges are downloaded authentic artwork, hosted locally.
- **Copy:** requested Arabic headline, badge, and paragraph are preserved.
  Availability intentionally reflects configured store URLs; it does not claim
  live downloads when no destination was provided.

## Comparison and fixes

1. Full-view review at 1440 × 900 and 768 × 1024 confirmed the desktop hierarchy,
   spacing, and continuity with the supplied artwork and existing site.
2. Focused source/implementation comparison checked the phone composition and
   store badges; the supplied raster screens remain unchanged and clear at
   their intended marketing display scale.
3. Mobile review identified accent strokes touching the foreground phone frame.
   Reduced their width from 95px to 85px and moved them upward/outward.
   Final `.qa-artifacts/390x844.png` confirms clearance above the phone.
4. Repeated all six viewport checks after the adjustment. No actionable visual
   layout findings remain in the implemented coming-soon state.

## Verification

### Tailwind follow-up

Converted all hero styles to Tailwind utilities and removed the CSS module.
Preserved the component split and the user's concurrent disabled-badge opacity
change. The first comparison exposed mixed-unit breakpoint ordering; using rem
for the custom desktop breakpoint fixed the typography, spacing, and badge sizes.
Compared `.qa-artifacts/before-tailwind-desktop.png` and
`.qa-artifacts/before-tailwind-mobile.png` against the updated captures. The
layout is preserved. Repeated all six viewport and navigation checks, TypeScript,
and scoped lint successfully; no runtime or console errors. The entrance now
uses Tailwind starting-style transitions with reduced-motion support.

- `npm run build`: passed; `/mobile-app` is statically prerendered.
- TypeScript and scoped ESLint checks: passed.
- All six viewport widths: no horizontal overflow, no broken images, RTL root,
  correct headline, and no footer on the download route.
- Mobile menu opens and closes; navigation links are visible.
- Navbar signup CTA opens the existing signup modal; close action works.
- Pricing link navigates to `/#pricing`; the home page retains its footer.
- Runtime exceptions and browser console errors: none in the final run.
- Motion honors `prefers-reduced-motion`; explicit focus styles are provided
  for store links, logo, navigation links, and navbar CTA.
- Browser assertions and detailed results: `.qa-artifacts/check.cjs` and
  `.qa-artifacts/results.json` (local, ignored verification artifacts).

## Launch configuration and limits

The user has not supplied published App Store/Google Play URLs. Store badges
are disabled and announced as coming soon. Set the two variables documented in
`src/components/sections/mobile-app/README.md` and rebuild to activate them.
Actual store download/install behavior cannot be verified until those URLs
are supplied. This QA pass covers the implemented page and its truthful
unavailable state, not a completed store release.

No deployment, store publication, signup submission, or database operation was
performed. Existing signup-modal internals were reused without redesign.
