# Design Principles

This document outlines the design principles for the `svachmic.cz` project, which consists of two blogs: a technical blog (`/dev/svachmic`) and a personal blog (`svachmic.cz`).

## Core Principles

- **Minimalism and Readability:** The design is clean and simple, with a strong focus on content and readability. There are no distracting elements.
- **Consistency:** Both blogs share a consistent layout, typography, and spacing system, creating a unified brand identity.
- **Responsive Design:** The layout is responsive and works well on all screen sizes, from mobile to desktop.

## Typography

- **Headings:** Montserrat is used for headings, providing a modern and clean look.
- **Body:** Merriweather is used for body text, which is a serif font that is easy to read in long-form content.
- **Code:** JetBrains Mono is used for code blocks on the technical blog, which is a monospaced font designed for developers.
- **Root Font Size:** The root font size is set to `15px` to create a more compact and modern feel.

## Color Palette

The project uses two distinct color palettes:

- **`/dev/svachmic` (Dark Theme):**
  - **Background:** Dark gray/blue (`#1e2128`)
  - **Text:** Light gray (`#d1dce5`)
  - **Primary Accent:** Bright purple (`#bb05fe`)
- **`svachmic.cz` (Light Theme):**
  - **Background:** White
  - **Text:** Dark gray (`#2e353f`)
  - **Primary Accent:** A more modern and less saturated purple (`#6B46C1`)

## Layout and Spacing

- **Wrapper:** The content is contained within a centered wrapper with a `maxWidth` of `56rem` to improve readability on large screens.
- **Spacing:** A consistent spacing scale is used throughout the design, creating a harmonious and balanced layout.

## Components

- **Header:** The header is simple and contains either the main heading on the homepage or a link back to the homepage on other pages.
- **Footer:** The footer contains links to other social profiles and an RSS feed.
- **Bio:** A short author bio is displayed on the homepage.
- **Blog Post:** The blog post layout is simple and focuses on the content.
- **Blockquotes:** Blockquotes have a prominent style with a background color, padding, and a left border to make them stand out.
- **Post List:** Blog post items in a list are separated by a bottom border to improve visual separation.
- **Tag Filter:** The tag filter on the homepage is collapsible to reduce visual clutter. It shows only selected tags when collapsed.
- **Anchor Links:** Anchor links are automatically added to headings (h2, h3, h4) in blog posts. The anchor icon is hidden by default and becomes visible on hover.