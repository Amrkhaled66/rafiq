Create the CTA section of an Arabic landing page in a clean, modern style that closely matches the uploaded reference image.

Before implementing, review the existing project files:

- `globals.css`
- `src/components/sections/home/ProblemSection`

Use them to understand the current design system, including spacing, typography, colors, rounded corners, shadows, RTL layout, responsive behavior, and component conventions.

Create a new component named:

`CTASection`

Place it at:

`src/components/sections/home/CTASection.tsx`

The avatar image already exists in the assets folder:

`assets/cta-avatar.png`

Use this image above the CTA card, centered horizontally. The avatar should slightly overlap the top edge of the CTA card.

The section must be RTL.

## Visual Direction

Match the uploaded reference image as closely as possible:

- Soft white / off-white page background.
- A large red CTA card centered inside a max-width container.
- Rounded card corners.
- Soft shadow under the card.
- Compact, polished spacing.
- Avatar centered above the card.
- Avatar overlaps the card by around `40px` to `60px`.
- Small decorative sparkles and dots around the avatar using Iconify icons.
- Add subtle white translucent circle decorations inside the CTA card:
  - One large circle near the top-right area.
  - One large circle near the bottom-left area.
- Keep all decorations subtle and behind the main text content.

## CTA Content

Use the exact Arabic content below:

Badge:
`جاهز تبدأ؟`

Main heading:
`جاهز تبدأ بخطة واضحة؟`

Description:
`خليك جزء من رفيق، ونفهم وضعك ونجهز لك خطة مناسبة مع كوتش يتابعك خطوة بخطوة.`

Primary button:
Create a large centered white pill-shaped CTA button with the text:

`خليك جزء من رفيق`

Inside the button, include a red calendar icon using Iconify:

`solar:calendar-linear`

Because the page is RTL, place the calendar icon on the right side of the text. The text should also be red, matching the main CTA color. Keep the button spacious, rounded, modern, and visually similar to the reference image.

Feature bullets:
`خطة واضحة`
`متابعة مع كوتش`
`متابعة من الأبليكشن`

## Suggested Structure

Use a structure similar to:

```tsx
<section>
  <div>{/* max-width container */}</div>

  <div>{/* avatar and decorative icons */}</div>

  <div>{/* red CTA card */}</div>
</section>
```
