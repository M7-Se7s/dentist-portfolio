---
name: Responsive UI/UX Enhancer
description: Analyzes and modifies the project's code to ensure perfect responsiveness across all devices (320px to 4K), fixes element positioning, and enhances overall UI/UX aesthetics.
---

# Responsive UI/UX Enhancer

When triggered, apply the following standards and behaviors to ensure the application is perfectly responsive, visually stunning, and user-friendly.

## 1. Responsiveness Guidelines
*   **Mobile-First Approach**: Design and style for mobile devices (320px and up) first, then use `min-width` media queries to scale up to larger screens (tablets, laptops, desktops, ultra-wide 4K).
*   **Fluid Typography & Spacing**: Use relative units (`rem`, `em`, `vh`, `vw`, or `clamp()`) for font sizes, margins, paddings, and layouts to ensure fluid scaling across screen sizes.
*   **Flexible Layouts**: Heavily utilize CSS Flexbox and Grid. Avoid rigid fixed widths or heights unless absolutely necessary.
*   **Media Queries**: Implement standard breakpoints (e.g., `480px`, `768px`, `1024px`, `1280px`, `1536px`) to adjust layouts for different device categories.

## 2. Positioning & Alignment Fixes
*   **Audit Element Placement**: Actively check for and fix overlapping text, misaligned buttons, or icons that break outside their containers or look out of place.
*   **Centering & Spacing**: Ensure logical grouping of elements using `gap` in Flexbox/Grid instead of erratic margins. Ensure consistent vertical and horizontal rhythm.
*   **Overflow Handling**: Ensure no unintended horizontal scrolling occurs on any device. Use `word-break` or `overflow-wrap` for long texts.
*   **Touch Targets**: On mobile viewports (<= 768px), ensure interactive elements (buttons, links, icons) have a minimum touch target size of 44x44px.

## 3. UI/UX Aesthetic Enhancements
*   **Modernizing Elements**: Apply modern design trends. Replace harsh borders with soft drop shadows (`box-shadow`), consider glassmorphism where appropriate, or use subtle gradients to give a premium feel.
*   **Typography Hierarchy**: Ensure a clear visual distinction between headings and paragraphs. Improve readability by adjusting line height (e.g., `1.5` to `1.7` for body text) and appropriate font weights.
*   **Micro-interactions**: Add smooth `transition` effects (e.g., `transition: all 0.3s ease`) to buttons, icons, and links for hover, focus, and active states.
*   **Visual Balance**: If any button, text, or icon looks mispositioned, move it to the correct semantic or visual position to balance the layout.
