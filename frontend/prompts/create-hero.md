We are building the **Home Page Hero Section** for our landing page.

We want this section to look **clean, modern, premium, friendly, and well-balanced**, based on the provided design.

## General Requirements
- Build this as a reusable component called `HeroSection`
- Keep the code clean and reusable
- Use our existing **color palette**
- Use our global font
- The page direction is **RTL**
- Use responsive design
- Use clean spacing, smooth shadows, and soft rounded shapes
- Keep the UI visually polished and elegant

## Assets
- The student avatar already exists in: `assets/student.png`
- Use this image in the hero section
- Keep the avatar visible on the lower-left side of the hero area

## Color Palette
Use our design tokens / palette:

- `--brand-primary: #D00507`
- `--brand-primary-soft: #f6dcdd`
- `--brand-primary-muted: #efa9ab`
- `--brand-primary-hover: #8f0d10`
- `--brand-primary-active: #6e090b`

Use these colors consistently and do not introduce random new colors.

---

# Hero Section Structure

The hero section should contain:

1. A small top badge
2. A large main headline
3. A supporting paragraph
4. Two CTA buttons
5. A student avatar illustration on the lower-left
6. Floating cards/elements around the hero content
7. Small decorative accents

The hero content should be centered visually, while the floating elements create a dynamic landing page feel.

---

# Main Layout

## Section behavior
- The hero section should be a large first-screen section
- It should sit below the navbar
- Use a `relative` parent container because several floating elements will be positioned absolutely
- The main content should be centered horizontally
- The text block should be the visual focus
- The avatar and floating cards should decorate the section without breaking readability

## Suggested layout approach
- Use a `relative` wrapper for the whole hero section
- Put the main text content in the center
- Position the floating elements using absolute positioning
- Keep generous whitespace
- The design should feel airy, not crowded

---

# Hero Content Details

## 1) Top Badge
Create a rounded pill badge above the headline.

### Badge content
- Icon on the right or left depending on RTL alignment
- Text: `منصة ذكية لطلاب الثانوية`

### Badge style
- Rounded full pill
- Soft light background using `--brand-primary-soft`
- Thin subtle border
- Text color should be `--brand-primary`
- Small shadow
- Compact and elegant

### Badge position
- Place it above the main headline
- Centered horizontally
- It should sit near the upper-middle area of the hero section

Suggested absolute/visual position:
- Top center area
- Around `top: 70px to 100px`

---

## 2) Main Headline
Create a strong Arabic headline with large typography.

### Headline text
Line 1:
`رفيقك من`

Line 2:
`التشتت`

Line 3:
`إلى تنظيم مذاكرتك`

### Typography styling
- Very large bold headline
- Strong visual hierarchy
- Mostly black text
- Highlight important words in brand red

### Special text styling
- The word `التشتت` should be styled differently to stand out
- It should look like outlined or stroked text with red outline and white/transparent fill
- The word `تنظيم` should be highlighted in solid `--brand-primary`
- The rest of the text can be dark/black

### Alignment
- Center aligned
- Balanced line spacing
- Elegant Arabic typography

---

## 3) Supporting Paragraph
Add a short supporting paragraph below the headline.

### Paragraph text
`خطط يومك، تابع مهامك، وخلي الكوتش يساعدك توصل لهدفك خطوة بخطوة`

### Paragraph style
- Medium text size
- Softer gray tone
- Good readability
- Center aligned
- Max width should be controlled so the paragraph does not become too wide

---

## 4) CTA Buttons
Below the paragraph, create two action buttons.

### Primary button
Text:
`ابدأ الآن`

Style:
- Filled with `--brand-primary`
- White text
- Rounded pill/button
- Subtle shadow
- Include a circular icon area with an arrow
- Hover state should use `--brand-primary-hover`
- Active state should use `--brand-primary-active`

### Secondary button
Text:
`اكتشف المميزات`

Style:
- Transparent or white background
- Border in `--brand-primary`
- Text in `--brand-primary`
- Rounded button
- Minimal and elegant

### Buttons layout
- Place the buttons side by side
- In RTL order, the primary CTA should be more visually important
- Keep comfortable spacing between them
- Center them below the paragraph

---

# Floating Elements

We want floating UI cards around the main hero content to make the section look dynamic and informative.

These elements should feel soft, subtle, and slightly playful.

---

## 5) Left Floating Card — Daily Tasks
Create a small floating card on the upper-left side.

### Card title
`مهام اليوم`

