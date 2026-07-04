# FZL Kitchen CMS Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a frontend-only `/cms` editor for the visible FZL Kitchen landing page content, backed by a shared local content model and `localStorage` drafts.

**Architecture:** Extract the visible landing-page content from `app/page.jsx` into `app/content/siteContent.js`, then update the landing page to consume that object without changing the public design. Add `app/cms/page.jsx` as a client-side admin editor that edits a local copy of the same content shape and saves drafts to `localStorage`. Add scoped CMS styles to `app/globals.css`.

**Tech Stack:** Next.js App Router, React client components, `lucide-react`, plain CSS, browser `localStorage`, existing static export deployment.

---

## File Structure

- Create `app/content/siteContent.js`
  - Owns all visible FZL Kitchen content defaults and helper URL builders.
  - Exports `siteContent`, `assetPath`, `buildWhatsAppUrl`, and `cloneSiteContent`.
- Modify `app/page.jsx`
  - Imports `siteContent` and helpers.
  - Keeps existing UI/animation behavior.
  - Replaces visible hardcoded constants/arrays with shared content.
  - Leaves hidden legacy Vidhub sections out of CMS scope.
- Create `app/cms/page.jsx`
  - Client-side CMS route.
  - Loads defaults plus optional draft from `localStorage`.
  - Provides section navigation, forms, repeatable item editors, image previews, validation, save/reset behavior.
- Modify `app/globals.css`
  - Adds CMS-specific styles under `.cms-shell` and related class names.
  - Does not disturb existing landing page selectors.
- Create `docs/superpowers/plans/2026-07-04-fzl-kitchen-cms-frontend.md`
  - This implementation plan.

## Task 1: Create Shared Content Model

**Files:**
- Create: `app/content/siteContent.js`

- [ ] **Step 1: Create the content directory**

Run:

```powershell
New-Item -ItemType Directory -Force app\content
```

Expected: `app\content` exists.

- [ ] **Step 2: Add the shared content module**

Create `app/content/siteContent.js` with this structure:

```js
export const CMS_DRAFT_STORAGE_KEY = "fzl-kitchen-cms-draft";

export function assetPath(src) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/assets/${src}`;
}

export function buildWhatsAppUrl(phone, message) {
  const cleanPhone = String(phone || "").replace(/[^\d]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message || "")}`;
}

export function cloneSiteContent(content = siteContent) {
  return JSON.parse(JSON.stringify(content));
}

export const orderTemplateText = `Hai saya nak order

Hari:
Pukul:

Menu:
Quantity:

Air:
Quantity:`;

export const siteContent = {
  site: {
    brandName: "FZL Kitchen",
    phoneDisplay: "+60 11-2111 9575",
    phoneDial: "+601121119575",
    address: "13, Jalan Desa Jaya, Taman Desa, 58100, Wilayah Persekutuan Kuala Lumpur",
    operatingHoursLabel: "Waktu operasi",
    operatingHours: "12 tengahari - 11 malam",
    operatingDays: "Isnin - Sabtu",
    copyright: "\u00a9 2026 FZL Kitchen. All rights reserved.",
  },
  links: {
    whatsappPhone: "601121119575",
    whatsappMessage: "Hi, saya nak order.",
    orderTemplateText,
    mapsQuery:
      "4447 Barber Shop, Gerai No, 11, Jalan Desa Jaya, Taman Desa, 58100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia",
    foodpandaUrl: "https://www.foodpanda.my/restaurant/frgs/fzl-kitchen-nasi-ayam-geprek",
    grabFoodUrl:
      "https://food.grab.com/my/en/restaurant/fzl-kitchen-nasi-ayam-geprek-jalan-desa-jaya-delivery/1-C2TDLYWEEVCEVX?sourceID=20240922_225848_36F9FC230080450687C5DF5915A91D41_MEXMPS",
  },
  header: {
    logo: "fzl-kitchen-logo.webp",
    navItems: [
      { label: "Menu", target: "full-menu" },
      { label: "Cara Order", target: "it-works" },
      { label: "Social", target: "social" },
      { label: "FAQ", target: "faq" },
      { label: "Lokasi", target: "contact" },
    ],
    cta: { label: "WhatsApp Order", linkType: "whatsapp" },
  },
  hero: {
    eyebrow: "FZL KITCHEN TAMAN DESA",
    highlight: "Lapar?",
    headline: "Lunch break settle sini.",
    copy:
      "Ayam geprek, chicken chop dan burger ayam goreng cheese dekat Taman Desa. Sesuai untuk lunch, dinner, atau bila craving datang.",
    backgroundImage: "hero-ayam-geprek-straight.webp",
    bestSellers: [
      {
        src: "dish-ayam-geprek.webp",
        title: "Ayam Geprek",
        copy: "Pedas padu, ayam crispy, sambal kaw.",
        tag: "LUNCH PICK",
        note: "Pedas",
        orderMessage: "Hai, saya nak order Ayam Geprek.",
      },
      {
        src: "dish-chicken-chop.webp",
        title: "Chicken Chop",
        copy: "Western comfort food, portion puas hati.",
        tag: "SETTLE CRAVING",
        note: "Crispy",
        orderMessage: "Hai, saya nak order Chicken Chop.",
      },
      {
        src: "dish-burger-ayam-goreng-cheese.webp",
        title: "Burger Ayam Goreng Cheese",
        copy: "Ayam rangup, cheese leleh, puas makan.",
        tag: "COMFORT FOOD",
        note: "Cheesy",
        orderMessage: "Hai, saya nak order Burger Ayam Goreng Cheese.",
      },
    ],
    dishButtonLabel: "Order Sekarang",
  },
  catalogue: {
    eyebrow: "MENU",
    title: "Full menu, senang pilih.",
    copy: "Pilih makanan atau minuman, lepas tu terus WhatsApp order.",
    orderButtonLabel: "Order Dari Menu Ini",
    orderMessageTemplate: `Hai saya nak order dari menu {{type}}.

