# Design System Guidelines

This document outlines the core design language for our web applications. Follow these guidelines to ensure consistency, high visual quality, and a premium user experience across all projects.

## 🎨 1. Color Palette

Our color system is designed to be modern, vibrant, and accessible. We prioritize a sleek dark mode aesthetic by default, with glassmorphism elements.

### Base Colors
* **Background (Dark):** `#0F172A` (Slate 900) - A deep, rich background that feels more premium than pure black.
* **Surface/Card:** `rgba(30, 41, 59, 0.7)` (Slate 800 with opacity) - Used for cards and modals, combined with background blur for a glass effect.
* **Text Primary:** `#F8FAFC` (Slate 50) - For main headings and primary body text.
* **Text Secondary:** `#94A3B8` (Slate 400) - For descriptions, placeholders, and less important text.

### Brand/Accent Colors
* **Primary Accent:** `#6366F1` (Indigo 500) - Used for primary buttons, active states, and important links.
* **Secondary Accent:** `#EC4899` (Pink 500) - Used sparingly for gradients, highlights, or badges to add a "wow" factor.
* **Gradient:** `linear-gradient(135deg, #6366F1 0%, #EC4899 100%)` - Used for striking hero text, special buttons, or subtle borders.

## ✍️ 2. Typography

Typography should be clean, modern, and highly legible.

* **Primary Font:** `Inter` or `Outfit` (via Google Fonts).
* **Headings:** Bold, tight letter-spacing.
  * `<h1>`: 3rem (48px), Font Weight: 700, Line Height: 1.2
  * `<h2>`: 2.25rem (36px), Font Weight: 600, Line Height: 1.3
  * `<h3>`: 1.5rem (24px), Font Weight: 600, Line Height: 1.4
* **Body Text:** 1rem (16px), Font Weight: 400, Line Height: 1.6, Letter-spacing: slightly relaxed.

## 📐 3. Layout & Spacing

Consistent spacing creates a harmonious and professional look.

* **Container Max-Width:** `1200px` for main content areas.
* **Spacing Scale:** Use multiples of 8px (e.g., 8px, 16px, 24px, 32px, 48px, 64px).
* **Border Radius:**
  * Small elements (inputs, tags): `6px`
  * Medium elements (buttons, small cards): `12px`
  * Large elements (main cards, modals): `24px`

## 🧩 4. Core Components

### Buttons
* **Primary Button:**
  * Background: Primary Accent (`#6366F1`) or Gradient.
  * Text: White, Font Weight: 500.
  * Padding: `12px 24px`.
  * Border Radius: `12px`.
  * Transition: `all 0.2s ease`.
  * Hover: Slight upward shift (`transform: translateY(-2px)`), increased shadow (`box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.5)`).
* **Secondary/Ghost Button:**
  * Background: Transparent.
  * Border: `1px solid rgba(255,255,255,0.1)`.
  * Text: Text Primary.
  * Hover: Background becomes `rgba(255,255,255,0.05)`.

### Cards (Glassmorphism)
* Background: `rgba(30, 41, 59, 0.7)`.
* Backdrop Filter: `blur(12px)`.
* Border: `1px solid rgba(255, 255, 255, 0.05)` to create a subtle edge highlight.
* Padding: `24px` or `32px`.
* Box Shadow: `0 4px 30px rgba(0, 0, 0, 0.1)`.

## ✨ 5. Micro-interactions & Animation

Animations should be subtle and purposeful, never overwhelming.

* **Hover States:** All interactive elements (buttons, links, cards) must have a visible hover state.
* **Transitions:** Use `transition: all 0.2s ease` for color and background changes, and `transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)` for movement.
* **Page Load:** Elements should fade in and slide up slightly upon entering the viewport (`opacity: 0` to `opacity: 1`, `translateY(20px)` to `translateY(0)`).

## 🚀 6. SEO & HTML Structure

* Every page must have a single `<h1>`.
* Use semantic tags: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
* Ensure high contrast ratios for text readability.