### Task items
1. `حل تمارين الرياضيات`
2. `مراجعة الكيمياء`
3. `قراءة التاريخ`

### UI behavior
- First task should look completed / selected
- The other tasks should look unselected

### Style
- Small white card
- Rounded corners
- Very soft border
- Light shadow
- Slightly rotated if needed for a playful floating effect
- Light soft red tint in the border or background shadow

### Icons / indicators
- Use circular check/radio indicators
- First task: selected in brand red
- Others: empty circles in light gray

### Position
Suggested position:
- Top-left side of the hero section
- Around `left: 70px to 110px`
- Around `top: 140px to 190px`

### Visual role
- This card should sit above the avatar area
- It should not overlap the main headline

---

## 6) Right Floating Card — Weekly Plan
Create another floating card on the upper-right side.

### Card title
`الخطة الأسبوعية`

### Content inside
- A simple weekly header row with Arabic day abbreviations
- Highlight one selected day using a soft red circular background
- Below that, show 4 subject chips/tags such as:
  - `الرياضيات`
  - `الفيزياء`
  - `الكيمياء`
  - `الأحياء`

### Subject chip style
- Rounded mini pills
- Use soft tinted backgrounds from the palette
- Some chips can use soft pink / pale lavender / very light tinted variations while staying in the overall palette feel

### Style
- White card
- Rounded corners
- Soft border
- Light shadow
- Slight tilt/rotation can be added
- Elegant and lightweight

### Position
Suggested position:
- Top-right side of the hero section
- Around `right: 60px to 100px`
- Around `top: 180px to 240px`

### Visual role
- This card should balance the tasks card on the left
- It should not visually overpower the main content

---

## 7) Student Avatar
Use the student image from:

`assets/student.png`

### Placement
- Place it in the lower-left side of the hero section
- The character should appear standing and holding the tablet
- The bottom of the avatar can slightly touch or overlap the bottom visual area of the section

### Position
Suggested position:
- `left: 30px to 70px`
- `bottom: 0`

### Visual size
- Large enough to be noticeable
- But should not dominate the text content
- It should support the layout, not compete with the headline

### Styling
- Keep the image clean
- No harsh extra effects
- Optional soft red glow / gradient behind the avatar to help it blend into the section

---

# Decorative Floating Accents

Add subtle decorative elements to make the hero section feel premium and alive.

## 8) Decorative chevrons
Add two subtle chevron-like marks around the center area:
- One to the left of the main headline stack
- One to the right of the main headline stack

Style:
- Soft red / pale red
- Minimal
- Light visual presence

Suggested approximate position:
- Vertical center around the headline
- One on each side

## 9) Small star/sparkle
Add a small sparkle/star shape near the upper-right side of the central content.

Style:
- Soft pink/red
- Minimal
- Decorative only

Suggested position:
- Between the center content and the right floating card

## 10) Small dots
Add 1–2 small circular accent dots in soft pink/red tones.

Suggested positions:
- One on the lower-left area
- One on the lower-right area

These should remain subtle and not distract from the content.

---

# Background Styling

- Use a very light clean background
- Prefer white or near-white
- Add a subtle soft radial red/pink glow near the lower-left area behind the avatar
- The effect should be very soft and elegant
- Avoid heavy gradients

---

# Responsive Behavior

## Desktop
- Keep the floating layout similar to the design
- Main content centered
- Avatar on lower-left
- Cards floating left and right

## Tablet
- Reduce the size of floating cards
- Reduce headline size slightly
- Keep everything balanced

## Mobile
- Stack the layout vertically
- Main content comes first
- Buttons can stack or wrap
- Floating cards should become inline blocks or reposition safely
- The avatar should move below the text or be centered
- Avoid overlapping content on small screens
- Decorative accents can be reduced or hidden if needed

---

# Component Suggestions

You may split the hero into small reusable components if needed, for example:
- `HeroSection`
- `HeroBadge`
- `HeroButtons`
- `TasksCard`
- `WeeklyPlanCard`
- `StudentIllustration`

---

# Important Implementation Notes
- Use RTL-friendly spacing and alignment
- Keep the section visually balanced
- Do not overdo shadows
- Use smooth rounded corners
- Respect the exact Arabic text
- Keep the section modern and polished
- Use the student avatar from the provided asset
- Use our color palette only

---

# Output
Please provide:

1. The full `HeroSection` component code
2. Any helper components if needed
3. Styling/classes used
4. A short explanation of how the floating elements are positioned
5. Any UI/UX suggestions for improving the section while keeping the same style