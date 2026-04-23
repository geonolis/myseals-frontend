# mySeals Frontend Design Ideas

## Response 1 — Industrial Precision
<response>
<probability>0.07</probability>
<text>
**Design Movement:** Industrial Modernism meets Government Utility

**Core Principles:**
1. Strict information hierarchy — data density without clutter
2. Monochromatic base with single high-contrast accent for critical actions
3. Tabular precision — everything aligns to an invisible 8px grid
4. Trust through restraint — no decorative elements, only purposeful ones

**Color Philosophy:**
Deep slate backgrounds (#0F172A, #1E293B) convey authority and seriousness. A single amber accent (#F59E0B) signals action and urgency — echoing the physical metallic seal. Muted grays for secondary information.

**Layout Paradigm:**
Fixed left sidebar (240px) with icon+label nav. Main content area uses a split-panel approach: left panel for list/filters, right panel for detail view. No centered layouts — everything is left-anchored.

**Signature Elements:**
1. Seal number badges styled as actual metallic tags (pill shape, monospace font, subtle gradient)
2. Status indicators as colored horizontal bars (not dots) — industrial gauge aesthetic
3. Breadcrumb trail styled as a file path (e.g., `HQ / Lisbon Office / Seal #MS-000042`)

**Interaction Philosophy:**
Keyboard-first. Tab through forms, Enter to confirm, Escape to cancel. Hover states reveal additional actions. No modals — use slide-in panels.

**Animation:**
Minimal. Only functional: slide-in panels (200ms ease-out), row highlight on select (instant), loading skeleton shimmer.

**Typography System:**
- Display: `IBM Plex Mono` (seal numbers, IDs, codes)
- Body: `Inter` (14px/400, 13px for secondary)
- Headers: `Inter` 600 weight
</text>
</response>

## Response 2 — Maritime Authority (CHOSEN)
<response>
<probability>0.08</probability>
<text>
**Design Movement:** Maritime Institutional — the visual language of port authorities, customs agencies, and logistics operations

**Core Principles:**
1. Deep navy + steel blue palette evoking maritime authority and trust
2. Asymmetric sidebar layout with strong left-rail navigation
3. Card-based content with sharp corners and subtle ruled borders (no excessive rounding)
4. Data-forward design — tables and status badges are first-class citizens

**Color Philosophy:**
Deep navy (#0A1628) as the primary background for the sidebar and headers, conveying institutional authority. Steel blue (#1D4ED8) for primary actions. Warm white (#F8FAFC) for content areas. Amber (#D97706) as the sole accent for warnings and critical status. This palette mirrors the colors of official customs documentation and maritime charts.

**Layout Paradigm:**
Fixed left sidebar (256px) with grouped navigation sections. Content area uses a top-bar + scrollable main layout. Lists use full-width data tables with sticky headers. Detail views open as right-side drawers, not new pages.

**Signature Elements:**
1. Seal number tags rendered as embossed metallic badges (monospace font, dark background, subtle inset shadow)
2. Status pipeline — a horizontal step indicator showing seal lifecycle (Registered → In Stock → Assigned → In Use → Returned/Lost)
3. Office hierarchy visualized as an indented tree in the sidebar

**Interaction Philosophy:**
Form-first for data entry, table-first for data review. Bulk actions available via row checkboxes. Confirmation dialogs for destructive actions. Toast notifications for async operations.

**Animation:**
Purposeful transitions: drawer slide-in (250ms cubic-bezier), table row fade-in on load, status badge pulse for "In Use" seals.

**Typography System:**
- Display/Headers: `Sora` (bold, geometric — modern authority)
- Body/Tables: `DM Sans` (clean, readable at small sizes)
- Codes/IDs: `JetBrains Mono` (seal numbers, UUIDs)
</text>
</response>

## Response 3 — Clean Government Portal
<response>
<probability>0.06</probability>
<text>
**Design Movement:** Contemporary E-Government — clean, accessible, trustworthy

**Core Principles:**
1. High accessibility — WCAG AA compliant contrast ratios throughout
2. Progressive disclosure — show only what's needed, reveal complexity on demand
3. Mobile-responsive from the start (customs officers may use tablets)
4. Neutral palette with a single brand color

**Color Philosophy:**
Pure white backgrounds with a cobalt blue (#2563EB) brand color. Light gray (#F1F5F9) for section backgrounds. Green (#16A34A) for success/active states, red (#DC2626) for errors/lost seals. Professional and familiar — like a government web portal.

**Layout Paradigm:**
Top navigation bar with secondary sidebar for sub-sections. Content uses a 12-column grid. Cards with generous padding. Forms use a two-column layout on desktop.

**Signature Elements:**
1. Status chips with colored left borders (not background fills)
2. Inline data editing — click a cell to edit it directly
3. Print-ready views for seal assignment reports

**Interaction Philosophy:**
Wizard-style flows for complex operations (registering a batch, assigning seals). Step indicators for multi-step forms. Inline validation.

**Animation:**
Smooth page transitions, accordion expand/collapse, form field focus animations.

**Typography System:**
- All: `Source Sans 3` (designed for UI and government portals)
- Monospace: `Source Code Pro` (seal numbers)
</text>
</response>

---

## CHOSEN DESIGN: Response 2 — Maritime Authority

Deep navy sidebar, steel blue actions, sharp-cornered cards, metallic seal badges, status pipeline, Sora + DM Sans + JetBrains Mono typography.
