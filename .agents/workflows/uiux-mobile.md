---
description: 
---

# Responsive Mobile UI Adjustment Rule

## Purpose

Make the application fully responsive across all viewport sizes while preserving the existing design system, visual identity, content, colors, and desktop behavior.

## 1. Core Principle

**Desktop is the source of truth.**

Adapt the existing design for smaller screens; do not redesign it.

Preserve:

* Colors and color palette
* Content and wording
* Brand identity
* Existing visual style
* Desktop layout and behavior
* Component purpose and hierarchy

Make the **smallest necessary change** to solve each responsive issue.

## 2. Allowed Responsive Changes

On smaller screens, you may adjust:

* Font size and line height
* Spacing, padding, margins, and gaps
* Grid columns
* Flex direction
* Button dimensions
* Navbar layout
* Image/card dimensions
* Section heights
* Text wrapping
* Alignment and stacking
* Container widths
* Secondary-element visibility
* Sidebar behavior
* Touch target sizes

Never change colors or content.

## 3. Responsive System

Do not create device-specific layouts or hacks.

Use one fluid responsive system:

```text
<360px      Very small mobile
360–639px   Mobile
640–767px   Large mobile / small tablet
768–1023px  Tablet
1024px+     Desktop
```

Do not force every component to change at every breakpoint. Add a breakpoint only when the layout requires behavioral change.

Prefer fluid CSS such as:
`clamp()`, `%`, `min()`, `max()`, `minmax()`, flexible Grid/Flex layouts.

## 4. Typography

Maintain one consistent hierarchy:

```text
Page Title
↓
Section Title
↓
Card Title
↓
Body
↓
Secondary Text
↓
Caption
```

Mobile may scale typography down, but hierarchy must remain consistent.

Do not invent random font sizes for individual components.

## 5. Spacing

Use a consistent spacing system:

```text
8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80
```

Reuse existing tokens if available.

Mobile should generally use a compact version of the same system.

```text
Desktop: spacious
Mobile: compact but intentional
```

Do not create arbitrary one-off spacing values.

## 6. Sections

Reduce mobile:

* Section padding
* Large empty spaces
* Gaps
* Hero heights
* Card spacing
* Navigation spacing

Do not remove meaningful breathing room.

## 7. Grid & Cards

Use responsive Grid/Flex layouts.

Typical behavior:

```text
Desktop:  [Card] [Card] [Card]
Tablet:   [Card] [Card]
Mobile:   [Card]
          [Card]
          [Card]
```

Use `minmax()` and flexible widths where appropriate.

Never use fixed widths that cause overflow.

## 8. Images

Images must be responsive and preserve their intended aspect ratio.

Do not arbitrarily crop clinically important dental/case images.

Use `object-fit` only according to the component's existing design intent.

Images must never cause horizontal overflow.

## 9. Text

Allow natural wrapping.

Never:

* Force long text onto one line
* Rewrite content to make it fit
* Create horizontal scrolling for text
* Hide important content because of screen width

Fix in this order:

1. Wrap
2. Adjust typography
3. Adjust spacing
4. Hide/collapse only genuinely secondary content

## 10. Horizontal Overflow

**Accidental horizontal page scrolling is prohibited.**

Check:

* Body/document
* Containers
* Images
* Cards
* Tables
* Navigation
* Buttons
* Long text
* Sidebars
* Modals
* Forms

Do NOT blindly use:

```css
overflow-x: hidden;
```

Find and fix the actual element causing overflow.

## 11. Touch Usability

Mobile controls must remain comfortable to use.

Ensure:

* Buttons have usable touch areas
* Icons have adequate spacing
* Interactive cards are easy to tap
* Forms remain usable
* Important actions are not crowded

Usability takes priority over preserving exact desktop dimensions.

## 12. Navbar

On mobile:

* Prevent overflow
* Preserve hierarchy and branding
* Use an appropriate mobile navigation pattern
* Maintain usable touch targets
* Never change navbar colors

## 13. Admin Sidebar

The admin sidebar must adapt independently from the main content.

On mobile it must not:

* Squeeze the content
* Cause horizontal overflow
* Push content outside the viewport
* Permanently consume excessive width

Use the existing architecture with an appropriate:

* Drawer
* Overlay
* Collapsible sidebar
* Toggle navigation

The main content must retain a usable mobile width.

## 14. Secondary Content

Secondary elements may be hidden, collapsed, moved, or deferred when necessary.

Important content must remain accessible.

Never hide important content simply because the viewport is smaller.

## 15. Desktop Protection

Every responsive change must satisfy:

```text
Mobile  → correct
Tablet  → correct
Desktop → unchanged
```

Do not refactor unrelated desktop code.

## 16. Component Ownership

Fix responsive problems at the component that owns them.

Example:

```text
Page
 └─ Section
     └─ Grid
         └─ Card
             └─ Image
```

If the image causes overflow, fix the image/component first—not the entire page.

Prefer localized fixes.

## 17. Priority

When choosing between solutions:

1. Visual consistency
2. Touch usability
3. Content readability
4. Desktop preservation
5. Performance

Do not sacrifice visual consistency or usability for minor performance optimizations.

## 18. Validation

Test affected screens at:

```text
320
360
375
390
414
430
640
768
1024
1280+
```

Check:

* Overflow
* Grid behavior
* Text wrapping
* Typography
* Spacing
* Buttons/touch targets
* Images
* Navbar
* Sidebar
* Modals
* Forms
* Desktop regressions

## 19. Before Editing

Before changing code:

1. Inspect the existing component.
2. Understand its desktop behavior.
3. Identify the actual responsive problem.
4. Find the component responsible.
5. Reuse existing tokens/utilities.
6. Make the smallest maintainable fix.
7. Verify mobile, tablet, and desktop.

Do not rewrite components unnecessarily.

## 20. Final Rule

```text
ONE DESIGN
    ↓
RESPONSIVE SYSTEM
    ↓
FLUID ADAPTATION
    ↓
BEHAVIORAL CHANGES ONLY WHEN NECESSARY
```

Never build separate device-specific versions of the application.

The result must look like the same product intelligently adapting to different screen sizes.
