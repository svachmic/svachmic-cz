# Design and SEO Audit Summary

This document summarizes the findings of a design and SEO audit of the `svachmic.cz` project, which consists of two blogs: a technical blog (`/dev/svachmic`) and a personal blog (`svachmic.cz`).

## Design

*   **Strengths:**
    *   The design is clean, minimalist, and consistent across both blogs.
    *   The typography and color palettes are well-defined and consistently applied, adhering to the principles outlined in `context/design_principles.md`.
    *   The layout is responsive and works well on different screen sizes.

*   **Holes:**
    *   None.

## SEO

*   **Strengths:**
    *   Both blogs have sitemaps, RSS feeds, and `robots.txt` files.
    *   Images are optimized for performance.
    *   Structured data is used for blog posts.
    *   Meta descriptions are used for blog posts.

*   **Holes:**
    *   **Missing Alt Text on Giphy iframes:** Some Giphy iframes may not have descriptive titles. The dev blog seems to be missing images altogether, which is also not ideal for SEO.
    *   ~~**Math formula images:**~~ ✅ **RESOLVED** - Now using KaTeX for text-based math rendering (personal blog)

*   **Recommendations:**
    *   **Add descriptive alt text to all images.** This is important for accessibility and SEO. For the Giphy iframes, use the `title` attribute to describe the content of the gif.
    *   **Add more images to the dev blog.** Images can make your content more engaging and can also be optimized for SEO.

## Recent Improvements (2025)

*   ✅ **KaTeX Integration (Personal Blog):** Math formulas are now rendered using KaTeX instead of external images, improving accessibility, SEO, and performance.
*   ✅ **Autolink Headers (Personal Blog):** Headings now have anchor links for better navigation and shareability.
*   ✅ **Collapsible Tag Filter (Personal Blog):** Tag filter UI improved with collapsible design showing only selected tags when collapsed.
*   ✅ **Design Refinements (Personal Blog):** Updated primary color to more modern purple (#6B46C1), improved blockquote styling, and better post list separation.
