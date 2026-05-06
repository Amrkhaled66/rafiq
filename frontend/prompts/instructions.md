# AI Project Instructions

## Project Goal

We are building a modern landing page for our project.

The main goal is to create a beautiful, clean, professional, and user-friendly UI interface. The design should feel polished, modern, responsive, and well-structured.

You will help us build the project step by step. We will provide every minor detail for each section, component, layout, icon, text, and design requirement.

If you notice any improvement, better UI idea, better component structure, better naming, or better user experience suggestion, you should tell us before or while implementing it.

---

## General Working Rules

1. Follow our instructions carefully.
2. Do not skip small details.
3. Ask questions only when something is unclear.
4. If there is a better way to build something, suggest it clearly.
5. Keep the code clean, reusable, and easy to maintain.
6. Use modern UI and frontend best practices.
7. Make the design responsive for desktop, tablet, and mobile.
8. Keep spacing, alignment, colors, typography, and layout consistent.
9. Avoid messy or duplicated code.
10. Build everything section by section and component by component.

---

## Design Expectations

The UI should be:

- Beautiful
- Clean
- Modern
- Responsive
- Professional
- Smooth
- Easy to understand
- Visually balanced
- Pixel-friendly
- Consistent across all sections

Each section should have clear spacing, proper hierarchy, and reusable components where possible.

---

## Current Task

We are starting with the **Home Page**.

The home page will consist of multiple sections. Each section may include several components.

The AI should help us create the home page step by step based on the details we provide.

---

## Project Structure Instructions

Create a components folder to organize the home page UI.

Recommended structure:

```txt
src/
  components/
    home/
      HeroSection.tsx
      FeaturesSection.tsx
      HowItWorksSection.tsx
      TestimonialsSection.tsx
      PricingSection.tsx
      FAQSection.tsx
      CTASection.tsx
    shared/
      Button.tsx
      SectionHeader.tsx
      Container.tsx
      IconBox.tsx
```

The exact section names may change depending on the final home page design.

If a section becomes large, split it into smaller components.

Example:

```txt
src/
  components/
    home/
      hero/
        HeroSection.tsx
        HeroBadge.tsx
        HeroActions.tsx
        HeroVisual.tsx
```

---

## Component Rules

Each section should be created as a separate component.

Each component should:

- Have a clear name
- Be easy to reuse
- Have clean props if needed
- Avoid unnecessary complexity
- Keep layout and styling readable
- Use semantic HTML where possible

Example component naming:

```txt
HeroSection
FeatureCard
SectionHeader
PricingCard
FAQItem
CTASection
```

---

## Icon Rules

We will use **Iconify** for icons.

The AI must use Iconify icons only when we provide the icon names.

Do not randomly choose icons unless we ask you to suggest icons.

When we provide an icon, use it exactly as provided.

Example:

```tsx
import { Icon } from "@iconify/react";

<Icon icon="solar:star-bold" className="h-6 w-6" />
```

If an icon does not visually match the design, tell us and suggest a better alternative, but do not replace it without approval.

---

## Styling Rules

Use the styling system already used in the project.

If the project uses Tailwind CSS, follow Tailwind best practices.

Recommended Tailwind style rules:

- Use consistent spacing
- Use responsive classes
- Use clean utility class grouping
- Avoid extremely long class strings when possible
- Extract repeated UI into components
- Use `max-w`, `container`, and spacing utilities properly
- Make all sections responsive

Example:

```tsx
<section className="py-20 md:py-28">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* content */}
  </div>
</section>
```

---

## UI Improvement Rule

If we give a design instruction and you think there is a better UI or UX solution, tell us clearly.

Format suggestions like this:

```md
Suggestion:
I recommend making the hero CTA button larger because it is the main conversion action.
```

Then continue only after the suggestion or implement it if it does not conflict with our instruction.

---

## Home Page Build Process

When building the home page, follow this process:

1. Understand the section we want to build.
2. Identify the components needed for that section.
3. Create the folder structure if needed.
4. Build the section component.
5. Use the icons we provide.
6. Make it responsive.
7. Review spacing, layout, and visual hierarchy.
8. Suggest improvements if needed.

---

## Home Page Sections

The home page may include sections such as:

- Hero section
- Features section
- Benefits section
- How it works section
- Services section
- Testimonials section
- Pricing section
- FAQ section
- Final call-to-action section
- Footer

We will provide the exact sections and details one by one.

---

## Code Quality Rules

The AI should always write code that is:

- Clean
- Readable
- Reusable
- Maintainable
- Scalable
- Well-structured

Avoid:

- Duplicated code
- Unclear component names
- Huge files
- Hardcoded repeated values
- Messy styling
- Unused imports
- Random icons
- Random design changes without explaining them

---

## Response Format

When responding with code, use this structure:

```md
## What I will create

Briefly explain the component or section.

## Files

List the files that will be created or updated.

## Code

Provide the code for each file.

## Suggestions

Mention any useful UI or structure suggestions.
```

---

## Important Notes

- We will provide every small detail.
- Follow the provided design direction exactly.
- Use Iconify for icons.
- Create reusable components.
- Build the home page section by section.
- Always suggest improvements when something can be better.
- Do not make major design decisions without telling us.
