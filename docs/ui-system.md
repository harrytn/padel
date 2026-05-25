# Caribbean World UI System

The Caribbean World Padel Booking system strictly adheres to a cohesive, global design language centered on tropical glassmorphism and rigorous grid spacing.

## Layout & Spacing Rules

**CRITICAL PROJECT RULE:** Standard Tailwind spacing utilities are unreliable in this repository and often fail to compile correctly. They **MUST NOT** be used.

1. **The 4-Point System**: All spacing dimensions (margins, padding, gaps) must be strict multiples of 4 (e.g., `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
2. **Standard Tailwind Spacing is Banned**: Never use generic layout classes like `p-6`, `gap-4`, `m-8`, `h-12`, `w-80`.
3. **Critical UI Roots Use CSS**: The core UI structure relies on the `.cw-*` global namespace defined in `app/globals.css`. These classes use `!important` tags to physically enforce spacing overrides.
4. **Arbitrary Pixel Values**: For non-critical flex/grid gaps (e.g., separating two buttons), use arbitrary pixel values like `gap-[24px]` or `mt-[32px]`.

## The `.cw-*` Namespace

Always use these foundational roots for any new interfaces across the guest booking view, staff login, and admin dashboard:

- `.cw-glass-panel` — Used for main layout wrappers. Provides `36px 40px` padding.
- `.cw-glass-card` — Used for internal cards or table wrappers. Provides `28px 32px` padding.
- `.cw-form-card` — Used for login forms and configuration panes.
- `.cw-admin-card` — Used for internal admin dashboard statistic panels.
- `.cw-modal-root` — The shell for popups and checkouts.
- `.cw-slot-card-root` — Specially designed root for the `SlotCard.tsx` component.
- `.cw-sidebar-root`, `.cw-nav-item`, `.cw-legend-root`, `.cw-legend-row` — Sidebar layout systems.
- `.cw-input`, `.cw-button` — All interaction elements must follow this structure (`h-[48px]`).

## Glassmorphism Identity

Do not use generic "Dark Mode" styling (e.g., `#0f172a`). The Admin and Staff portal MUST feel like an extension of the guest application.

- The application uses `bg-tropical.png` dynamically tinted with dark slate overlays.
- White components use `bg-white/60` and `backdrop-blur-md` or `blur-lg`.
- Border outlines leverage `border-white/40` or equivalent low-opacity highlights to provide glass depth.
