Create the footer section of an Arabic landing page in a clean, modern style that matches the uploaded reference image.

Before implementing, review the existing project files:
- `globals.css`
- Existing shared components, especially buttons, badges, containers, typography, and icon usage
- Any existing section components to follow the same spacing and responsive behavior

Create a new component named:

`Footer`

Place it at:

`src/components/layout/Footer.tsx`

The footer should be RTL and visually similar to the reference image, but simpler.

## Important Content Requirement

Do NOT include:
- Pages column
- Services column

Only include:
1. Brand / logo section
2. Contact us section
3. Bottom copyright / policies row

## Layout

Use a large rounded footer container with a white or very soft off-white background.

The footer should include:

### Brand Section

Place this on the right side on desktop.

Use the Rafiq logo/brand styling already used in the project.

Content:

Logo:
`رفيق`
`Rafiq`

Description:
`رفيق يساعدك تنظم يومك، تلتزم بخطتك، وتحقق أهدافك خطوة بخطوة.`

CTA button:
`احجز جلسة البداية`

Button details:
- Outlined pill-shaped button
- Red border
- Red text
- White background
- Calendar icon on the right side because the layout is RTL
- Use Iconify icon: `solar:calendar-linear`
- Button should have a subtle hover effect

### Contact Us Section

Place this on the left side on desktop.

Heading:
`تواصل معنا`

Add a small red underline below the heading, like the reference.

Contact items:
- WhatsApp with icon: `واتساب`
- Email with icon: `hello@rafiq.study`
- Location with icon: `القاهرة، مصر`

Use Iconify icons:
- WhatsApp: `ic:baseline-whatsapp`
- Email: `solar:letter-linear`
- Location: `solar:map-point-linear`

Social icons below the contact items:
- Instagram: `mdi:instagram`
- WhatsApp: `ic:baseline-whatsapp`
- YouTube: `mdi:youtube`

Social icons should be gray by default and turn red on hover.

## Bottom Row

Add a horizontal divider line.

Bottom row content:
- On the right side:
  `© 2026 رفيق. كل الحقوق محفوظة.`
- On the left side:
  `سياسة الخصوصية`
  `|`
  `الشروط والأحكام`

The bottom row should stack nicely on mobile.

## Visual Style

Match the reference image:
- Soft white/off-white background
- Rounded top corners or a large rounded footer card
- Generous spacing
- Clean typography
- Muted gray text
- Brand red for logo, icons, underline, and CTA button
- Light subtle shadow or border if used in the project style
- Keep the design minimal and polished

## Responsive Behavior

Desktop:
- Brand section on the right
- Contact section on the left
- Bottom row split between copyright and policies

Mobile:
- Stack all content vertically
- Keep text centered or neatly aligned for RTL
- Contact section should remain readable
- CTA button should be full width or comfortably sized
- Social icons centered or aligned consistently
- Bottom row stacks with good spacing

## Suggested Structure

```tsx
<footer dir="rtl">
  <div>{/* footer container */}</div>

  <div>{/* main footer content */}</div>

  <div>{/* brand section */}</div>

  <div>{/* contact us section */}</div>

  <div>{/* divider */}</div>

  <div>{/* copyright and policies row */}</div>
</footer>