Hari:
Pukul:

Menu:
Quantity:

Air:
Quantity:`,
    items: {
      makanan: {
        label: "Makanan",
        src: "menu-makanan-sharp.webp",
        alt: "FZL Kitchen full food menu catalogue",
      },
      minuman: {
        label: "Minuman",
        src: "menu-minuman-sharp.webp",
        alt: "FZL Kitchen drinks menu catalogue",
      },
    },
  },
  process: {
    label: "Cara Order",
    title: "Pilih Menu, Kami Settle",
    steps: [
      { number: "01", title: "Pilih menu" },
      { number: "02", title: "Share quantity & date" },
      { number: "03", title: "Confirm dekat WhatsApp" },
    ],
    copy: "Bagitahu menu, hari, pukul dan quantity. Kami confirm dekat WhatsApp.",
    ctaLabel: "WhatsApp Order",
  },
  social: {
    icon: "at",
    headlinePrefix: "Follow",
    headlineStrong: "FZL Kitchen",
    copy: "Fresh menu drops, promos, and behind-the-scenes from our kitchen.",
    decorativeImages: {
      left: "social-chili.webp",
      right: "social-chicken.webp",
    },
    buttons: [
      { label: "TikTok", url: "https://www.tiktok.com/@fzl.kitchen", type: "tiktok", icon: "social-tiktok.webp" },
      { label: "Instagram", url: "https://www.instagram.com/fzl_kitchen/", type: "instagram", icon: "social-instagram.webp" },
      { label: "Facebook", url: "https://www.facebook.com/fzlkitchen/", type: "facebook", icon: "social-facebook.webp" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Got questions? we've got answers",
    image: "faq-fzl-stall.webp",
    imageAlt: "FZL Kitchen stall with menu board and seating",
    items: [
      {
        question: "Boleh order banyak-banyak tak?",
        answer:
          "Boleh. Office lunch, meeting, kelas, small event semua boleh bincang. WhatsApp je menu, quantity, tarikh dan masa.",
      },
      {
        question: "Macam mana nak order?",
        answer: "Tekan WhatsApp, bagitahu nak menu apa, berapa pax, hari dan pukul. Kami confirm balik sebelum masak.",
      },
      {
        question: "Boleh order dekat foodpanda atau GrabFood?",
        answer:
          "Boleh untuk order biasa. Kalau nak order banyak, catering kecil, atau request special, WhatsApp lagi senang.",
      },
      {
        question: "Ada pickup atau delivery?",
        answer: "Ada, ikut kawasan, masa dan jumlah order. Send location dekat WhatsApp, nanti kami check dan confirm.",
      },
      {
        question: "FZL Kitchen buka pukul berapa?",
        answer: "Kami buka 12 tengahari sampai 11 malam, Isnin sampai Sabtu. Kalau lapar, boleh terus roger.",
      },
    ],
  },
  contact: {
    eyebrow: "DAH LAPAR?",
    title: "Order sekarang, makan puas.",
    copy: "Pilih menu, order dekat platform favourite, atau WhatsApp kami terus. Lunch break settle, dinner pun ngam.",
    buttons: [
      { id: "whatsapp", label: "WhatsApp", type: "whatsapp", icon: "whatsapp" },
      { id: "foodpanda", label: "foodpanda", type: "foodpanda", icon: "foodpanda-logo.webp" },
      { id: "grabfood", label: "GrabFood", type: "grabfood", icon: "grabfood-icon.webp" },
    ],
    mapTitle: "FZL Kitchen Taman Desa location on Google Maps",
    mapLabel: "FZL Kitchen Taman Desa map",
  },
  footer: {
    logo: "fzl-kitchen-logo.webp",
    quickLinksTitle: "Quick links:",
    quickLinks: [
      { label: "Home", href: "#home" },
      { label: "Menu", href: "#full-menu" },
      { label: "Cara Order", href: "#it-works" },
      { label: "FAQs", href: "#faq" },
    ],
    socialTitle: "Social Media:",
    orderTitle: "Order:",
  },
  floatingWhatsApp: {
    label: "WhatsApp",
  },
};
```

