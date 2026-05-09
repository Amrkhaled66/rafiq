Create the CTA section of an Arabic landing page in a clean modern style, matching the uploaded reference image.

Review `globals.css` and `src/components/sections/home/ProblemSection` to understand the existing design system, spacing, typography, colors, rounded corners, shadows, RTL layout, and responsive behavior.

Create a new component called:

`CTASection`

Place it at:

`src/components/sections/home/CTASection.tsx`

The avatar image is already inside the assets folder:

`assets/cta-avatar.png`

Use this image above the CTA card, centered horizontally, with the avatar slightly overlapping the top edge of the red card.

---

## Section Layout

The section should be RTL.

Use a white or very soft off-white page background.

The main layout:

- A large red CTA card centered inside a max-width container.
- The avatar should sit above the card, centered.
- The avatar should overlap the card by around `40px` to `60px`.
- Add a few small decorative sparkles/dots around the avatar, similar to the reference.
- Keep the whole section compact and polished.

Suggested structure:

```tsx
<section>
  <div>
    <div>{/* avatar and decorations */}</div>
    <div>{/* red CTA card */}</div>
  </div>
</section>