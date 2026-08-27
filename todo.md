# Animation Revision Todo

## Text visibility regression fix

- [x] Identify hidden-text selectors and reveal wrappers causing the regression.
- [x] Make all reveal content visible by default, with animation as progressive enhancement only.
- [x] Remove any selector that hides content until a global ready state or can leave text stuck invisible.
- [x] Validate desktop, mobile, and reduced-motion rendering with TypeScript/build checks.
- [x] Save a new fix checkpoint and deliver it.

## Vertical reveal refinement

- [x] Extend vertical swipe reveals beyond the hero to complete sections and section text.
- [x] Add distinct swipe-down and swipe-up direction hooks with staggered text timing.
- [x] Preserve IntersectionObserver efficiency, reduced-motion behavior, and mobile stability.
- [x] Re-run checks, capture previews, and save a new checkpoint.

- [x] Add an elegant first-load preloader before the cover becomes visible.
- [x] Add swipe-down and swipe-up text reveal animations for editorial copy.
- [x] Ensure content interaction remains locked until the preloader and cover timing complete.
- [x] Respect `prefers-reduced-motion` and keep mobile layout stable.
- [x] Run TypeScript and production build checks.
- [x] Capture representative desktop and mobile screenshots.
- [x] Save a new checkpoint and deliver the revision.