- [ ] **Step 3: Verify module syntax**

Run:

```powershell
npm run build
```

Expected: The build may still use old `app/page.jsx`, but it should not fail because of `siteContent.js` syntax.

## Task 2: Connect Landing Page To Shared Content

**Files:**
- Modify: `app/page.jsx`

- [ ] **Step 1: Import content helpers**

At the top of `app/page.jsx`, after the `lucide-react` import, add:

```js
import { assetPath, buildWhatsAppUrl, siteContent } from "./content/siteContent";
```

- [ ] **Step 2: Replace visible content constants with derived content**

Remove the visible-only constants for `whatsappUrl`, `orderTemplateText`, `orderTemplateUrl`, `phoneUrl`, `mapsQuery`, `mapsUrl`, `mapsEmbedUrl`, `foodpandaUrl`, `grabFoodUrl`, `catalogueOrderUrl`, `socialLinks`, `bestSellers`, `steps`, and `faqs`.

Replace them with:

```js
const content = siteContent;
const encodedMapsQuery = encodeURIComponent(content.links.mapsQuery);
const whatsappUrl = buildWhatsAppUrl(content.links.whatsappPhone, content.links.whatsappMessage);
const orderTemplateUrl = buildWhatsAppUrl(content.links.whatsappPhone, content.links.orderTemplateText);
const phoneUrl = `tel:${content.site.phoneDial}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedMapsQuery}`;
const mapsEmbedUrl = `https://www.google.com/maps?q=${encodedMapsQuery}&output=embed`;
const foodpandaUrl = content.links.foodpandaUrl;
const grabFoodUrl = content.links.grabFoodUrl;
const catalogueOrderUrl = (type) =>
  buildWhatsAppUrl(content.links.whatsappPhone, content.catalogue.orderMessageTemplate.replace("{{type}}", type));
const bestSellers = content.hero.bestSellers;
const steps = content.process.steps;
const faqs = content.faq.items;
```

Keep the hidden `services`, `works`, `plans`, and `testimonials` constants unchanged for this task because those hidden legacy sections are out of scope.

- [ ] **Step 3: Update image helper components**

Change `AssetImage`, `BrandLogo`, and `SocialIcon` to use `assetPath`:

```jsx
function AssetImage({ src, alt, className = "" }) {
  return <img className={className} src={assetPath(src)} alt={alt} loading="eager" />;
}

function BrandLogo({ src, alt, className = "" }) {
  return <img className={`brand-logo ${className}`} src={assetPath(src)} alt={alt} loading="eager" />;
}

function SocialIcon({ src, alt }) {
  return <img src={assetPath(src)} alt={alt} loading="eager" />;
}
```

- [ ] **Step 4: Replace header content reads**

In the header:

```jsx
<AssetImage src={content.header.logo} alt={content.site.brandName} />
```

Render nav items with:

```jsx
{content.header.navItems.map((item) => (
  <a
    href={`#${item.target}`}
    className={navClass(item.target)}
    onClick={(event) => handleNavClick(event, item.target)}
    key={item.target}
  >
    {item.label}
  </a>
))}
```

Use `content.header.cta.label` for the nav CTA text.

- [ ] **Step 5: Replace hero and best seller reads**

In the hero section, pass the background image through a CSS custom property and use shared copy:

```jsx
<section
  id="menu"
  className="hero food-hero container"
  style={{ "--hero-bg-image": `url("${assetPath(content.hero.backgroundImage)}")` }}
