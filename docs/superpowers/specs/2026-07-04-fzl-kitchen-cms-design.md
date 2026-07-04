# FZL Kitchen CMS Frontend Design

Date: 2026-07-04

## Goal

Build a `/cms` frontend page for editing the visible FZL Kitchen landing page content before connecting a database. The first version should feel like a real admin editor, but persistence can remain local/frontend-only until the database phase.

## Scope

The CMS controls only the currently visible FZL Kitchen landing page:

- Header logo, navigation labels, navigation targets, and WhatsApp CTA text/link.
- Hero eyebrow, headline, highlighted headline text, description, background image, and best seller dish cards.
- Full menu section title/copy, food and drink catalogue images, tab labels, and order button text/link template.
- Cara Order heading, steps, description, and WhatsApp order CTA.
- Follow FZL Kitchen headline, copy, decorative images, and social/follow buttons.
- FAQ section heading, image, questions, and answers.
- Contact/order section eyebrow, heading, copy, WhatsApp/Foodpanda/GrabFood buttons, map embed/search links, phone, and address.
- Footer logo, operating hours, quick links, social links, order links, phone, address, and copyright text.
- Floating WhatsApp label and link.

The hidden Vidhub sections currently present in `app/page.jsx` are out of scope for this CMS pass.

## Non-Goals

- No database connection yet.
- No authentication yet.
- No file upload or image storage yet.
- No live publishing workflow yet.
- No editing of hidden legacy sections.

## Recommended Approach

Create a shared landing-page content model and build `/cms` around that shape.

The CMS should edit a local copy of the default content in React state. This gives the admin UI real behavior now while keeping the future database/API work straightforward. When the backend phase begins, the local content model can become the seed data and API contract.

## Architecture

### Content Model

Add a shared module such as `app/content/siteContent.js` with a default export containing the visible page content.

Suggested top-level shape:

- `site`: brand name, phone, address, operating hours, copyright.
- `links`: WhatsApp, order template, Foodpanda, GrabFood, phone, map search, map embed.
- `header`: logo image, nav items, CTA.
- `hero`: eyebrow, headline parts, copy, background image, best seller cards.
- `catalogue`: heading copy, tabs, images, order CTA template.
- `process`: heading, steps, CTA copy/button.
- `social`: headline parts, copy, decorative assets, social buttons.
- `faq`: heading, image, items.
- `contact`: heading copy, order buttons, map details.
- `footer`: logo, hours, quick links, social/order columns, copyright.
- `floatingWhatsApp`: label and link.

Images should be stored as asset filenames or `/assets/...` paths and previewed in the CMS.

### Landing Page

The landing page can continue rendering the same visual design, but visible content should come from the shared content model instead of scattered constants where practical. This reduces duplicate data and prepares the app for API-driven content later.

### CMS Page

Add `app/cms/page.jsx` as a client component.

The CMS layout:

- Sticky/top admin header with page title, status, Reset, Preview, and Save Draft controls.
- Left sidebar with section navigation.
- Main editor panel for the selected section.
- Optional right-side preview/details area on wide screens if it stays compact.

Sections:

- Site Settings
- Header
- Hero & Best Sellers
- Full Menu
- Cara Order
- Follow FZL Kitchen
- FAQ
- Contact & Ordering
- Footer

### Editing Patterns

Use normal form controls and repeatable cards:

- Text input for short labels and button text.
- Textarea for descriptions, WhatsApp message templates, addresses, and FAQ answers.
- URL input for external links.
- Image path input with thumbnail preview for asset-backed images.
- Add/remove/reorder controls for repeatable lists such as best sellers, social buttons, FAQ items, footer links, and order buttons.

For this first pass, Save Draft can store the working content in `localStorage` and show a success state. Reset should restore the default shared content. This keeps the frontend useful before the database is connected.

## Data Flow

1. `/cms` loads default content from the shared module.
2. If a local draft exists, `/cms` loads that draft into component state.
3. Editors update nested fields in state.
4. Save Draft writes the current state to `localStorage`.
5. Reset clears the draft and reloads default content.

The landing page does not need to consume the local draft yet. Database-backed publishing can be added in the next phase so public content changes only after an intentional save/publish.

## Error Handling

- Show a broken-image fallback when an image path cannot load.
- Validate required labels for repeatable items before saving.
- Allow empty optional fields such as badges, decorative images, and secondary links.
- Keep invalid URL fields editable, but mark them visually so the user can fix them.

## UX Notes

- The CMS should feel operational and compact, not like a marketing page.
- Use the existing FZL Kitchen dark/yellow/red brand language, but make the admin interface calmer and denser.
- Avoid nested cards; repeated editable items can be cards, while page sections should be simple panels or full-width editor areas.
- Use lucide icons for common actions such as add, trash, save, reset, link, image, and external preview.
- Keep controls responsive and usable on mobile, though desktop is the primary editing experience.

## Testing And Verification

- Run a production build with `npm run build`.
- Start the app and verify `/` still renders.
- Verify `/cms` renders on desktop and mobile viewport widths.
- Test adding/removing at least one social button, FAQ item, and best seller card.
- Test Save Draft and Reset behavior.
- Check that image previews render for existing `/public/assets` images and show a fallback for invalid paths.

## Future Database Phase

The shared content model should inform the database/API design. A pragmatic first backend version can store the full landing content as a single JSON document with version metadata. If editing activity grows, individual sections can later become separate records.
