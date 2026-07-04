"use client";

import { useEffect, useRef, useState } from "react";
import {
  AtSign,
  ChevronDown,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";
import {
  CMS_DRAFT_STORAGE_KEY,
  assetPath,
  buildWhatsAppUrl,
  cloneSiteContent,
  siteContent,
  updateFavicon,
} from "./content/siteContent";

const whatsappUrl = "https://wa.me/601121119575?text=Hi%2C%20saya%20nak%20order.";
const orderTemplateText = `Hai saya nak order

Hari:
Pukul:

Menu:
Quantity:

Air:
Quantity:`;
const orderTemplateUrl = `https://wa.me/601121119575?text=${encodeURIComponent(orderTemplateText)}`;
const phoneUrl = "tel:+601121119575";
const mapsQuery = "4447%20Barber%20Shop%2C%20Gerai%20No%2C%2011%2C%20Jalan%20Desa%20Jaya%2C%20Taman%20Desa%2C%2058100%20Kuala%20Lumpur%2C%20Wilayah%20Persekutuan%20Kuala%20Lumpur%2C%20Malaysia";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
const foodpandaUrl = "https://www.foodpanda.my/restaurant/frgs/fzl-kitchen-nasi-ayam-geprek";
const grabFoodUrl = "https://food.grab.com/my/en/restaurant/fzl-kitchen-nasi-ayam-geprek-jalan-desa-jaya-delivery/1-C2TDLYWEEVCEVX?sourceID=20240922_225848_36F9FC230080450687C5DF5915A91D41_MEXMPS";
const catalogueOrderUrl = (type) => `https://wa.me/601121119575?text=${encodeURIComponent(`Hai saya nak order dari menu ${type}.

Hari:
Pukul:

Menu:
Quantity:

Air:
Quantity:`)}`;
const socialLinks = [
  ["TikTok", "https://www.tiktok.com/@fzl.kitchen", "tiktok", "social-tiktok.webp"],
  ["Instagram", "https://www.instagram.com/fzl_kitchen/", "instagram", "social-instagram.webp"],
  ["Facebook", "https://www.facebook.com/fzlkitchen/", "facebook", "social-facebook.webp"],
];

const bestSellers = [
  {
    src: "dish-ayam-geprek.webp",
    title: "Ayam Geprek",
    copy: "Pedas padu, ayam crispy, sambal kaw.",
    tag: "LUNCH PICK",
    note: "Pedas",
    orderUrl: "https://wa.me/601121119575?text=Hai%2C%20saya%20nak%20order%20Ayam%20Geprek.",
  },
  {
    src: "dish-chicken-chop.webp",
    title: "Chicken Chop",
    copy: "Western comfort food, portion puas hati.",
    tag: "SETTLE CRAVING",
    note: "Crispy",
    orderUrl: "https://wa.me/601121119575?text=Hai%2C%20saya%20nak%20order%20Chicken%20Chop.",
  },
  {
    src: "dish-burger-ayam-goreng-cheese.webp",
    title: "Burger Ayam Goreng Cheese",
    copy: "Ayam rangup, cheese leleh, puas makan.",
    tag: "COMFORT FOOD",
    note: "Cheesy",
    orderUrl: "https://wa.me/601121119575?text=Hai%2C%20saya%20nak%20order%20Burger%20Ayam%20Goreng%20Cheese.",
  },
];

const services = [
  ["icon-edit.svg", "Video editing", "Clean, engaging edits crafted to tell your story with precision and purpose."],
  ["icon-color.svg", "Color grading", "Cinematic color and balanced tones that enhance every frame."],
  ["icon-motion.svg", "Motion graphics", "Custom animations, logo reveals, and dynamic visuals that elevate content."],
  ["icon-sound.svg", "Sound design", "Professional audio mixing, sound effects, and dialogue enhancement."],
  ["icon-social.svg", "Social media content", "Professional editing that enhances narrative and visual impact."],
  ["icon-corporate.svg", "Corporate videos", "Professional videos that communicate your brand clearly and effectively."],
];

const works = [
  ["project-desert-video.webp", "Desert Drive Campaign", "2023"],
  ["hero-brand-campaign.webp", "Urban Night Film", "2024"],
  ["project-corporate-video.webp", "Corporate Portrait Film", "2024"],
  ["project-fashion-video.webp", "Fashion Street Edit", "2025"],
  ["project-beauty-video.webp", "Beauty Close-Up Campaign", "2025"],
  ["project-color-video.webp", "Creative Color Story", "2026"],
];

const steps = [
  ["01", "Pilih menu"],
  ["02", "Share quantity & date"],
  ["03", "Confirm dekat WhatsApp"],
];

const plans = [
  {
    name: "Starter",
    price: "$999",
    copy: "Perfect for creators and small teams starting their video journey.",
    items: [
      "One active editing request",
      "Smooth transitions & clean cuts",
      "Brand-consistent editing style",
      "Motion graphics & basic animations",
      "24-72 hour average turnaround",
      "Dedicated video editor",
      "Daily project updates",
      "Color correction & sound design",
    ],
  },
  {
    name: "Pro",
    price: "$1599",
    badge: "Popular",
    copy: "Ideal for creators and small teams getting started with video.",
    items: [
      "One active editing request",
      "Unlimited revisions",
      "Color correction & sound design",
      "Motion graphics & basic animations",
      "24-72 hour average turnaround",
      "Dedicated video editor",
      "Visual consistency across videos",
      "Platform-optimized formats (YouTube, Reels, TikTok)",
    ],
  },
];

const testimonials = [
  ["testimonial-alex.webp", "Alex Morgan", "Marketing manager", "Vidhub consistently delivers high-quality edits that elevate our content. Fast, reliable, and incredibly creative."],
  ["testimonial-sophie.webp", "Sophie Lee", "Creative director", "Our videos look more cinematic than ever. The team understands our brand perfectly."],
  ["testimonial-daniel.webp", "Daniel Carter", "Startup founder", "Working with Vidhub has saved us hours. The workflow is smooth and the results are outstanding."],
  ["testimonial-maria.webp", "Maria Gomez", "Content lead", "Top-tier editing and motion graphics. Highly recommend for any brand serious about video."],
  ["testimonial-james.webp", "James Wilson", "YouTube creator", "Professional, responsive, reliable, creative, and extremely talented. Exactly what we needed."],
  ["testimonial-olivia.webp", "Olivia Chen", "E-commerce manager", "Every project feels polished, professional, and on-brand. Vidhub is our reliable go-to editing partner."],
];

const faqs = [
  ["Boleh order banyak-banyak tak?", "Boleh. Office lunch, meeting, kelas, small event semua boleh bincang. WhatsApp je menu, quantity, tarikh dan masa."],
  ["Macam mana nak order?", "Tekan WhatsApp, bagitahu nak menu apa, berapa pax, hari dan pukul. Kami confirm balik sebelum masak."],
  ["Boleh order dekat foodpanda atau GrabFood?", "Boleh untuk order biasa. Kalau nak order banyak, catering kecil, atau request special, WhatsApp lagi senang."],
  ["Ada pickup atau delivery?", "Ada, ikut kawasan, masa dan jumlah order. Send location dekat WhatsApp, nanti kami check dan confirm."],
  ["FZL Kitchen buka pukul berapa?", "Kami buka 12 tengahari sampai 11 malam, Isnin sampai Sabtu. Kalau lapar, boleh terus roger."],
];

function AssetImage({ src, alt, className = "" }) {
  return <img className={className} src={assetPath(src)} alt={alt} loading="eager" />;
}

function BrandLogo({ src, alt, className = "" }) {
  return <img className={`brand-logo ${className}`} src={assetPath(src)} alt={alt} loading="eager" />;
}

function WhatsAppIcon({ size = 18, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 478.165 478.165"
      className={className}
      width={size}
      height={size}
      fill="none"
    >
      <path
        fill="currentColor"
        d="M478.165 232.946c0 128.567-105.057 232.966-234.679 232.966-41.102 0-79.814-10.599-113.445-28.969L0 478.165l42.437-125.04c-21.438-35.065-33.77-76.207-33.77-120.159C8.667 104.34 113.763 0 243.485 0 373.108 0 478.165 104.34 478.165 232.946ZM243.485 37.098c-108.802 0-197.422 87.803-197.422 195.868 0 42.915 13.986 82.603 37.576 114.879l-24.586 72.542 75.849-23.968c31.121 20.481 68.457 32.296 108.583 32.296 108.723 0 197.323-87.843 197.323-195.908 0-107.886-88.6-195.709-197.323-195.709Zm118.446 249.522c-1.395-2.331-5.22-3.746-10.898-6.814-5.917-2.849-34.089-16.497-39.508-18.37-5.16-1.913-8.986-2.849-12.811 2.829-4.005 5.638-14.903 18.629-18.23 22.354-3.546 3.785-6.854 4.264-12.552 1.435-5.618-2.809-24.267-8.866-46.203-28.391-17.055-15.042-28.67-33.711-31.997-39.508-3.427-5.758-.398-8.826 2.471-11.635 2.69-2.59 5.778-6.734 8.627-10.041 2.969-3.287 3.905-5.638 5.798-9.424 1.913-3.905.936-7.192-.478-10.141-1.415-2.849-13.01-30.881-17.752-42.337-4.841-11.416-9.543-9.523-12.871-9.523-3.467 0-7.212-.478-11.117-.478-3.785 0-10.041 1.395-15.381 7.192-5.2 5.658-20.123 19.465-20.123 47.597 0 28.052 20.601 55.308 23.55 59.053 2.869 3.785 39.747 63.197 98.303 86.07 58.476 22.872 58.476 15.321 69.115 14.365 10.38-.956 34.069-13.867 38.811-27.096 4.66-13.45 4.66-24.766 3.246-27.137Z"
      />
    </svg>
  );
}

function SocialIcon({ src, alt }) {
  return <img src={assetPath(src)} alt={alt} loading="eager" />;
}

function FloatingWhatsApp({ content, whatsappUrl }) {
  return (
    <div className="floating-whatsapp">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="floating-whatsapp-link"
      >
        <span className="floating-whatsapp-label">{content.floatingWhatsApp.label}</span>
        <span className="floating-whatsapp-button">
          <WhatsAppIcon size={28} />
        </span>
      </a>
    </div>
  );
}

function SectionTitle({ eyebrow, title, copy, align = "center" }) {
  return (
    <div className={`section-title ${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy ? <p className="title-copy">{copy}</p> : null}
    </div>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [activeCatalogue, setActiveCatalogue] = useState("makanan");
  const [processProgress, setProcessProgress] = useState(0);
  const [content, setContent] = useState(() => cloneSiteContent(siteContent));
  const navClickLockUntil = useRef(0);
  const catalogue = content.catalogue.items;
  const activeCatalogueItem = catalogue[activeCatalogue];
  const encodedMapsQuery = encodeURIComponent(content.links.mapsQuery);
  const currentWhatsappUrl = buildWhatsAppUrl(content.links.whatsappPhone, content.links.whatsappMessage);
  const currentOrderTemplateUrl = buildWhatsAppUrl(content.links.whatsappPhone, content.links.orderTemplateText);
  const currentPhoneUrl = `tel:${content.site.phoneDial}`;
  const currentMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedMapsQuery}`;
  const currentMapsEmbedUrl = `https://www.google.com/maps?q=${encodedMapsQuery}&output=embed`;
  const currentCatalogueOrderUrl = (type) =>
    buildWhatsAppUrl(content.links.whatsappPhone, content.catalogue.orderMessageTemplate.replace("{{type}}", type));

  const closeMenu = () => setMenuOpen(false);
  const sectionIds = content.header.navItems.map((item) => item.target);
  const navClass = (sectionId) => (activeSection === sectionId ? "active" : "");
  const handleNavClick = (event, sectionId) => {
    event.preventDefault();
    navClickLockUntil.current = Date.now() + 1200;
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${sectionId}`);
    closeMenu();
  };
  const handleLogoClick = (event) => {
    event.preventDefault();
    navClickLockUntil.current = Date.now() + 900;
    setActiveSection("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", window.location.pathname);
    closeMenu();
  };

  useEffect(() => {
    try {
      const draft = window.localStorage.getItem(CMS_DRAFT_STORAGE_KEY);
      if (draft) {
        setContent(JSON.parse(draft));
      }
    } catch {
      setContent(cloneSiteContent(siteContent));
    }
  }, []);

  useEffect(() => {
    updateFavicon(content.header.logo);
  }, [content.header.logo]);

  useEffect(() => {
    const updateHeader = () => {
      setHeaderScrolled(window.scrollY > 20);

      if (Date.now() >= navClickLockUntil.current && window.scrollY < 180) {
        setActiveSection("");
      }
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      if (Date.now() < navClickLockUntil.current) {
        return;
      }

      const scrollPosition = window.scrollY + 220;
      let currentSection = "";

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);
        if (!section) continue;

        if (section.offsetTop <= scrollPosition) {
          currentSection = sectionId;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    const updateProcessProgress = () => {
      const section = document.getElementById("it-works");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isDesktop = window.matchMedia("(min-width: 901px)").matches;
      const start = viewportHeight * 0.72;
      const end = -rect.height * 0.18;
      const sensitivity = isDesktop ? 1.45 : 1.2;
      const progress = ((start - rect.top) / (start - end)) * sensitivity;

      setProcessProgress(Math.min(1, Math.max(0, progress)));
    };

    let frame = 0;
    const handleScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateProcessProgress);
    };

    updateProcessProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      <header className={`site-header ${headerScrolled || menuOpen ? "scrolled" : ""}`}>
        <a className="logo" href="#home" aria-label={`${content.site.brandName} home`} onClick={handleLogoClick}>
          <AssetImage src={content.header.logo} alt={content.site.brandName} />
        </a>
        <nav className={menuOpen ? "open" : ""}>
          {content.header.navItems.map((item) => (
            <a href={`#${item.target}`} className={navClass(item.target)} onClick={(event) => handleNavClick(event, item.target)} key={item.target}>
              {item.label}
            </a>
          ))}
          <a href={currentWhatsappUrl} className="button dark nav-cta" target="_blank" rel="noreferrer" onClick={closeMenu}>
            <WhatsAppIcon size={20} />
            {content.header.cta.label}
          </a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main id="home">
        <section
          id="menu"
          className="hero food-hero container"
          style={{ "--hero-bg-image": `url("${assetPath(content.hero.backgroundImage)}")` }}
        >
          <div className="food-hero-content">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1><span className="hero-highlight">{content.hero.highlight}</span>{content.hero.headline}</h1>
            <p className="hero-copy">{content.hero.copy}</p>
          </div>

          <div className="dish-grid" aria-label="Three best sellers">
            {content.hero.bestSellers.map((dish) => (
              <article className="dish-card" key={dish.title}>
                <div className="dish-image">
                  <AssetImage src={dish.src} alt={dish.title} />
                  <span className="dish-badge">{dish.tag}</span>
                </div>
                <div className="dish-body">
                  <h2>{dish.title}</h2>
                  <p>{dish.copy}</p>
                  <a className="button dish-button" href={buildWhatsAppUrl(content.links.whatsappPhone, dish.orderMessage)} target="_blank" rel="noreferrer">
                    <WhatsAppIcon size={18} />
                    {content.hero.dishButtonLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="full-menu" className="container catalogue-section">
          <div className="catalogue-head">
            <p className="eyebrow">{content.catalogue.eyebrow}</p>
            <h2>{content.catalogue.title}</h2>
            <p>{content.catalogue.copy}</p>
          </div>

          <div className="catalogue-tabs" role="tablist" aria-label="FZL Kitchen menu catalogue">
            {Object.entries(catalogue).map(([key, item]) => (
              <button
                className={activeCatalogue === key ? "active" : ""}
                key={key}
                onClick={() => setActiveCatalogue(key)}
                role="tab"
                type="button"
                aria-selected={activeCatalogue === key}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="catalogue-panel">
            <div className="catalogue-image-wrap">
              <AssetImage src={activeCatalogueItem.src} alt={activeCatalogueItem.alt} className="catalogue-image" />
            </div>
            <a className="button dark catalogue-button" href={currentCatalogueOrderUrl(activeCatalogueItem.label)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} />
              {content.catalogue.orderButtonLabel}
            </a>
          </div>
        </section>

        <section id="about" className="about panel container" hidden>
          <AssetImage src="brand-mark.svg" alt="" className="shape shape-one" />
          <AssetImage src="brand-mark.svg" alt="" className="shape shape-two" />
          <div className="quote quote-left">
            <AssetImage src="avatar-left.webp" alt="Client portrait" />
            <p>“Vidhub transformed our raw footage into a cinematic video that truly represents our brand. The quality is outstanding.”</p>
          </div>
          <div className="about-title">
            <p className="eyebrow">ABOUT US</p>
            <h2>At Vidhub, we craft powerful video experiences by transforming raw footage with creative storytelling and refined editing techniques.</h2>
          </div>
          <div className="quote quote-right">
            <AssetImage src="avatar-right.webp" alt="Client portrait" />
            <p>"Vidhub’s video edits consistently raise the quality of our content and help us better connect with our audience."</p>
          </div>
        </section>

        <section id="service" className="container services-section" hidden>
          <SectionTitle eyebrow="Our services" title="Video solutions designed to perform" />
          <div className="service-grid">
            {services.map(([icon, title, copy]) => (
              <article className="service-card" key={title}>
                <AssetImage src={icon} alt="" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="container works-section" hidden>
          <SectionTitle eyebrow="Our works" title="Selected projects that speak for themselves" />
          <div className="work-grid">
            {works.map(([src, title, year]) => (
              <article className="work-card" key={title}>
                <AssetImage src={src} alt={title} />
                <div>
                  <h3>{title}</h3>
                  <span>{year}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="it-works" className="process-section">
          <div className="process-inner">
          <div className="process-heading">
            <p className="process-label">
              <span aria-hidden="true" />
              {content.process.label}
            </p>
            <h2>{content.process.title}</h2>
          </div>
          <div className="order-timeline" style={{ "--process-progress": processProgress }}>
            <div className="order-timeline-line" aria-hidden="true">
              <span />
            </div>
            <div className="step-grid">
              {content.process.steps.map((step, index) => {
                const threshold = index / (content.process.steps.length - 1);
                const active = processProgress >= threshold;

                return (
                  <article className={active ? "step-card active" : "step-card"} key={step.number}>
                    <span className="step-marker">{step.number}</span>
                    <h3>{step.title}</h3>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="process-order-cta">
            <p>{content.process.copy}</p>
            <a className="button dark" href={currentOrderTemplateUrl} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} />
              {content.process.ctaLabel}
            </a>
          </div>
          </div>
        </section>

        <section
          id="social"
          className="container social-section"
          style={{
            "--social-left-image": `url("${assetPath(content.social.decorativeImages.left)}")`,
            "--social-right-image": `url("${assetPath(content.social.decorativeImages.right)}")`,
          }}
        >
          <div className="social-mark" aria-hidden="true">
            <AtSign size={34} strokeWidth={2.6} />
          </div>
          <div className="social-headline">
            <span>{content.social.headlinePrefix}</span>
            <strong>{content.social.headlineStrong}</strong>
          </div>
          <div className="social-underline" aria-hidden="true" />
          <p>{content.social.copy}</p>
          <div className="social-buttons">
            {content.social.buttons.map((item) => (
              <a className={`social-media-button ${item.type}`} href={item.url} target="_blank" rel="noreferrer" key={item.label}>
                <span className="social-button-icon">
                  <SocialIcon src={item.icon} alt="" />
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="pricing" className="container pricing-section" hidden>
          <SectionTitle eyebrow="Pricing plans" title="Simple pricing for powerful video editing" />
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className="price-card" key={plan.name}>
                {plan.badge ? <span className="badge">{plan.badge}</span> : null}
                <h3>{plan.name}</h3>
                <p className="price"><strong>{plan.price}</strong><span>/month</span></p>
                <p>{plan.copy}</p>
                <a className="button dark wide" href={currentWhatsappUrl} target="_blank" rel="noreferrer">
                  <WhatsAppIcon size={18} />
                  Book a call
                </a>
                <hr />
                <h4>What's included:</h4>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}><AssetImage src="check.svg" alt="" />{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonial" className="panel container testimonials-section" hidden>
          <SectionTitle eyebrow="Testimonials" title="What our clients say about vidhub" />
          <div className="testimonial-grid">
            {testimonials.map(([avatar, name, role, quote]) => (
              <article className="testimonial-card" key={name}>
                <div className="stars" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}
                </div>
                <p>"{quote}"</p>
                <div className="person">
                  <AssetImage src={avatar} alt={name} />
                  <div><strong>{name}</strong><span>{role}</span></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="container faq-section">
          <SectionTitle eyebrow={content.faq.eyebrow} title={content.faq.title} />
          <div className="faq-layout">
            <div className="faq-image-wrap">
              <AssetImage src={content.faq.image} alt={content.faq.imageAlt} className="faq-image" />
            </div>
            <div className="faq-list">
              {content.faq.items.map((item, index) => {
                const active = openFaq === index;
                return (
                  <article className={active ? "faq-item active" : "faq-item"} key={item.question}>
                    <button onClick={() => setOpenFaq(active ? -1 : index)} aria-expanded={active}>
                      {item.question}
                      <ChevronDown size={22} />
                    </button>
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="container cta">
          <div>
            <p className="eyebrow">{content.contact.eyebrow}</p>
            <h2>{content.contact.title}</h2>
            <p>{content.contact.copy}</p>
            <div className="hero-buttons">
              {content.contact.buttons.map((button) => {
                const href = button.type === "foodpanda"
                  ? content.links.foodpandaUrl
                  : button.type === "grabfood"
                    ? content.links.grabFoodUrl
                    : currentWhatsappUrl;
                const className = button.type === "foodpanda"
                  ? "button foodpanda-button contact-order-button"
                  : button.type === "grabfood"
                    ? "button grabfood-button contact-order-button"
                    : "button dark contact-order-button";

                return (
                  <a className={className} href={href} target="_blank" rel="noreferrer" key={button.id}>
                    {button.icon === "whatsapp" ? <WhatsAppIcon size={18} /> : <BrandLogo src={button.icon} alt="" className={`${button.type}-logo`} />}
                    {button.label}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="cta-map" aria-label={content.contact.mapLabel}>
            <iframe
              title={content.contact.mapTitle}
              src={currentMapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </main>

      <footer className="container footer">
        <div className="footer-main">
          <div>
            <AssetImage src={content.footer.logo} alt={content.site.brandName} className="footer-logo" />
            <div className="footer-hours">
              <p>{content.site.operatingHoursLabel}</p>
              <strong>{content.site.operatingHours}</strong>
              <span>{content.site.operatingDays}</span>
            </div>
          </div>
          <div>
            <h4>{content.footer.quickLinksTitle}</h4>
            {content.footer.quickLinks.map((link) => (
              <a href={link.href} key={link.href}>{link.label}</a>
            ))}
          </div>
          <div>
            <h4>{content.footer.socialTitle}</h4>
            {content.social.buttons.map((item) => (
              <a href={item.url} target="_blank" rel="noreferrer" key={item.label}>
                <span className={`footer-social-icon ${item.type}`}>
                  <SocialIcon src={item.icon} alt="" />
                </span>
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <h4>{content.footer.orderTitle}</h4>
            <a href={currentWhatsappUrl} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} />{content.header.cta.label}</a>
            <a href={content.links.foodpandaUrl} target="_blank" rel="noreferrer"><BrandLogo src="foodpanda-logo.webp" alt="" className="foodpanda-logo footer-brand-logo" />foodpanda</a>
            <a href={content.links.grabFoodUrl} target="_blank" rel="noreferrer"><BrandLogo src="grabfood-icon.webp" alt="" className="grabfood-logo footer-brand-logo" />GrabFood</a>
            <a href={currentPhoneUrl}><Phone size={18} />{content.site.phoneDisplay}</a>
            <a href={currentMapsUrl} target="_blank" rel="noreferrer">{content.site.address}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{content.site.copyright}</p>
        </div>
      </footer>
      <FloatingWhatsApp content={content} whatsappUrl={currentWhatsappUrl} />
    </>
  );
}