>
<p className="eyebrow">{content.hero.eyebrow}</p>
<h1><span className="hero-highlight">{content.hero.highlight}</span>{content.hero.headline}</h1>
<p className="hero-copy">{content.hero.copy}</p>
```

For each dish card order link:

```jsx
href={buildWhatsAppUrl(content.links.whatsappPhone, dish.orderMessage)}
```

Use `content.hero.dishButtonLabel` for the dish button text.

- [ ] **Step 6: Replace catalogue reads**

Inside `Home`, replace the hardcoded `catalogue` object with:

```js
const catalogue = content.catalogue.items;
```

Render section copy from `content.catalogue.eyebrow`, `content.catalogue.title`, and `content.catalogue.copy`. Use `content.catalogue.orderButtonLabel` for the catalogue CTA.

- [ ] **Step 7: Replace process, social, FAQ, contact, footer reads**

Use these mappings:

```jsx
content.process.label
content.process.title
content.process.copy
content.process.ctaLabel
content.social.headlinePrefix
content.social.headlineStrong
content.social.copy
content.social.buttons
content.social.decorativeImages.left
content.social.decorativeImages.right
content.faq.eyebrow
content.faq.title
content.faq.image
content.faq.imageAlt
content.contact.eyebrow
content.contact.title
content.contact.copy
content.contact.buttons
content.contact.mapLabel
content.contact.mapTitle
content.footer.logo
content.site.operatingHoursLabel
content.site.operatingHours
content.site.operatingDays
content.footer.quickLinksTitle
content.footer.quickLinks
content.footer.socialTitle
content.footer.orderTitle
content.site.phoneDisplay
content.site.address
content.site.copyright
content.floatingWhatsApp.label
```

For footer social links, map `content.social.buttons`.

In the social section, pass decorative assets through CSS custom properties:

```jsx
<section
  id="social"
  className="container social-section"
  style={{
    "--social-left-image": `url("${assetPath(content.social.decorativeImages.left)}")`,
    "--social-right-image": `url("${assetPath(content.social.decorativeImages.right)}")`,
  }}
>
```

- [ ] **Step 8: Update CSS-backed landing images**

In `app/globals.css`, change the hardcoded hero and social decorative image URLs:

```css
.food-hero::before {
  background:
    linear-gradient(90deg, rgba(16, 16, 16, 0.76) 0%, rgba(16, 16, 16, 0.18) 36%, rgba(16, 16, 16, 0.04) 100%),
    var(--hero-bg-image, url("/assets/hero-ayam-geprek-straight.webp")) center / cover no-repeat;
}

.social-section::before {
  background: var(--social-left-image, url("/assets/social-chili.webp")) center / contain no-repeat;
}

.social-section::after {
  background: var(--social-right-image, url("/assets/social-chicken.webp")) center / contain no-repeat;
}
```

- [ ] **Step 9: Verify public page still builds**

Run:

```powershell
npm run build
```

Expected: Build succeeds and `out` is generated.

## Task 3: Build CMS Editor Route

**Files:**
- Create: `app/cms/page.jsx`

- [ ] **Step 1: Add CMS imports and constants**

Create `app/cms/page.jsx` starting with:

```jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import {
  CMS_DRAFT_STORAGE_KEY,
  assetPath,
  cloneSiteContent,
  siteContent,
} from "../content/siteContent";

