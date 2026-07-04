"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  LockKeyhole,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import {
  CMS_DRAFT_STORAGE_KEY,
  assetPath,
  cloneSiteContent,
  siteContent,
  updateFavicon,
} from "../content/siteContent";

const sections = [
  { id: "site", label: "Business Info" },
  { id: "header", label: "Top Menu" },
  { id: "hero", label: "Main Section & Best Sellers" },
  { id: "catalogue", label: "Full Menu" },
  { id: "process", label: "Cara Order" },
  { id: "social", label: "Follow FZL Kitchen" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact & Ordering" },
  { id: "footer", label: "Bottom Section" },
];
const CMS_UNDO_STORAGE_KEY = "fzl-kitchen-cms-undo-stack";

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

function CharacterCount({ value, limit }) {
  const count = (value || "").length;
  return <small className={limit && count > limit ? "over-limit" : ""}>{limit ? `${count}/${limit}` : `${count} characters`}</small>;
}

function Field({ label, value, onChange, type = "text", multiline = false, invalid = false, hint, limit, variant = "text", readOnly = false }) {
  const fieldValue = value || "";
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.max(48, textareaRef.current.scrollHeight)}px`;
  }, [fieldValue]);

  const handleChange = (nextValue) => {
    const limitedValue = limit ? nextValue.slice(0, limit) : nextValue;
    onChange(limitedValue);
  };

  return (
    <label className={`cms-field ${invalid ? "invalid" : ""} ${variant === "link" ? "link-field" : ""} ${readOnly ? "locked-field" : ""}`}>
      <span>{label}</span>
      {multiline ? (
        <textarea
          ref={textareaRef}
          value={fieldValue}
          onChange={(event) => {
            event.currentTarget.style.height = "auto";
            event.currentTarget.style.height = `${Math.max(48, event.currentTarget.scrollHeight)}px`;
            handleChange(event.target.value);
          }}
          rows={1}
          maxLength={limit}
          readOnly={readOnly}
        />
      ) : (
        <input value={fieldValue} onChange={(event) => handleChange(event.target.value)} type={type} maxLength={limit} readOnly={readOnly} />
      )}
      <div className="cms-field-meta">
        {hint ? <small>{hint}</small> : <span />}
        <CharacterCount value={fieldValue} limit={limit} />
      </div>
    </label>
  );
}

function LinkField({ label, value, onChange }) {
  return (
    <Field
      label={label}
      value={value}
      onChange={onChange}
      invalid={isInvalidUrl(value)}
      variant="link"
      hint="Paste the page link here."
    />
  );
}

function convertImageToWebp(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read image"));
    reader.onload = () => {
      const image = new window.Image();

      image.onerror = () => reject(new Error("Could not convert image"));
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        resolve(canvas.toDataURL("image/webp", 0.88));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

function friendlyImageName(src) {
  if (!src) return "";
  if (src.startsWith("data:image/")) return "Uploaded image";

  return src
    .replace(/^.*[\\/]/, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "fzl") return "FZL";
      if (lower === "faq") return "FAQ";
      if (lower === "foodpanda") return "foodpanda";
      if (lower === "grabfood") return "GrabFood";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function ImageField({ label, value, onChange }) {
  const preview = assetPath(value);
  const [uploadStatus, setUploadStatus] = useState("");
  const displayValue = friendlyImageName(value);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus("Preparing image...");
      const webpImage = await convertImageToWebp(file);
      onChange(webpImage);
      setUploadStatus("Image ready");
    } catch {
      setUploadStatus("This image could not be used");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="cms-image-field">
      <label className="cms-image-name">
        <span>{label}</span>
        <input value={displayValue} readOnly type="text" />
        <small>Upload a photo here.</small>
      </label>
      <div className="cms-image-preview">
        {preview ? (
          <img className="cms-upload-preview-image" src={preview} alt="" onError={(event) => event.currentTarget.classList.add("broken")} />
        ) : (
          <ImageIcon size={22} />
        )}
      </div>
      <div className="cms-upload-row">
        <label className="cms-mini-button cms-upload-button">
          <Upload size={15} />
          Upload image
          <input type="file" accept="image/*" onChange={handleUpload} />
        </label>
        {uploadStatus ? <small className="cms-upload-status">{uploadStatus}</small> : null}
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

function Card({ title, onRemove, children }) {
  return (
    <article className="cms-card">
      <div className="cms-card-header">
        <h3>{title}</h3>
        {onRemove ? (
          <button className="cms-icon-button" type="button" onClick={onRemove} aria-label={`Remove ${title}`}>
            <Trash2 size={17} />
          </button>
        ) : null}
      </div>
      <div className="cms-card-grid">{children}</div>
    </article>
  );
}

function AddButton({ children, onClick }) {
  return (
    <button className="cms-add-button" type="button" onClick={onClick}>
      <Plus size={17} />
      {children}
    </button>
  );
}

function CmsLogin({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsChecking(true);

    try {
      const response = await fetch("/api/cms/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Wrong password. Try again.");
      }

      setPassword("");
      onUnlock();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Wrong password. Try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="cms-login-shell">
      <section className="cms-login-card">
        <div className="cms-login-mark">
          <LockKeyhole size={22} />
        </div>
        <p>FZL Kitchen</p>
        <h1>Website Editor</h1>
        <span>Enter password to continue.</span>

        <form className="cms-login-form" onSubmit={handleSubmit}>
          <label className="cms-login-field">
            <span>Password</span>
            <div>
              <input
                autoComplete="current-password"
                autoFocus
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                title={isPasswordVisible ? "Hide password" : "Show password"}
                type="button"
                onClick={() => setIsPasswordVisible((current) => !current)}
              >
                {isPasswordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          {error ? <strong className="cms-login-error">{error}</strong> : null}

          <button className="cms-button cms-login-submit" disabled={isChecking} type="submit">
            {isChecking ? "Checking..." : "Unlock"}
          </button>
        </form>
      </section>
    </main>
  );
}

function LivePreview({ activeSection, isVisible, onClose, version }) {
  const iframeRef = useRef(null);

  const hidePreviewScrollbar = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;
    if (!frameDocument || frameDocument.getElementById("cms-preview-scrollbar-style")) return;

    const style = frameDocument.createElement("style");
    style.id = "cms-preview-scrollbar-style";
    style.textContent = `
      html, body {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        display: none;
      }
    `;
    frameDocument.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!isVisible || !iframeRef.current) return;

    const sectionTargets = {
      site: "home",
      header: "home",
      hero: "menu",
      catalogue: "full-menu",
      process: "it-works",
      social: "social",
      faq: "faq",
      contact: "contact",
      footer: "footer",
    };

    const scrollPreview = () => {
      const frameWindow = iframeRef.current?.contentWindow;
      const frameDocument = iframeRef.current?.contentDocument;
      if (!frameWindow || !frameDocument) return;
      hidePreviewScrollbar();

      if (activeSection === "footer") {
        frameWindow.scrollTo({ top: frameDocument.documentElement.scrollHeight, behavior: "smooth" });
        return;
      }

      const target = frameDocument.getElementById(sectionTargets[activeSection]);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const timer = window.setTimeout(scrollPreview, 150);
    return () => window.clearTimeout(timer);
  }, [activeSection, hidePreviewScrollbar, isVisible, version]);

  if (!isVisible) return null;

  return (
    <aside className="cms-live-preview" aria-label="Live Preview">
      <div className="cms-preview-head">
        <div>
          <p>Preview</p>
          <h2>Website Preview</h2>
        </div>
        <button className="cms-icon-button" type="button" onClick={onClose} aria-label="Hide live preview" title="Hide live preview">
          <PanelRightClose size={18} />
        </button>
      </div>
      <div className="cms-preview-body">
        <div className="cms-mobile-preview-shell">
          <iframe
            className="cms-mobile-preview-frame"
            key={version}
            ref={iframeRef}
            src={`/?cmsPreview=${version}`}
            title="Website preview"
            onLoad={() => {
              const frameWindow = iframeRef.current?.contentWindow;
              const frameDocument = iframeRef.current?.contentDocument;
              if (!frameWindow || !frameDocument) return;
              hidePreviewScrollbar();
              const target = activeSection === "footer" ? null : frameDocument.getElementById({
                site: "home",
                header: "home",
                hero: "menu",
                catalogue: "full-menu",
                process: "it-works",
                social: "social",
                faq: "faq",
                contact: "contact",
              }[activeSection]);
              if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
              if (activeSection === "footer") frameWindow.scrollTo({ top: frameDocument.documentElement.scrollHeight });
            }}
          />
        </div>
      </div>
    </aside>
  );
}

export default function CmsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("site");
  const [content, setContent] = useState(() => cloneSiteContent(siteContent));
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [previewVersion, setPreviewVersion] = useState(0);
  const [status, setStatus] = useState("Not saved yet");
  const [undoDepth, setUndoDepth] = useState(0);
  const hasLoadedRef = useRef(false);
  const undoStackRef = useRef([]);

  useEffect(() => {
    const draft = window.localStorage.getItem(CMS_DRAFT_STORAGE_KEY);
    const rawUndoStack = window.sessionStorage.getItem(CMS_UNDO_STORAGE_KEY);

    if (rawUndoStack) {
      try {
        const parsedUndoStack = JSON.parse(rawUndoStack);
        if (Array.isArray(parsedUndoStack)) {
          undoStackRef.current = parsedUndoStack;
          setUndoDepth(parsedUndoStack.length);
        }
      } catch {
        window.sessionStorage.removeItem(CMS_UNDO_STORAGE_KEY);
      }
    }

    if (!draft) {
      hasLoadedRef.current = true;
      return;
    }

    try {
      setContent(JSON.parse(draft));
      setStatus("Saved work loaded");
    } catch {
      setStatus("Could not load saved work");
    } finally {
      hasLoadedRef.current = true;
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
      if (isInvalidUrl(item.url)) issues.push(`Social button ${index + 1} has a broken link.`);
    });
    content.faq.items.forEach((item, index) => {
      if (!item.question) issues.push(`FAQ ${index + 1} needs a question.`);
    });
    return issues;
  }, [content]);

  const rememberContentChange = useCallback((updater) => {
    setContent((current) => {
      undoStackRef.current = [cloneSiteContent(current), ...undoStackRef.current].slice(0, 20);
      window.sessionStorage.setItem(CMS_UNDO_STORAGE_KEY, JSON.stringify(undoStackRef.current));
      setUndoDepth(undoStackRef.current.length);
      setStatus("Changes not saved yet");
      return typeof updater === "function" ? updater(current) : updater;
    });
  }, []);

  const update = (path, value) => rememberContentChange((current) => setDeepValue(current, path, value));
  const writeDraft = useCallback((nextContent, message = "Saved") => {
    if (requiredIssues.length) {
      setStatus("Fix required fields before saving");
      return false;
    }

    window.localStorage.setItem(CMS_DRAFT_STORAGE_KEY, JSON.stringify(nextContent));
    setPreviewVersion((current) => current + 1);
    setStatus(message);
    return true;
  }, [requiredIssues]);

  const saveDraft = () => {
    writeDraft(content, "Saved. Refresh the website to see it.");
  };

  const resetDraft = () => {
    window.localStorage.removeItem(CMS_DRAFT_STORAGE_KEY);
    undoStackRef.current = [cloneSiteContent(content), ...undoStackRef.current].slice(0, 20);
    window.sessionStorage.setItem(CMS_UNDO_STORAGE_KEY, JSON.stringify(undoStackRef.current));
    setUndoDepth(undoStackRef.current.length);
    setContent(cloneSiteContent(siteContent));
    setStatus("Back to original content");
  };

  const undoLastChange = useCallback(() => {
    const [previousContent, ...remainingContent] = undoStackRef.current;
    if (!previousContent) return;

    undoStackRef.current = remainingContent;
    window.sessionStorage.setItem(CMS_UNDO_STORAGE_KEY, JSON.stringify(remainingContent));
    setUndoDepth(remainingContent.length);
    setContent(previousContent);
    window.localStorage.setItem(CMS_DRAFT_STORAGE_KEY, JSON.stringify(previousContent));
    setStatus("Last change undone");
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;

    const timer = window.setTimeout(() => {
      writeDraft(content, `Saved ${new Date().toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}`);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [content, writeDraft]);

  useEffect(() => {
    updateFavicon(content.header.logo);
  }, [content.header.logo]);

  useEffect(() => {
    function handleUndoShortcut(event) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;

      const target = event.target;
      const isTextEditing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        Boolean(target?.isContentEditable);

      if (isTextEditing) return;

      event.preventDefault();
      undoLastChange();
    }

    window.addEventListener("keydown", handleUndoShortcut);
    return () => window.removeEventListener("keydown", handleUndoShortcut);
  }, [undoLastChange]);

  if (!isAuthenticated) {
    return <CmsLogin onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <main className="cms-shell">
      <header className="cms-topbar">
        <div>
          <p>FZL Kitchen</p>
          <h1>Website Editor</h1>
        </div>
        <div className="cms-actions">
          <span className={requiredIssues.length ? "cms-status warning" : "cms-status"}>{status}</span>
          <button
            className={isPreviewOpen ? "cms-button ghost active" : "cms-button ghost"}
            type="button"
            onClick={() => setIsPreviewOpen((current) => !current)}
            aria-pressed={isPreviewOpen}
            aria-label={isPreviewOpen ? "Hide live preview" : "Show live preview"}
            title={isPreviewOpen ? "Hide live preview" : "Show live preview"}
          >
            {isPreviewOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            Preview
          </button>
          <button className="cms-button ghost" type="button" onClick={undoLastChange} disabled={undoDepth === 0}>
            <Undo2 size={16} />
            Undo
          </button>
          <button className="cms-button ghost" type="button" onClick={resetDraft}>
            <RotateCcw size={16} />
            Reset
          </button>
          <button className="cms-button" type="button" onClick={saveDraft}>
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </header>

      <div className={isPreviewOpen ? "cms-layout preview-open" : "cms-layout"}>
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
          {renderSection(activeSection, content, update, rememberContentChange)}
        </div>
        <LivePreview activeSection={activeSection} isVisible={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} version={previewVersion} />
      </div>
    </main>
  );
}

function inferSocialType(item) {
  const source = `${item.label || ""} ${item.url || ""} ${item.icon || ""}`.toLowerCase();
  if (source.includes("tiktok")) return "tiktok";
  if (source.includes("facebook")) return "facebook";
  if (source.includes("instagram")) return "instagram";
  return "custom";
}

function renderSection(activeSection, content, update, setContent) {
  if (activeSection === "site") {
    return (
      <SectionPanel title="Business Info">
        <Field label="Brand name" value={content.site.brandName} onChange={(value) => update(["site", "brandName"], value)} />
        <Field label="Phone number shown" value={content.site.phoneDisplay} onChange={(value) => update(["site", "phoneDisplay"], value)} />
        <Field label="Address" value={content.site.address} onChange={(value) => update(["site", "address"], value)} multiline />
        <Field label="Bottom small text" value={content.site.copyright} onChange={(value) => update(["site", "copyright"], value)} />
      </SectionPanel>
    );
  }

  if (activeSection === "header") {
    return (
      <SectionPanel title="Top Menu">
        <ImageField label="Top logo" value={content.header.logo} onChange={(value) => update(["header", "logo"], value)} />
        <Field label="Button text" value={content.header.cta.label} onChange={(value) => update(["header", "cta", "label"], value)} />
        <div className="cms-repeat-list">
          {content.header.navItems.map((item, index) => (
            <Card title={`Menu item ${index + 1}`} key={`${item.target}-${index}`}>
              <Field label="Menu text" value={item.label} onChange={(value) => setContent((current) => replaceArrayItem(current, ["header", "navItems"], index, { ...item, label: value }))} />
            </Card>
          ))}
        </div>
      </SectionPanel>
    );
  }

  if (activeSection === "hero") {
    return (
      <SectionPanel title="Main Section & Best Sellers">
        <Field label="Small text above title" value={content.hero.eyebrow} onChange={(value) => update(["hero", "eyebrow"], value)} limit={36} />
        <Field label="Yellow headline text" value={content.hero.highlight} onChange={(value) => update(["hero", "highlight"], value)} limit={24} />
        <Field label="Main headline" value={content.hero.headline} onChange={(value) => update(["hero", "headline"], value)} limit={70} />
        <Field label="Description text" value={content.hero.copy} onChange={(value) => update(["hero", "copy"], value)} multiline limit={180} />
        <ImageField label="Main photo" value={content.hero.backgroundImage} onChange={(value) => update(["hero", "backgroundImage"], value)} />
        <Field label="Dish button text" value={content.hero.dishButtonLabel} onChange={(value) => update(["hero", "dishButtonLabel"], value)} limit={28} />
        <div className="cms-repeat-list">
          {content.hero.bestSellers.map((item, index) => (
            <Card title={item.title || `Best seller ${index + 1}`} key={`${item.title}-${index}`}>
              <ImageField label="Dish image" value={item.src} onChange={(value) => setContent((current) => replaceArrayItem(current, ["hero", "bestSellers"], index, { ...item, src: value }))} />
              <Field label="Title" value={item.title} onChange={(value) => setContent((current) => replaceArrayItem(current, ["hero", "bestSellers"], index, { ...item, title: value }))} limit={42} />
              <Field label="Description text" value={item.copy} onChange={(value) => setContent((current) => replaceArrayItem(current, ["hero", "bestSellers"], index, { ...item, copy: value }))} multiline limit={90} />
              <Field label="Small badge text" value={item.tag} onChange={(value) => setContent((current) => replaceArrayItem(current, ["hero", "bestSellers"], index, { ...item, tag: value }))} limit={24} />
            </Card>
          ))}
        </div>
      </SectionPanel>
    );
  }

  if (activeSection === "catalogue") {
    return (
      <SectionPanel title="Full Menu">
        <Field label="Small text above title" value={content.catalogue.eyebrow} onChange={(value) => update(["catalogue", "eyebrow"], value)} limit={28} />
        <Field label="Title" value={content.catalogue.title} onChange={(value) => update(["catalogue", "title"], value)} limit={48} />
        <Field label="Description text" value={content.catalogue.copy} onChange={(value) => update(["catalogue", "copy"], value)} multiline limit={140} />
        <Field label="Order button text" value={content.catalogue.orderButtonLabel} onChange={(value) => update(["catalogue", "orderButtonLabel"], value)} />
        <div className="cms-menu-photo-list">
          {Object.entries(content.catalogue.items).map(([key, item]) => (
            <Card title={item.label} key={key}>
            <Field label="Menu name" value={item.label} onChange={(value) => update(["catalogue", "items", key, "label"], value)} limit={24} />
              <ImageField label="Menu photo" value={item.src} onChange={(value) => update(["catalogue", "items", key, "src"], value)} />
            </Card>
          ))}
        </div>
      </SectionPanel>
    );
  }

  if (activeSection === "process") {
    return (
      <SectionPanel title="Cara Order">
        <Field label="Small text above title" value={content.process.label} onChange={(value) => update(["process", "label"], value)} limit={28} />
        <Field label="Title" value={content.process.title} onChange={(value) => update(["process", "title"], value)} limit={48} />
        <Field label="Description text" value={content.process.copy} onChange={(value) => update(["process", "copy"], value)} multiline limit={160} />
        <Field label="Button text" value={content.process.ctaLabel} onChange={(value) => update(["process", "ctaLabel"], value)} limit={28} />
        <div className="cms-repeat-list">
          {content.process.steps.map((item, index) => (
            <Card title={`Step ${index + 1}`} key={`${item.number}-${index}`}>
              <Field label="Title" value={item.title} onChange={(value) => setContent((current) => replaceArrayItem(current, ["process", "steps"], index, { ...item, title: value }))} />
            </Card>
          ))}
        </div>
      </SectionPanel>
    );
  }

  if (activeSection === "social") {
    return (
      <SectionPanel title="Follow FZL Kitchen">
        <Field label="Headline first part" value={content.social.headlinePrefix} onChange={(value) => update(["social", "headlinePrefix"], value)} limit={24} />
        <Field label="Headline second part" value={content.social.headlineStrong} onChange={(value) => update(["social", "headlineStrong"], value)} limit={36} />
        <Field label="Description text" value={content.social.copy} onChange={(value) => update(["social", "copy"], value)} multiline limit={160} />
        <ImageField label="Left side image" value={content.social.decorativeImages.left} onChange={(value) => update(["social", "decorativeImages", "left"], value)} />
        <ImageField label="Right side image" value={content.social.decorativeImages.right} onChange={(value) => update(["social", "decorativeImages", "right"], value)} />
        <div className="cms-repeat-list">
          <AddButton onClick={() => setContent((current) => addArrayItem(current, ["social", "buttons"], {
            label: "New Link",
            url: "https://example.com",
            type: "custom",
            icon: "",
          }))}>
            Add Social Link
          </AddButton>
          {content.social.buttons.map((item, index) => (
            <Card title={item.label || `Social button ${index + 1}`} key={`${item.label}-${index}`} onRemove={() => setContent((current) => removeArrayItem(current, ["social", "buttons"], index))}>
              <Field label="Label" value={item.label} onChange={(value) => setContent((current) => replaceArrayItem(current, ["social", "buttons"], index, { ...item, label: value }))} />
              <LinkField label={`${item.label || "Social"} page link`} value={item.url} onChange={(value) => setContent((current) => {
                const nextItem = { ...item, url: value };
                return replaceArrayItem(current, ["social", "buttons"], index, { ...nextItem, type: inferSocialType(nextItem) });
              })} />
              <ImageField label="Small button image" value={item.icon} onChange={(value) => setContent((current) => replaceArrayItem(current, ["social", "buttons"], index, { ...item, icon: value }))} />
            </Card>
          ))}
        </div>
      </SectionPanel>
    );
  }

  if (activeSection === "faq") {
    return (
      <SectionPanel title="FAQ">
        <Field label="Small text above title" value={content.faq.eyebrow} onChange={(value) => update(["faq", "eyebrow"], value)} limit={28} />
        <Field label="Title" value={content.faq.title} onChange={(value) => update(["faq", "title"], value)} limit={56} />
        <ImageField label="FAQ image" value={content.faq.image} onChange={(value) => update(["faq", "image"], value)} />
        <div className="cms-repeat-list">
          {content.faq.items.map((item, index) => (
            <Card title={item.question || `FAQ ${index + 1}`} key={`${item.question}-${index}`}>
              <Field label="Question" value={item.question} onChange={(value) => setContent((current) => replaceArrayItem(current, ["faq", "items"], index, { ...item, question: value }))} />
              <Field label="Answer" value={item.answer} onChange={(value) => setContent((current) => replaceArrayItem(current, ["faq", "items"], index, { ...item, answer: value }))} multiline limit={240} />
            </Card>
          ))}
        </div>
      </SectionPanel>
    );
  }

  if (activeSection === "contact") {
    return (
      <SectionPanel title="Contact & Ordering">
        <Field label="Small text above title" value={content.contact.eyebrow} onChange={(value) => update(["contact", "eyebrow"], value)} limit={28} />
        <Field label="Title" value={content.contact.title} onChange={(value) => update(["contact", "title"], value)} limit={56} />
        <Field label="Description text" value={content.contact.copy} onChange={(value) => update(["contact", "copy"], value)} multiline limit={180} />
        <LinkField label="Foodpanda order page" value={content.links.foodpandaUrl} onChange={(value) => update(["links", "foodpandaUrl"], value)} />
        <LinkField label="GrabFood order page" value={content.links.grabFoodUrl} onChange={(value) => update(["links", "grabFoodUrl"], value)} />
        <div className="cms-repeat-list">
          {content.contact.buttons.map((item, index) => (
            <Card title={item.label || `Order button ${index + 1}`} key={item.id}>
              <Field label="Button text" value={item.label} onChange={(value) => setContent((current) => replaceArrayItem(current, ["contact", "buttons"], index, { ...item, label: value }))} />
              <ImageField label="Small button image" value={item.icon} onChange={(value) => setContent((current) => replaceArrayItem(current, ["contact", "buttons"], index, { ...item, icon: value }))} />
            </Card>
          ))}
        </div>
      </SectionPanel>
    );
  }

  return (
    <SectionPanel title="Bottom Section">
      <ImageField label="Bottom logo" value={content.footer.logo} onChange={(value) => update(["footer", "logo"], value)} />
      <Field label="Opening hours title" value={content.site.operatingHoursLabel} onChange={(value) => update(["site", "operatingHoursLabel"], value)} />
      <Field label="Opening hours" value={content.site.operatingHours} onChange={(value) => update(["site", "operatingHours"], value)} />
      <Field label="Open days" value={content.site.operatingDays} onChange={(value) => update(["site", "operatingDays"], value)} />
      <Field label="Menu links title" value={content.footer.quickLinksTitle} onChange={(value) => update(["footer", "quickLinksTitle"], value)} />
      <Field label="Social title" value={content.footer.socialTitle} onChange={(value) => update(["footer", "socialTitle"], value)} />
      <Field label="Order title" value={content.footer.orderTitle} onChange={(value) => update(["footer", "orderTitle"], value)} />
      <Field label="Floating WhatsApp text" value={content.floatingWhatsApp.label} onChange={(value) => update(["floatingWhatsApp", "label"], value)} />
      <div className="cms-repeat-list">
        {content.footer.quickLinks.map((item, index) => (
          <Card title={item.label || `Menu link ${index + 1}`} key={`${item.href}-${index}`}>
            <Field label="Menu text" value={item.label} onChange={(value) => setContent((current) => replaceArrayItem(current, ["footer", "quickLinks"], index, { ...item, label: value }))} />
          </Card>
        ))}
      </div>
    </SectionPanel>
  );
}
