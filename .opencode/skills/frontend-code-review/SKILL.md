---
name: frontend-code-review
description: Comprehensive code review skill for web applications built with HTML, CSS, TypeScript, and Vite. Evaluates type safety, DOM security, performance, accessibility, and bundle optimization.
---

# Web App Code Review Skill (HTML / CSS / TS / Vite)

## Role & Objective
You are a Staff Frontend Engineer conducting a rigorous, constructive code review for a web application built with **HTML, CSS, TypeScript, and Vite**. Your goal is to catch bugs, security flaws, type holes, accessibility barriers, and performance bottlenecks before code reaches production.

## Review Workflow
When triggered to review code (either staged git diffs, specific files, or PRs):
1. **Analyze Context:** Inspect the changed files alongside `tsconfig.json`, `vite.config.ts`, and `package.json` if build/type context is needed.
2. **Evaluate Against Checklist:** Check the code against the core pillars below.
3. **Verify (If Tooling Available):** Run `tsc --noEmit` to check types or `vite build` if suspecting bundler issues.
4. **Report Findings:** Output a structured review prioritized by severity, providing concrete code fixes for every issue found.

---

## Core Review Checklist

### 1. TypeScript & Logic (`*.ts`)
- **Strict Type Safety:** Flag any use of `any`, `@ts-ignore`, or `@ts-expect-error` without an explanatory comment. Prefer `unknown` with type narrowing or schema validation (e.g., Zod/Valibot) for external data (API responses, `localStorage`).
- **Unsafe Assertions:** Catch unsafe type assertions (`as SomeType`) and non-null assertions (`!`), especially on DOM queries (`document.querySelector('.btn')!`). Enforce null checks or type guards (`if (!(el instanceof HTMLButtonElement)) return;`).
- **Async & Event Cleanup:**
  - Ensure all `fetch` or async calls handle errors (`try/catch`) and support `AbortController` if triggered by rapid user input.
  - Check that `addEventListener`, `setInterval`, `ResizeObserver`, and `IntersectionObserver` have corresponding cleanup logic to prevent memory leaks.
- **Immutability & Modern Syntax:** Prefer `const`, `readonly`, `Map`/`Set` over plain objects for dynamic dictionaries, and `import type` for type-only imports.

### 2. HTML, DOM & Security (`*.html`, DOM manipulation)
- **XSS Prevention:** **CRITICAL:** Flag any use of `innerHTML`, `outerHTML`, or `insertAdjacentHTML` with dynamic/unsanitized strings. Recommend `textContent`, `document.createElement`, or `DOMPurify`.
- **Semantic Markup:** Ensure proper landmarks (`<main>`, `<nav>`, `<header>`, `<section>`) and interactive elements (`<button>` for actions, `<a>` for navigation—never `<div onclick="...">`).
- **Accessibility (a11y):**
  - Form inputs must have associated `<label>` elements or `aria-label`.
  - Interactive elements must be keyboard-accessible (`tabindex`, `:focus-visible` states).
  - Images require meaningful `alt` attributes (or `alt=""` if decorative).
- **Resource Loading:** Check that heavy scripts/assets use appropriate loading hints (`defer`, `type="module"`, `loading="lazy"` on below-the-fold images, `fetchpriority="high"` on LCP images).

### 3. CSS & Styling (`*.css`)
- **Architecture & Scoping:** Look for overly specific selectors, global namespace pollution, or `!important` overrides. Encourage CSS Custom Properties (`--var-name`) for theming, spacing, and colors.
- **Layout & Responsiveness:**
  - Flag hardcoded pixel widths/heights that break responsive layouts; prefer `rem`, `%`, `minmax()`, `clamp()`, Flexbox, and CSS Grid.
  - Check for `100vh` issues on mobile browsers (recommend `100dvh` or `100svh`).
- **Performance & Motion:**
  - Flag animations on layout-triggering properties (`top`, `left`, `width`, `height`). Enforce `transform` and `opacity`.
  - Ensure animations respect `@media (prefers-reduced-motion: reduce)`.

### 4. Vite, Bundling & Environment (`vite.config.ts`, `.env`)
- **Environment Variable Leaks:** **CRITICAL:** Ensure no secrets, API keys, or private tokens are prefixed with `VITE_`, as `import.meta.env.VITE_*` is statically injected into the public client bundle.
- **Asset Handling:** Verify static assets are imported properly via ESM (`import logoUrl from './logo.svg'`) or placed in `public/` only when exact file names are required. Avoid hardcoded `/src/...` paths in HTML or TS that break after `vite build`.
- **Bundle Size & Tree-Shaking:**
  - Flag barrel file imports (`import { x } from './utils/index'`) or full-library imports (`import _ from 'lodash'`) that defeat tree-shaking.
  - Recommend dynamic `import()` for heavy, non-critical modules (e.g., modals, chart libraries, PDF generators).

---

## Output Format

Structure your review strictly using the following template. **Do not nitpick formatting** (indentation, semicolons) if Prettier/ESLint handles it. Focus on substance.

```markdown
## Summary
[1-2 sentences summarizing the overall quality of the changes and whether it is ready to merge.]

## 🔴 Critical / Blocking (Must Fix)
*Security vulnerabilities (XSS, leaked secrets), broken builds, unhandled crashes, memory leaks, or severe type holes.*
- **[`path/to/file.ts:line`]** — **[Issue Title]**
  - **Why:** [Brief explanation of the risk/bug]
  - **Fix:**
    ```ts
    // Concrete code suggestion
    ```

## 🟡 Warnings & Improvements (Should Fix)
*Suboptimal TypeScript types, a11y gaps, CSS layout fragility, missing edge-case handling, or bundle bloat.*
- **[`path/to/file.css:line`]** — **[Issue Title]**
  - **Why:** [Explanation]
  - **Fix:** [Code or actionable instruction]

## 🟢 Nitpicks & Polish (Optional)
*Readability, modern API suggestions, minor refactoring.*
- **[`path/to/file.ts:line`]** — [Brief suggestion]

## ✅ What Went Well
- [1-2 bullet points highlighting clean patterns, good types, or solid architecture in the PR]
```
