Create the third section of an Arabic landing page in a clean modern style, matching the uploaded reference image.

Review `globals.css` and `src/components/sections/home/ProblemSection` to understand the current visual style, spacing, typography, colors, cards, shadows, rounded corners, RTL layout, and responsive behavior.

Create a new section component called:

`SolveSection`

Place it at:

`src/components/sections/home/SolveSection.tsx`

Inside it, create two internal components:

1. `SolveHeader`
2. `SolveVisuals`

You may also create a reusable `SolveCard` component if helpful.

---

## Header

Use the existing `InfoBadge` component in `SolveHeader`.

Badge text:

`ازاي رفيق بيحل المشكلة؟`

Use a suitable Iconify icon inside the badge, such as a sparkle, magic wand, route, or solution-related icon.

The section title should be:

`من أول جلسة... لحد تنفيذ الخطة يوم بيوم`

Highlight only this phrase in the main brand color:

`تنفيذ الخطة`

The subtitle should be:

`رفيق مش مجرد أبلكيشن. احنا بنبدا بفهم وضعك الحالي وبعدها بنجهز لك خطة مناسبة ومعاك كوتش يتابعك وتقدر تتابع كل ده من علي الابلكيشن بسهولة`

Header style:

- Center aligned.
- RTL direction.
- Compact vertical spacing.
- Badge at the top.
- Large bold heading below it.
- Subtitle below the heading with muted gray text.
- Similar typography and rhythm to `ProblemSection`.
- The header should not take too much vertical height.

---

## Visual Cards Layout

Create another component called `SolveVisuals`.

It should contain five step cards.

The visual layout should closely match the reference:

Desktop layout:

- Top row: 3 equal cards.
- Bottom row: 2 wider cards centered below.
- The top row cards should each be around one-third width.
- The bottom cards should each be wider than the top cards.
- The whole visual block should have comfortable spacing but remain compact.

Tablet layout:

- 2 columns.
- Cards stack naturally.

Mobile layout:

- 1 column.
- Hide the dotted arrows.
- Keep the cards compact and readable.

---

## Card Design Description

Each card should look like a soft modern dashboard card.

Base card style:

- White background.
- Very subtle warm off-white gradient if suitable.
- Large rounded corners, around `rounded-[28px]` or similar.
- Soft shadow, not harsh.
- Thin border using a very light red/pink or neutral border.
- Internal padding around `p-6` or `p-7`.
- Minimum height should be consistent across top cards.
- Use `relative overflow-hidden`.
- Card content should be RTL.
- Text should be on one side and image on the other side.
- Cards should feel airy, soft, and premium.

Card internal structure:

- A small rounded step number pill in the top corner.
- Title below or near the number.
- Subtitle under the title.
- Image positioned opposite the text.
- A soft pastel circular glow/blob behind the image.
- Image should look floating, with no hard background.
- Use `object-contain`.

Step number style:

- Circular or rounded-square pill.
- Size around `48px`.
- Bold number text.
- Very light pastel background matching the card accent color.
- Example:
  - Card 1: red number on pale red background.
  - Card 2: purple number on pale purple background.
  - Card 3: orange number on pale orange background.
  - Card 4: red number on pale red background.
  - Card 5: green number on pale green background.

Title style:

- Bold Arabic text.
- Size around `text-xl` or `text-2xl` depending on card size.
- Use accent color per card.
- Good line height.

Subtitle style:

- Muted gray color.
- Medium font weight.
- Comfortable line height.
- Smaller than title.
- Keep text width limited so it does not stretch too much.

Image style:

- Use the images from the assets folder.
- Images should be clean, large, and visually balanced.
- Place a soft pastel circle behind each image.
- Circle should be absolutely positioned and partially behind the image.
- Image should sit above the circle using `z-index`.

---

## Individual Cards

Card 1:

Image:

`session-icon.png`

Step number:

`01`

Title:

`جلسة بداية`

Subtitle:

`بنبدأ بجلسة نفهم فيها أهدافك، وقتك، وتحدياتك في المذاكرة.`

Accent:

Red.

Card design details:

- Text on the left.
- Image on the right (assets/session-icon.png).
- Step number near the top-right.
- Use a pale red circle behind the session image.
- The session image should be medium size, not too large.


---

Card 2:

Image:

`target-icon.png`

Step number:

`02`

Title:

`نعرف إنت واقف فين`

Subtitle:

`بنحدد وضعك الحالي، مستواك، وإيه أكتر حاجات محتاجة تنظيم وتركيز.`

Accent:

Purple.

Card design details:

- Text on the left.
- Image on the right (assets/target-icon2.png).
- Step number near the top-right.
- Use a pale purple circle behind the target image.
- The target icon should be slightly larger because it is visually important.

---

Card 3:

Image:

`calendar-icon.png`

Step number:

`03`

Title:

`نجهز الخطة`

Subtitle:

`بنجهز لك خطة واضحة مناسبة لوقتك، مستواك، وهدفك.`

Accent:

Orange.

Card design details:

- Text on the left.
- Image on the right (assets/calender-icon2.png).
- Step number near the top-right.
- Use a pale orange circle behind the calendar image.
- Calendar image should sit slightly higher, like the reference.

---

Card 4:

Image:

`coach-avatar.png`

Step number:

`04`

Title:

`كوتش يتابع معاك`

Subtitle:

`في كوتش بيتابع تنفيذ الخطة معاك، يساعدك تكمل، ويظبط الطريق لو محتاج.`

Accent:

Red.

Card design details:

- This card should be wider than the top cards.
- It should be visually emphasized.
- Add a slightly stronger soft red border.
- Add a very subtle red glow or shadow.
- Layout should be horizontal:
  - Text on the right.
  - Avatar image on the left.
- Place the avatar inside or over a soft pale red circular background.
- Add a tiny decorative sparkle icon near one corner, similar to the reference.
- Optional: add a small coach name badge under/near the avatar, but keep it simple and do not overcrowd the card.
- The card should feel like the main human-support step.

---

Card 5:

Image:

`app-screen.png`

Step number:

`05`

Title:

`الأبلكيشن يسهل التنفيذ`

Subtitle:

`من الأبلكيشن تتابع الخطة، مهامك، مواعيدك، ونسبة تقدمك في مكان واحد.`

Accent:

Green.

Card design details:

- This card should be wider than the top cards.
- Layout should be horizontal:
  - Text on the right.
  - Phone/app image on the left (leave the image now i will add it soon).
- Use a pale green circular background behind the phone.
- Phone should be taller than the other icons and slightly tilted if the image already supports that.
- Keep the phone inside the card and avoid overflow on mobile.
- Use green title text and green step number.

---

## Dotted Arrows

Add small dotted arrow connectors between cards on desktop only.

Arrow style:

- Thin dotted red line.
- Small arrow head at the end.
- Low opacity.
- Positioned between card 1 → card 2 → card 3.
- Another connector from card 4 → card 5.
- Hide arrows on tablet and mobile.
- Do not let arrows affect layout flow; use absolute positioning.

---

## Section Spacing

The whole section should be compact.

Use something like:

- Top/bottom padding: moderate, not huge.
- Header margin-bottom: around `40px` to `56px`.
- Cards gap: around `24px` to `32px`.

Avoid making the section too tall on desktop.

---

## Technical Requirements

- Use Tailwind CSS.
- Use clean, readable class names.
- Use `@apply` in CSS only if the project already uses it.
- Keep everything inside `SolveSection.tsx` unless the project structure clearly prefers separate files.
- Do not modify existing components unless necessary.
- Import images correctly from the assets folder based on the existing project pattern.
- Use the existing brand colors from `globals.css` or Tailwind config.
- Use `InfoBadge` exactly as it is used in existing sections.
- Use Iconify the same way it is used elsewhere in the project.
- Export `SolveSection` as default.

---

## Final Component Structure

The file should include:

- `SolveSection`
- `SolveHeader`
- `SolveVisuals`
- `SolveCard`

Expected structure:

```tsx
export default function SolveSection() {
  return (
    <section>
      <SolveHeader />
      <SolveVisuals />
    </section>
  );
}