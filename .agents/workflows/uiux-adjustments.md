---
description: 
---

# Antigravity UI/UX Polish & Refactor Directive

Whenever the user requests a design, layout, spacing, or visual adjustment, automatically enforce the following design system rules:

## 1. Execution Protocol for Adjustments
- **Sanitize Arbitrary Values:** Replace all arbitrary or magic CSS units (e.g., `13px`, `27px`, `margin-top: 15px`) with standard 4px/8px design system tokens.
- **Maintain Proportional Hierarchy:** When adjusting one property (e.g., increasing container padding), proportionally balance child margins, gap sizes, and typography leading to avoid visual crowding.
- **Responsive-First:** Always account for mobile vs. desktop scaling (e.g., `p-4 sm:p-6`, `text-sm sm:text-base`).

---

## 2. Spacing Scale (8pt Grid Standard)
All `margin`, `padding`, and `gap` values must map strictly to this scale:
- `4px` (`1` / `0.25rem`): Micro-spacing, inline badges, tight icon gaps.
- `8px` (`2` / `0.5rem`): Chip padding, compact list gaps, input vertical padding.
- `12px` (`3` / `0.75rem`): Form field separation, nested card padding.
- `16px` (`4` / `1rem`): Default component padding, mobile screen gutters.
- `24px` (`6` / `1.5rem`): Desktop card padding, grid section gaps.
- `32px` (`8` / `2rem`): Major container separation, section vertical rhythm.
- `48px+` (`12` / `3rem`): Page section spacing.

---

## 3. Typography Adjustments
- **Pairing Rule:** Never change `font-size` without adjusting `line-height` (leading) and `font-weight` to preserve readability.
- **Scale:**
  - `text-xs` (12px): Metadata, timestamps, micro-copy (`leading-tight font-medium`).
  - `text-sm` (14px): Secondary body, table data, form labels (`leading-relaxed font-normal`).
  - `text-base` (16px): Primary body text, main inputs (`leading-relaxed font-normal`).
  - `text-lg` / `text-xl` (18px–20px): Card titles, modal headers (`leading-snug font-semibold`).
  - `text-2xl`+ (24px+): Page headings, section titles (`tracking-tight font-bold`).

---

## 4. Visual Polish & Elevation
- **Border Radii:**
  - Interactive triggers (Buttons/Inputs): `rounded-lg` (8px).
  - Cards & Panels: `rounded-xl` (12px) or `rounded-2xl` (16px).
  - Modals & Floating Overlays: `rounded-2xl` (16px) or `rounded-3xl` (24px).
- **Subtlety Over Heaviness:** Prefer ultra-thin borders with low opacities (e.g., `border border-white/10` or `border-slate-200/80`) over stark solid outlines or heavy drop shadows.
- **Touch Target Minimum:** Interactive items (buttons, icon triggers) must retain at least `44x44px` clickable area (`p-2.5` to `p-3`).

---

## 5. Output Format
- Provide the modified code directly with concise inline comments explaining any token replacements or structural balance changes made.