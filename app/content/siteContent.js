export const CMS_DRAFT_STORAGE_KEY = "fzl-kitchen-cms-draft";
export const CMS_SESSION_STORAGE_KEY = "fzl-kitchen-cms-session";

export const orderTemplateText = `Hai saya nak order

Hari:
Pukul:

Menu:
Quantity:

Air:
Quantity:`;

export const assetOptions = [
  "fzl-kitchen-logo.webp",
  "hero-ayam-geprek-straight.webp",
  "dish-ayam-geprek.webp",
  "dish-chicken-chop.webp",
  "dish-burger-ayam-goreng-cheese.webp",
  "menu-makanan-sharp.webp",
  "menu-minuman-sharp.webp",
  "faq-fzl-stall.webp",
  "social-tiktok.webp",
  "social-instagram.webp",
  "social-facebook.webp",
  "social-chili.webp",
  "social-chicken.webp",
  "foodpanda-logo.webp",
  "grabfood-icon.webp",
];

export function assetPath(src) {
  if (!src) return "";
  if (src.startsWith("data:image/") || src.startsWith("blob:")) {
    return src;
  }
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }

  return `/assets/${src}`;
}

export function updateFavicon(src) {
  if (typeof document === "undefined") return;

  const href = assetPath(src || siteContent.header.logo);
  const iconRels = ["icon", "shortcut icon", "apple-touch-icon"];

  iconRels.forEach((rel) => {
    let link = document.querySelector(`link[rel="${rel}"]`);

    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      document.head.appendChild(link);
    }

    link.setAttribute("href", href);
  });
}

export function buildWhatsAppUrl(phone, message) {
  const cleanPhone = String(phone || "").replace(/[^\d]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message || "")}`;
}

export function cloneSiteContent(content = siteContent) {
  return JSON.parse(JSON.stringify(content));
}

export async function fetchPublishedContent() {
  const response = await fetch("/api/cms/content", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Could not load saved website content.");
  }

  return result.content ? cloneSiteContent(result.content) : null;
}

export async function savePublishedContent(content, token) {
  const response = await fetch("/api/cms/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify({ content }),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Could not save website content.");
  }

  return result;
}

export async function uploadCmsImage(dataUrl, filename, token) {
  const response = await fetch("/api/cms/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify({ dataUrl, filename }),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.ok || !result.url) {
    throw new Error(result.error || "Could not upload image.");
  }

  return result.url;
}

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
    cta: { label: "WhatsApp Order" },
  },
  hero: {
    eyebrow: "FZL KITCHEN TAMAN DESA",
    highlight: "Lapar?",
    headline: "Lunch break settle sini.",
    copy:
      "Ayam geprek, chicken chop dan burger ayam goreng cheese dekat Taman Desa. Sesuai untuk lunch, dinner, atau bila craving datang.",
    backgroundImage: "hero-ayam-geprek-straight.webp",
    dishButtonLabel: "Order Sekarang",
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