const sections = [
  { id: "site", label: "Site Settings" },
  { id: "header", label: "Header" },
  { id: "hero", label: "Hero & Best Sellers" },
  { id: "catalogue", label: "Full Menu" },
  { id: "process", label: "Cara Order" },
  { id: "social", label: "Follow FZL Kitchen" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact & Ordering" },
  { id: "footer", label: "Footer" },
];
```

- [ ] **Step 2: Add state helpers**

Add these helper functions below the constants:

```jsx
function setDeepValue(source, path, value) {
  const next = cloneSiteContent(source);
  let cursor = next;
  path.slice(0, -1).forEach((key) => {
    cursor = cursor[key];
  });
  cursor[path[path.length - 1]] = value;
  return next;
}

function replaceArrayItem(source, path, index, item) {
  const next = cloneSiteContent(source);
  let cursor = next;
  path.forEach((key) => {
    cursor = cursor[key];
  });
  cursor[index] = item;
  return next;
}

function addArrayItem(source, path, item) {
  const next = cloneSiteContent(source);
  let cursor = next;
  path.forEach((key) => {
    cursor = cursor[key];
  });
  cursor.push(item);
  return next;
}

function removeArrayItem(source, path, index) {
  const next = cloneSiteContent(source);
  let cursor = next;
  path.forEach((key) => {
    cursor = cursor[key];
  });
  cursor.splice(index, 1);
  return next;
}

function isInvalidUrl(value) {
  if (!value) return false;
  return !/^(https?:\/\/|#|tel:|mailto:)/.test(value);
}
```

- [ ] **Step 3: Add reusable form components**

Add compact components in the same file:

```jsx
function Field({ label, value, onChange, type = "text", multiline = false, invalid = false, hint }) {
  return (
    <label className={`cms-field ${invalid ? "invalid" : ""}`}>
      <span>{label}</span>
      {multiline ? (
        <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input value={value || ""} onChange={(event) => onChange(event.target.value)} type={type} />
      )}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function ImageField({ label, value, onChange }) {
  const preview = assetPath(value);
  return (
    <div className="cms-image-field">
      <Field label={label} value={value} onChange={onChange} />
      <div className="cms-image-preview">
        {preview ? <img src={preview} alt="" onError={(event) => event.currentTarget.classList.add("broken")} /> : <ImageIcon size={22} />}
      </div>
    </div>
  );
}

function SectionPanel({ title, children }) {
  return (
    <section className="cms-panel">
      <h2>{title}</h2>
      <div className="cms-panel-grid">{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: Add the main CMS component shell**

Add:

```jsx
export default function CmsPage() {
  const [activeSection, setActiveSection] = useState("site");
  const [content, setContent] = useState(() => cloneSiteContent(siteContent));
  const [status, setStatus] = useState("Draft not saved");

  useEffect(() => {
    const draft = window.localStorage.getItem(CMS_DRAFT_STORAGE_KEY);
    if (!draft) return;
    try {
      setContent(JSON.parse(draft));
      setStatus("Loaded local draft");
    } catch {
      setStatus("Could not load local draft");
    }
  }, []);

  const requiredIssues = useMemo(() => {
    const issues = [];
    if (!content.site.brandName) issues.push("Brand name is required.");
    content.hero.bestSellers.forEach((item, index) => {
      if (!item.title) issues.push(`Best seller ${index + 1} needs a title.`);
    });
    content.social.buttons.forEach((item, index) => {
      if (!item.label) issues.push(`Social button ${index + 1} needs a label.`);
      if (isInvalidUrl(item.url)) issues.push(`Social button ${index + 1} has an invalid URL.`);
    });
    content.faq.items.forEach((item, index) => {
      if (!item.question) issues.push(`FAQ ${index + 1} needs a question.`);
    });
    return issues;
  }, [content]);

  const update = (path, value) => setContent((current) => setDeepValue(current, path, value));
  const saveDraft = () => {
    if (requiredIssues.length) {
      setStatus("Fix required fields before saving");
      return;
    }
    window.localStorage.setItem(CMS_DRAFT_STORAGE_KEY, JSON.stringify(content));
    setStatus("Draft saved locally");
  };
  const resetDraft = () => {
    window.localStorage.removeItem(CMS_DRAFT_STORAGE_KEY);
    setContent(cloneSiteContent(siteContent));
    setStatus("Reset to default content");
  };

  return (
    <main className="cms-shell">
      <header className="cms-topbar">
        <div>
          <p>FZL Kitchen CMS</p>
          <h1>Landing Page Editor</h1>
        </div>
        <div className="cms-actions">
          <span className={requiredIssues.length ? "cms-status warning" : "cms-status"}>{status}</span>
          <a className="cms-button ghost" href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> Preview</a>
          <button className="cms-button ghost" type="button" onClick={resetDraft}><RotateCcw size={16} /> Reset</button>
          <button className="cms-button" type="button" onClick={saveDraft}><Save size={16} /> Save Draft</button>
        </div>
      </header>
      <div className="cms-layout">
        <aside className="cms-sidebar">
          {sections.map((section) => (
            <button
              className={activeSection === section.id ? "active" : ""}
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </aside>
        <div className="cms-main">
          {requiredIssues.length ? (
            <div className="cms-alert">
              <AlertCircle size={18} />
              <span>{requiredIssues[0]}</span>
            </div>
          ) : null}
          {renderSection(activeSection, content, update, setContent)}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Add `renderSection` with all section editors**

Add a `renderSection(activeSection, content, update, setContent)` function that switches over all section IDs. Implement each section with `SectionPanel`, `Field`, `ImageField`, and repeated cards. Required repeatable operations:

```jsx
setContent((current) => addArrayItem(current, ["hero", "bestSellers"], {
  src: "dish-ayam-geprek.webp",
  title: "New Dish",
  copy: "Short description.",
  tag: "NEW",
  note: "",
  orderMessage: "Hai, saya nak order New Dish.",
}));

setContent((current) => removeArrayItem(current, ["hero", "bestSellers"], index));

setContent((current) => addArrayItem(current, ["social", "buttons"], {
  label: "New Link",
  url: "https://example.com",
  type: "custom",
  icon: "social-instagram.webp",
}));

setContent((current) => removeArrayItem(current, ["social", "buttons"], index));

setContent((current) => addArrayItem(current, ["faq", "items"], {
  question: "New question?",
  answer: "New answer.",
}));

setContent((current) => removeArrayItem(current, ["faq", "items"], index));
```

For object-keyed catalogue items, update `content.catalogue.items.makanan` and `content.catalogue.items.minuman` directly through `update(["catalogue", "items", "makanan", "label"], value)` and equivalent paths.

- [ ] **Step 6: Verify `/cms` compiles**

Run:

```powershell
npm run build
```

Expected: Build succeeds and includes the `/cms` static route.

## Task 4: Add CMS Styles

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append scoped CMS styles**

Append styles under the existing CSS:

```css
.cms-shell {
  min-height: 100vh;
  background: #111111;
  color: var(--ink);
  padding: 24px;
}

.cms-topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 20px;
  border: 1px solid rgba(255, 248, 237, 0.14);
  border-radius: var(--radius);
  background: rgba(24, 24, 24, 0.94);
  backdrop-filter: blur(14px);
}

.cms-topbar p,
.cms-topbar h1 {
  margin: 0;
}

.cms-topbar p {
  color: var(--yellow);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.cms-topbar h1 {
  font-size: 28px;
}

.cms-actions,
.cms-button,
.cms-layout,
.cms-alert,
.cms-card-header {
  display: flex;
  align-items: center;
}

.cms-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.cms-status {
  color: var(--muted);
  font-size: 14px;
}

.cms-status.warning {
  color: #ffcf66;
}

.cms-button {
  min-height: 40px;
  gap: 8px;
  padding: 0 14px;
  border: 0;
  border-radius: var(--radius);
  background: var(--yellow);
  color: var(--bg);
  cursor: pointer;
  font-weight: 800;
}

.cms-button.ghost {
  border: 1px solid rgba(255, 248, 237, 0.16);
  background: rgba(255, 248, 237, 0.06);
  color: var(--ink);
}

.cms-layout {
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

.cms-sidebar {
  position: sticky;
  top: 104px;
  display: grid;
  width: 240px;
  flex: 0 0 240px;
  gap: 8px;
}

.cms-sidebar button {
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid rgba(255, 248, 237, 0.12);
  border-radius: var(--radius);
  background: rgba(255, 248, 237, 0.04);
  color: var(--muted);
  cursor: pointer;
  font-weight: 800;
  text-align: left;
}

.cms-sidebar button.active {
  background: var(--yellow);
  color: var(--bg);
}

.cms-main {
  display: grid;
  flex: 1;
  gap: 16px;
  min-width: 0;
}

.cms-alert {
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 201, 40, 0.3);
  border-radius: var(--radius);
  background: rgba(255, 201, 40, 0.08);
  color: #ffe3a0;
}

.cms-panel {
  padding: 24px;
  border: 1px solid rgba(255, 248, 237, 0.14);
  border-radius: var(--radius);
  background: var(--panel);
}

.cms-panel h2 {
  margin-bottom: 22px;
  font-size: 30px;
}

.cms-panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.cms-field {
  display: grid;
  gap: 8px;
}

.cms-field span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
}

.cms-field input,
.cms-field textarea {
  width: 100%;
  border: 1px solid rgba(255, 248, 237, 0.16);
  border-radius: var(--radius);
  background: rgba(16, 16, 16, 0.62);
  color: var(--ink);
  font: inherit;
  padding: 12px;
}

.cms-field textarea {
  resize: vertical;
}

.cms-field.invalid input,
.cms-field.invalid textarea {
  border-color: var(--red);
}

.cms-field small {
  color: var(--muted);
}

.cms-image-field {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px;
  gap: 12px;
  align-items: end;
}

.cms-image-preview {
  display: grid;
  height: 82px;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 248, 237, 0.14);
  border-radius: var(--radius);
  background: rgba(16, 16, 16, 0.44);
}

.cms-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cms-image-preview img.broken {
  display: none;
}

.cms-repeat-list {
  display: grid;
  grid-column: 1 / -1;
  gap: 14px;
}

.cms-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(255, 248, 237, 0.12);
  border-radius: var(--radius);
  background: rgba(16, 16, 16, 0.34);
}

.cms-card-header {
  justify-content: space-between;
  gap: 12px;
}

.cms-card-header h3 {
  margin: 0;
  font-size: 20px;
}

.cms-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.cms-icon-button {
  display: inline-grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgba(255, 248, 237, 0.16);
  border-radius: var(--radius);
  background: rgba(255, 248, 237, 0.06);
  color: var(--ink);
  cursor: pointer;
}

@media (max-width: 900px) {
  .cms-shell {
    padding: 16px;
  }

  .cms-topbar,
  .cms-layout {
    display: grid;
  }

  .cms-actions {
    justify-content: flex-start;
  }

  .cms-sidebar {
    position: static;
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cms-panel-grid,
  .cms-card-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .cms-sidebar {
    grid-template-columns: 1fr;
  }

  .cms-image-field {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Verify styling does not break landing build**

Run:

```powershell
npm run build
```

Expected: Build succeeds.

## Task 5: Manual Functional Verification

**Files:**
- No code changes expected.

- [ ] **Step 1: Start local dev server**

Run:

```powershell
npm run dev
```

Expected: Next dev server starts and prints a local URL, usually `http://localhost:3000`.

- [ ] **Step 2: Verify public landing page**

Open:

```text
http://localhost:3000/
```

Expected:

- Header renders with logo and nav.
- Hero, menu, process, social, FAQ, contact, footer, and floating WhatsApp still appear.
- No visible legacy Vidhub sections appear.

- [ ] **Step 3: Verify CMS route**

Open:

```text
http://localhost:3000/cms
```

Expected:

- CMS page loads.
- Sidebar section buttons switch editor panels.
- Image previews appear for existing asset filenames.

- [ ] **Step 4: Verify repeatable editors**

In `/cms`:

- Add one best seller card.
- Add one social button.
- Add one FAQ item.
- Remove the added best seller card.
- Remove the added social button.
- Remove the added FAQ item.

Expected: The UI updates immediately without console errors.

- [ ] **Step 5: Verify save/reset**

In `/cms`:

- Change `site.brandName` to `FZL Kitchen Test`.
- Click **Save Draft**.
- Reload `/cms`.
- Confirm the changed value remains.
- Click **Reset**.
- Reload `/cms`.
- Confirm the value returns to `FZL Kitchen`.

Expected: `localStorage` draft behavior works.

- [ ] **Step 6: Verify invalid URL validation**

In `/cms`, change a social URL to:

```text
instagram.com/no-protocol
```

Click **Save Draft**.

Expected: Save is blocked and the status/alert asks for required fields or URL fixes.

## Task 6: Production Verification

**Files:**
- No code changes expected unless verification reveals a bug.

- [ ] **Step 1: Run production build**

Run:

```powershell
npm run build
```

Expected: Build succeeds with static export output in `out`.

- [ ] **Step 2: Confirm exported CMS output exists**

Run:

```powershell
Test-Path out\cms.html; Test-Path out\cms\index.html
```

Expected: At least one command returns `True`, depending on the Next static export output shape.

- [ ] **Step 3: Record any known limitation**

Expected limitation for this phase:

```text
The /cms page saves only to browser localStorage. It does not publish changes to the public landing page until the database/API phase is implemented.
```

Include this limitation in the final implementation summary.
