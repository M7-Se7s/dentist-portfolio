---
name: Dentist Portfolio UI/UX Expert
description: Enhances project logic and UI/UX using premium clinical aesthetics, Vanilla CSS, and robust Firebase/Cloudinary integrations for medical portfolios.
---

# Dentist Portfolio UI/UX Expert

When triggered, apply the following standards and behaviors to enhance logic and UI/UX for medical/dental portfolio projects:

## 1. Architectural Stack & Logic
*   **Core**: Next.js (App Router).
*   **Database & Auth**: Firebase (Firestore & Authentication).
*   **Image Storage**: Cloudinary (for generous free tiers and automatic image optimization).
*   **Image Management Rules**: 
    *   Upload images directly to Cloudinary using Unsigned Upload Presets from the client side.
    *   Save both the `secure_url` and `public_id` to Firestore.
    *   When an image is replaced or a case is deleted, you **must** call the secure Next.js backend route (`/api/cloudinary`) to permanently delete the image from Cloudinary using the `public_id`. Never leave orphaned files.
*   **Dynamic Content**: All portfolio content (Clinical Cases, CV, Experience) must be dynamically driven by Firestore so the dentist can update it without code changes.

## 2. UI/UX & Aesthetic Guidelines
*   **Styling Engine**: Use **Vanilla CSS** (CSS Modules and `globals.css`) to maximize flexibility and maintain a bespoke feel. Do not default to Tailwind.
*   **Premium Clinical Aesthetic**: 
    *   The design must feel expensive, clean, and calming. 
    *   **Colors**: Deep Teals/Cyan (`#0E5E7A`) as primary brand colors, Crisp Whites (`#FFFFFF`) for content cards, and Light Grays (`#F8FAFC`) for backgrounds. Use Soft Gold (`#C09A6B`) for accents.
    *   **Typography**: Use modern sans-serif fonts. `Inter` for highly readable body text, and `Outfit` for sleek, structured headings.
*   **Components & Micro-interactions**:
    *   Use soft, subtle drop shadows (`box-shadow: 0 4px 16px rgba(0,0,0,0.06)`) and rounded corners (`12px` for cards, `8px` for buttons).
    *   Implement micro-animations: Buttons should slightly lift (`transform: translateY(-2px)`) on hover; case gallery cards should slightly zoom their images on hover.

## 3. Admin Panel Standards
*   **Login**: Use a premium Split-Screen layout. One half features a calming medical abstraction or gradient, while the other half houses a clean, minimalist login form.
*   **Dashboard**: Use a dark teal sidebar for navigation. The main content area should display data in beautifully padded white tables with pill-shaped badges for status/categories.
*   **Data Privacy**: Avoid adding fields for Protected Health Information (PHI). Cases should only include generalized descriptions (Title, Category, Description, Before/After Images), absolutely no patient names or treatment plans.
