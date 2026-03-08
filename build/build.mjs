
import { promises as fs } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { site, content, pageOrder } from "../src/site.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const srcDir = path.join(root, "src");
const brandingDir = path.join(srcDir, "branding");
const buildDate = new Date().toISOString().slice(0, 10);

const normalizeBase = (value = "") => {
  if (!value) return "";
  let base = value.trim();
  if (!base.startsWith("/")) base = `/${base}`;
  if (base.endsWith("/")) base = base.slice(0, -1);
  return base === "/" ? "" : base;
};

const basePath = normalizeBase(site.basePath);
const siteOrigin = site.siteUrl.replace(/\/$/, "");
const gaMeasurementId = (site.gaMeasurementId || "").trim();
const hasGaTracking = Boolean(gaMeasurementId);

const withBase = (target = "/") => {
  const pathValue = target.startsWith("/") ? target : `/${target}`;
  return `${basePath}${pathValue}`.replace(/\/{2,}/g, "/");
};

const absoluteUrl = (target = "/") => `${siteOrigin}${withBase(target)}`;
const websiteReferenceUrl = (localeData) => absoluteUrl(localeData.homePath);
const ensureDir = async (dir) => fs.mkdir(dir, { recursive: true });

const routeToFile = (route) => {
  if (route === "/404.html") return path.join(distDir, "404.html");
  const clean = route.replace(/^\/+|\/+$/g, "");
  if (!clean) return path.join(distDir, "index.html");
  return path.join(distDir, clean, "index.html");
};

const minifyCss = (input) =>
  input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

const minifyJs = (input) =>
  input
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
const stripGaRuntime = (input) => {
  const startMarker = "/*__GA_RUNTIME_START__*/";
  const endMarker = "/*__GA_RUNTIME_END__*/";
  if (hasGaTracking) {
    return input
      .replaceAll(startMarker, "")
      .replaceAll(endMarker, "");
  }
  const start = input.indexOf(startMarker);
  const end = input.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    return input;
  }
  return `${input.slice(0, start)}${input.slice(end + endMarker.length)}`;
};

const minifyHtml = (input) =>
  input
    .replace(/>\s+</g, "><")
    .replace(/\n+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const externalLinkAttrs = `target="_blank"`;
const withExternalReferral = (urlValue) => {
  try {
    const url = new URL(urlValue);
    // url.searchParams.set("ref", siteOrigin);
    return url.toString();
  } catch {
    return urlValue;
  }
};
const pagePathForType = (localeData, type) => {
  if (type === "home") return localeData.homePath;
  if (type === "petition") return localeData.petitionPath;
  if (type === "resources") return localeData.resourcesPath;
  if (type === "privacy") return localeData.privacyPath;
  throw new Error(`Unknown page type: ${type}`);
};
const otherLocale = (locale) => (locale === "ro" ? "en" : "ro");
const pageRouteMap = new Map(pageOrder.map((page) => [`${page.locale}:${page.type}`, page.route]));
const routeFor = (locale, type) => pageRouteMap.get(`${locale}:${type}`);

const renderButton = ({ label, href = "#", variant = "primary", attrs = "" }) =>
  `<a class="button button-${variant}" href="${escapeHtml(href)}" ${attrs}>${escapeHtml(label)}</a>`;

const renderActionButton = (localeData, action) => {
  if (action.route) {
    return renderButton({
      label: action.cta,
      href: withBase(pagePathForType(localeData, action.route)),
      variant: "secondary",
    });
  }
  if (action.action === "share") {
    return `<button class="button button-secondary" type="button" data-share data-share-title="${escapeHtml(site.brand[localeData.locale])}" data-share-text="${escapeHtml(localeData.share.body)}" data-copied-label="${escapeHtml(localeData.share.copied)}">${escapeHtml(action.cta)}</button>`;
  }
  return "";
};

const renderNav = (localeData, currentType) => {
  const items = localeData.nav.map((item) => {
    let href = "#";
    let current = "";
    if (item.type === "anchor") {
      const localAnchorOnPage =
        currentType === "home" ||
        (currentType === "petition" && item.id === "complaints");
      href = localAnchorOnPage
        ? `#${item.id}`
        : withBase(`${localeData.homePath}#${item.id}`);
    } else if (item.type === "route") {
      const pathValue = pagePathForType(localeData, item.route);
      href = withBase(pathValue);
      current = currentType === item.route ? ` aria-current="page"` : "";
    }
    return `<li><a href="${escapeHtml(href)}"${current}>${escapeHtml(item.label)}</a></li>`;
  }).join("");

  return `<nav class="main-nav" data-nav aria-label="Primary">
    <ul class="nav-list">${items}</ul>
  </nav>`;
};

const renderHeader = (localeData, currentType) => {
  const swap = content[otherLocale(localeData.locale)];
  const swapPath = withBase(pagePathForType(swap, currentType));
  return `<header class="site-header">
    <div class="shell header-row">
      <a class="brand" href="${escapeHtml(withBase(localeData.homePath))}" aria-label="${escapeHtml(site.brand[localeData.locale])}">
        <img class="brand-mark" src="${escapeHtml(withBase("/icons/logo.svg"))}" alt="" width="44" height="44" aria-hidden="true" decoding="async">
        <span class="brand-copy">
          <strong>${escapeHtml(site.brand[localeData.locale])}</strong>
        </span>
      </a>
      ${renderNav(localeData, currentType)}
      <div class="header-actions">
        <a class="lang-switch" href="${escapeHtml(swapPath)}" lang="${escapeHtml(swap.locale)}">${escapeHtml(localeData.labels.switchTo)}</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-label="${escapeHtml(localeData.labels.openMenu)}" data-menu-toggle>
          <span class="bar"></span>
        </button>
      </div>
    </div>
  </header>`;
};

const renderFooter = (localeData) => {
  const pageLinks = localeData.footer.links.map((item) =>
    `<a href="${escapeHtml(withBase(pagePathForType(localeData, item.route)))}">${escapeHtml(item.label)}</a>`
  ).join("");
  return `<footer class="footer">
    <div class="shell footer-grid">
      <div class="section-stack">
        <p><strong>${escapeHtml(site.brand[localeData.locale])}</strong></p>
        <p>${escapeHtml(localeData.footer.lead)}</p>
        <p class="small">${escapeHtml(localeData.footer.note)}</p>
        <p class="small">${escapeHtml(localeData.footer.legal)}</p>
      </div>
      <div class="footer-links">
        <strong>${escapeHtml(localeData.footer.linksLabel)}</strong>
        ${pageLinks}
      </div>
    </div>
  </footer>`;
};

const renderAccessibilityControls = (localeData, { floating = false } = {}) => {
  const a11y = localeData.accessibility;
  const rootClass = floating ? "a11y-hub a11y-hub-floating" : "a11y-hub a11y-hub-inline";
  return `<aside class="${rootClass}" ${floating ? `aria-label="${escapeHtml(a11y.dockLabel)}"` : ""}>
    <div class="a11y-toggle-row">
      <button class="a11y-icon-button" type="button" data-toggle-a11y-panel aria-expanded="false" aria-label="${escapeHtml(a11y.dockLabel)}" title="${escapeHtml(a11y.dockLabel)}">♿</button>
      <button class="a11y-icon-button" type="button" data-toggle-consent-panel aria-expanded="false" aria-label="${escapeHtml(a11y.privacyButton)}" title="${escapeHtml(a11y.privacyButton)}">🔒</button>
    </div>
    <section class="a11y-controls" data-a11y-panel hidden>
      <div class="a11y-group">
        <span class="small muted">${escapeHtml(a11y.fontLabel)}</span>
        <div class="a11y-row">
          <button class="button button-ghost small" type="button" data-font-size-dec>${escapeHtml(a11y.fontDecrease)}</button>
          <button class="button button-ghost small" type="button" data-font-size-reset>${escapeHtml(a11y.fontReset)}</button>
          <button class="button button-ghost small" type="button" data-font-size-inc>${escapeHtml(a11y.fontIncrease)}</button>
          <span class="small muted" data-font-size-value data-font-prefix="${escapeHtml(a11y.currentFontPrefix)}">${escapeHtml(a11y.currentFontPrefix)} 100%</span>
        </div>
      </div>
      <div class="a11y-group">
        <span class="small muted">${escapeHtml(a11y.themeLabel)}</span>
        <div class="a11y-row">
          <button class="button button-ghost small" type="button" data-theme-set="auto">${escapeHtml(a11y.themeAuto)}</button>
          <button class="button button-ghost small" type="button" data-theme-set="light">${escapeHtml(a11y.themeLight)}</button>
          <button class="button button-ghost small" type="button" data-theme-set="dark">${escapeHtml(a11y.themeDark)}</button>
        </div>
      </div>
    </section>
  </aside>`;
};

const renderConsent = (localeData) => {
  const consent = localeData.consent;
  const analyticsControls = hasGaTracking ? `
      <label class="consent-option">
        <span>${escapeHtml(consent.analyticsTitle)}</span>
        <span class="small muted">${escapeHtml(consent.analyticsDesc)}</span>
        <input type="checkbox" data-consent-analytics>
      </label>
      <label class="consent-option">
        <span>${escapeHtml(consent.interactionsTitle)}</span>
        <span class="small muted">${escapeHtml(consent.interactionsDesc)}</span>
        <input type="checkbox" data-consent-interactions>
      </label>` : `
      <p class="small muted">${escapeHtml(consent.noGaSettingsNote)}</p>`;
  const bannerText = hasGaTracking ? consent.bannerWithGa : consent.bannerWithoutGa;
  const bannerActions = hasGaTracking ? `
      <button class="button button-primary" type="button" data-consent-accept-all>${escapeHtml(consent.acceptAll)}</button>
      <button class="button button-secondary" type="button" data-consent-reject>${escapeHtml(consent.rejectAll)}</button>
      <button class="button button-ghost" type="button" data-consent-open-panel>${escapeHtml(consent.openPanel)}</button>` : `
      <button class="button button-primary" type="button" data-consent-accept-all>${escapeHtml(consent.close)}</button>
      <button class="button button-ghost" type="button" data-consent-open-panel>${escapeHtml(consent.openPanel)}</button>`;
  return `<div class="consent-root" data-consent data-analytics-enabled="${hasGaTracking ? "true" : "false"}" data-analytics-id="${escapeHtml(gaMeasurementId)}">
    <aside class="consent-banner" data-consent-banner hidden>
      <p class="small">${escapeHtml(bannerText)}</p>
      <div class="share-row">${bannerActions}</div>
    </aside>
    <section class="consent-panel" data-consent-panel hidden aria-label="${escapeHtml(consent.title)}">
      <div class="panel">
        <h2>${escapeHtml(consent.title)}</h2>
        <div class="consent-option is-locked">
          <span>${escapeHtml(consent.essentialTitle)}</span>
          <span class="small muted">${escapeHtml(consent.essentialDesc)}</span>
          <span class="small">${escapeHtml(consent.alwaysOnLabel)}</span>
        </div>
        ${analyticsControls}
        <div class="share-row">
          <button class="button button-primary" type="button" data-consent-save>${escapeHtml(consent.save)}</button>
          <a class="button button-ghost" href="${escapeHtml(withBase(localeData.privacyPath))}">${escapeHtml(consent.openPrivacyPage)}</a>
          <button class="button button-secondary" type="button" data-consent-close>${escapeHtml(consent.close)}</button>
        </div>
      </div>
    </section>
  </div>`;
};

const homeJsonLd = (localeData) => {
  const faqEntities = localeData.home.faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": site.brand[localeData.locale],
        "url": absoluteUrl(localeData.homePath),
        "inLanguage": localeData.locale,
        "description": localeData.home.meta.description,
      },
      {
        "@type": "WebPage",
        "name": localeData.home.meta.title,
        "url": absoluteUrl(localeData.homePath),
        "inLanguage": localeData.locale,
        "description": localeData.home.meta.description,
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqEntities,
      },
    ],
  };
};

const pageJsonLd = (localeData, pageType) => {
  if (pageType === "home") return homeJsonLd(localeData);
  const pageData = localeData[pageType];
  const route = pagePathForType(localeData, pageType);
  const name = pageData.meta.title;
  const pageNode = {
    "@type": pageType === "resources" ? "CollectionPage" : "WebPage",
    "name": name,
    "url": absoluteUrl(route),
    "inLanguage": localeData.locale,
    "description": pageData.meta.description,
  };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": localeData.footer.links[0].label,
        "item": absoluteUrl(localeData.homePath),
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": (localeData.footer.links.find((item) => item.route === pageType) || { label: pageType }).label,
        "item": absoluteUrl(route),
      },
    ],
  };
  const graph = [pageNode, breadcrumb];
  if (pageType === "petition") {
    graph.push({
      "@type": "CreativeWork",
      "name": pageData.meta.title,
      "inLanguage": localeData.locale,
      "url": absoluteUrl(route),
      "abstract": pageData.meta.description,
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
};

const renderHead = (localeData, pageType) => {
  const pageData = localeData[pageType];
  const currentRoute = pagePathForType(localeData, pageType);
  const otherData = content[otherLocale(localeData.locale)];
  const otherRoute = pagePathForType(otherData, pageType);
  const canonical = absoluteUrl(currentRoute);
  const alternate = absoluteUrl(otherRoute);
  const ogImage = absoluteUrl(pageData.meta.ogImage);
  const jsonLd = JSON.stringify(pageJsonLd(localeData, pageType)).replace(/</g, "\\u003c");
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageData.meta.title)}</title>
  <meta name="description" content="${escapeHtml(pageData.meta.description)}">
  <meta name="keywords" content="${escapeHtml(pageData.meta.keywords.join(", "))}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="theme-color" content="${escapeHtml(site.themeColor)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(site.brand[localeData.locale])}">
  <meta property="og:title" content="${escapeHtml(pageData.meta.title)}">
  <meta property="og:description" content="${escapeHtml(pageData.meta.description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:image:alt" content="${escapeHtml(pageData.meta.title)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="${localeData.locale === "ro" ? "ro_RO" : "en_US"}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageData.meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(pageData.meta.description)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="alternate" hreflang="${escapeHtml(localeData.locale)}" href="${escapeHtml(canonical)}">
  <link rel="alternate" hreflang="${escapeHtml(otherData.locale)}" href="${escapeHtml(alternate)}">
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(absoluteUrl(content[site.defaultLocale].homePath))}">
  <link rel="icon" href="${escapeHtml(withBase("/icons/favicon.svg"))}" type="image/svg+xml">
  <link rel="icon" href="${escapeHtml(withBase("/icons/favicon-32.png"))}" sizes="32x32" type="image/png">
  <link rel="icon" href="${escapeHtml(withBase("/icons/favicon-16.png"))}" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="${escapeHtml(withBase("/icons/apple-touch-icon.png"))}" sizes="180x180">
  <link rel="manifest" href="${escapeHtml(withBase("/site.webmanifest"))}">
  <link rel="preload" href="${escapeHtml(withBase("/assets/site.css"))}" as="style">
  <link rel="stylesheet" href="${escapeHtml(withBase("/assets/site.css"))}">
  <script defer src="${escapeHtml(withBase("/assets/site.js"))}"></script>
  <script type="application/ld+json">${jsonLd}</script>`;
};

const renderComplaintSection = (localeData) => {
  const complaints = localeData.home.complaints;
  const complaintOptions = complaints.targets.map((item) =>
    `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`
  ).join("");
  const complaintMemberLinks = complaints.memberFinder.links.map((item) =>
    `<a class="button button-secondary" href="${escapeHtml(withExternalReferral(item.href))}" ${externalLinkAttrs}>${escapeHtml(item.label)}</a>`
  ).join("");
  return `<section id="complaints" class="section">
    <div class="shell">
      <div class="section-header">
        <h2>${escapeHtml(complaints.title)}</h2>
        <p>${escapeHtml(complaints.intro)}</p>
      </div>
      <div class="complaints-grid" data-complaint-generator data-locale="${escapeHtml(localeData.locale)}" data-copied-label="${escapeHtml(localeData.share.copied)}" data-website-url="${escapeHtml(websiteReferenceUrl(localeData))}">
        <article class="panel" data-reveal>
          <form class="complaint-form" data-complaint-form>
            <div class="field">
              <label for="target-${escapeHtml(localeData.locale)}">${escapeHtml(complaints.targetLabel)}</label>
              <select class="input" id="target-${escapeHtml(localeData.locale)}" name="target" data-target-group required>
                ${complaintOptions}
              </select>
              <p class="small muted">${escapeHtml(complaints.targetHelp)}</p>
            </div>
            <div class="field">
              <p class="small muted">${escapeHtml(complaints.memberFinder.title)}</p>
              <div class="member-link-row">${complaintMemberLinks}</div>
            </div>
            <div class="field-grid">
              <div class="field">
                <label for="name-${escapeHtml(localeData.locale)}">${escapeHtml(complaints.fields.name)}</label>
                <input class="input" id="name-${escapeHtml(localeData.locale)}" type="text" name="fullName" placeholder="${escapeHtml(complaints.placeholders.name)}" required>
              </div>
              <div class="field">
                <label for="city-${escapeHtml(localeData.locale)}">${escapeHtml(complaints.fields.city)}</label>
                <input class="input" id="city-${escapeHtml(localeData.locale)}" type="text" name="city" placeholder="${escapeHtml(complaints.placeholders.city)}" required>
              </div>
              <div class="field">
                <label for="county-${escapeHtml(localeData.locale)}">${escapeHtml(complaints.fields.county)}</label>
                <input class="input" id="county-${escapeHtml(localeData.locale)}" type="text" name="county" placeholder="${escapeHtml(complaints.placeholders.county)}" required>
              </div>
              <div class="field">
                <label for="email-${escapeHtml(localeData.locale)}">${escapeHtml(complaints.fields.email)}</label>
                <input class="input" id="email-${escapeHtml(localeData.locale)}" type="email" name="email" placeholder="${escapeHtml(complaints.placeholders.email)}" required>
              </div>
              <div class="field">
                <label for="phone-${escapeHtml(localeData.locale)}">${escapeHtml(complaints.fields.phone)}</label>
                <input class="input" id="phone-${escapeHtml(localeData.locale)}" type="text" name="phone" placeholder="${escapeHtml(complaints.placeholders.phone)}" required>
              </div>
              <div class="field">
                <label for="recipients-${escapeHtml(localeData.locale)}">${escapeHtml(complaints.fields.recipients)}</label>
                <input class="input" id="recipients-${escapeHtml(localeData.locale)}" type="text" name="recipients" data-target-emails placeholder="${escapeHtml(complaints.placeholders.recipients)}">
              </div>
            </div>
            <div class="share-row">
              <button class="button button-secondary" type="button" data-open-email disabled>${escapeHtml(complaints.actions.email)}</button>
            </div>
            <p class="small muted">${escapeHtml(complaints.privacy)}</p>
          </form>
        </article>
        <article class="panel complaint-output" data-reveal>
          <div class="field">
            <label for="subject-output-${escapeHtml(localeData.locale)}">${escapeHtml(complaints.output.subject)}</label>
            <input class="input" id="subject-output-${escapeHtml(localeData.locale)}" type="text" data-generated-subject readonly placeholder="${escapeHtml(complaints.output.emptySubject)}">
            <button class="button button-secondary" type="button" data-copy-subject disabled>${escapeHtml(complaints.actions.copySubject)}</button>
          </div>
          <div class="field">
            <label for="body-output-${escapeHtml(localeData.locale)}">${escapeHtml(complaints.output.body)}</label>
            <textarea class="input textarea" id="body-output-${escapeHtml(localeData.locale)}" data-generated-body readonly placeholder="${escapeHtml(complaints.output.emptyBody)}"></textarea>
            <button class="button button-secondary" type="button" data-copy-body disabled>${escapeHtml(complaints.actions.copyBody)}</button>
          </div>
        </article>
      </div>
    </div>
  </section>`;
};

const renderHome = (localeData) => {
  const page = localeData.home;
  const problemCards = page.problem.cards.map((item) => `
    <article class="card" data-reveal>
      <span class="card-kicker">${escapeHtml(item.kicker)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>`).join("");
  const timeline = page.problem.timeline.map((item) => `
    <article class="timeline-step" data-reveal>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>`).join("");
  const askCards = page.asks.cards.map((item) => `
    <article class="card" data-reveal>
      <span class="card-kicker">${escapeHtml(item.kicker)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>`).join("");
  const legalCards = page.law.cards.map((item) => `
    <details class="detail-card" data-reveal>
      <summary>
        <div>
          <span class="tag">${escapeHtml(item.tag)}</span>
          <div style="margin-top:.65rem">${escapeHtml(item.title)}</div>
          <span>${escapeHtml(item.summary)}</span>
        </div>
        <span aria-hidden="true">+</span>
      </summary>
      <div class="detail-body">
        <a class="inline-link" href="${escapeHtml(withExternalReferral(item.href))}" ${externalLinkAttrs}>${escapeHtml(localeData.labels.readSource)} <span aria-hidden="true">↗</span></a>
      </div>
    </details>`).join("");
  const faqList = page.faq.items.map((item) => `
    <details class="faq" data-reveal>
      <summary><span>${escapeHtml(item.q)}</span><span aria-hidden="true">+</span></summary>
      <div class="faq-body"><p>${escapeHtml(item.a)}</p></div>
    </details>`).join("");
  const actionCards = page.action.cards.map((item) => `
    <article class="cta-card" data-reveal>
      <span class="card-kicker">${escapeHtml(item.title.slice(0, 2).toUpperCase())}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
      <div class="share-row">${renderActionButton(localeData, item)}</div>
    </article>`).join("");
  const metrics = page.hero.stats.map((item) => `
    <div class="metric-card" data-reveal>
      <strong>${escapeHtml(item.value)}</strong>
      <span>${escapeHtml(item.label)}</span>
      <small>${escapeHtml(item.note)}</small>
    </div>`).join("");

  return `<section class="hero">
    <div class="shell hero-grid">
      <div class="surface">
        <span class="eyebrow">${escapeHtml(page.hero.eyebrow)}</span>
        <h1 class="hero-title">${escapeHtml(page.hero.title)}</h1>
        <p class="hero-subtitle">${escapeHtml(page.hero.subtitle)}</p>
        <p class="hero-text">${escapeHtml(page.hero.intro)}</p>
        <div class="pill-row">${page.hero.chips.map((chip) => `<span class="pill">${escapeHtml(chip)}</span>`).join("")}</div>
        <div class="button-row">
          ${renderButton({ label: page.hero.primaryCta.label, href: withBase(pagePathForType(localeData, page.hero.primaryCta.route)), variant: "primary" })}
          ${renderButton({ label: page.hero.secondaryCta.label, href: withBase(pagePathForType(localeData, page.hero.secondaryCta.route)), variant: "secondary" })}
        </div>
      </div>
      <aside class="hero-aside">
        <div class="surface metric-grid">${metrics}</div>
        <div class="notice" data-reveal>
          <strong>${escapeHtml(localeData.labels.updated)}</strong>
          <p>${escapeHtml(localeData.footer.note)}</p>
        </div>
      </aside>
    </div>
  </section>

  <section id="problem" class="section">
    <div class="shell">
      <div class="section-header">
        <h2>${escapeHtml(page.problem.title)}</h2>
        <p>${escapeHtml(page.problem.intro)}</p>
      </div>
      <div class="card-grid">${problemCards}</div>
      <div class="section-header" style="margin-top:1.7rem">
        <h3 style="margin:0;font-size:1.35rem">${escapeHtml(page.problem.timelineTitle)}</h3>
      </div>
      <div class="timeline">${timeline}</div>
    </div>
  </section>

  <section id="asks" class="section">
    <div class="shell">
      <div class="section-header">
        <h2>${escapeHtml(page.asks.title)}</h2>
        <p>${escapeHtml(page.asks.intro)}</p>
      </div>
      <div class="card-grid">${askCards}</div>
      <div class="section-header" style="margin-top:1.8rem">
        <h3 style="margin:0;font-size:1.35rem">${escapeHtml(page.asks.compareTitle)}</h3>
      </div>
      <div class="comparison">
        <div class="compare-panel" data-reveal>
          <h3>${escapeHtml(page.asks.compare.beforeTitle)}</h3>
          <ul class="list">${page.asks.compare.beforeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="compare-panel" data-reveal>
          <h3>${escapeHtml(page.asks.compare.afterTitle)}</h3>
          <ul class="list">${page.asks.compare.afterItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
  </section>

  <section id="law" class="section">
    <div class="shell">
      <div class="section-header">
        <h2>${escapeHtml(page.law.title)}</h2>
        <p>${escapeHtml(page.law.intro)}</p>
      </div>
      <div class="detail-grid">${legalCards}</div>
    </div>
  </section>

  ${renderComplaintSection(localeData)}

  <section id="faq" class="section">
    <div class="shell">
      <div class="section-header">
        <h2>${escapeHtml(page.faq.title)}</h2>
      </div>
      <div class="faq-list">${faqList}</div>
    </div>
  </section>

  <section id="action" class="section">
    <div class="shell">
      <div class="section-header">
        <h2>${escapeHtml(page.action.title)}</h2>
      </div>
      <div class="cta-grid">${actionCards}</div>
    </div>
  </section>`;
};

const renderSubHero = (localeData, pageType, pageData) => {
  const sectionLabel = localeData.footer.links.find((item) => item.route === pageType)?.label || pageType;
  const crumbs = [
    `<li><a href="${escapeHtml(withBase(localeData.homePath))}">${escapeHtml(localeData.footer.links[0].label)}</a></li>`,
    `<li><span>${escapeHtml(sectionLabel)}</span></li>`,
  ].join("");
  return `<section class="subhero">
    <div class="shell">
      <ol class="breadcrumbs">${crumbs}</ol>
      <div class="surface">
        <span class="eyebrow">${escapeHtml(pageData.hero.eyebrow)}</span>
        <h1 style="font-size:clamp(2.2rem,5vw,4rem);line-height:1;margin:.9rem 0 0">${escapeHtml(pageData.hero.title)}</h1>
        <p class="hero-text">${escapeHtml(pageData.hero.intro)}</p>
        <div class="share-row">
          <button class="button button-primary" type="button" data-share data-share-title="${escapeHtml(site.brand[localeData.locale])}" data-share-text="${escapeHtml(localeData.share.body)}" data-copied-label="${escapeHtml(localeData.share.copied)}">${escapeHtml(localeData.share.button)}</button>
          <button class="button button-secondary" type="button" data-copy-link data-copied-label="${escapeHtml(localeData.share.copied)}">${escapeHtml(localeData.share.copy)}</button>
        </div>
      </div>
    </div>
  </section>`;
};

const renderPrivacy = (localeData) => {
  const page = localeData.privacy;
  const a11y = localeData.accessibility;
  const consent = localeData.consent;
  const baseSections = page.sections.map((section) => `
    <article class="panel" data-reveal>
      <h2>${escapeHtml(section.title)}</h2>
      <ul class="list">${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>`).join("");
  const analyticsSection = hasGaTracking ? `
    <article class="panel" data-reveal>
      <h2>${escapeHtml(page.gaSection.title)}</h2>
      <ul class="list">${page.gaSection.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>` : `
    <article class="panel" data-reveal>
      <h2>${escapeHtml(page.noGaSection.title)}</h2>
      <ul class="list">${page.noGaSection.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>`;
  return `${renderSubHero(localeData, "privacy", page)}
  <section class="section">
    <div class="shell two-col">
      <div class="section-stack">${baseSections}</div>
      <div class="section-stack">
        ${analyticsSection}
        <article class="panel" data-reveal>
          <h2>${escapeHtml(a11y.privacySectionTitle)}</h2>
          <p class="muted">${escapeHtml(a11y.privacySectionIntro)}</p>
          ${renderAccessibilityControls(localeData)}
        </article>
      </div>
    </div>
  </section>`;
};

const renderPetition = (localeData) => {
  const page = localeData.petition;
  return `${renderSubHero(localeData, "petition", page)}
  <section class="section">
    <div class="shell two-col">
      <div class="section-stack">
        <article class="panel" data-reveal>
          <h2>${escapeHtml(page.summaryTitle)}</h2>
          <div class="prose">${page.summary.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
        </article>
        ${page.sections.map((section) => `
        <article class="panel" data-reveal>
          <h2>${escapeHtml(section.title)}</h2>
          <ul class="list">${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </article>`).join("")}
      </div>
      <div class="section-stack">
        <article class="panel" data-reveal>
          <h2>${escapeHtml(page.proposalTitle)}</h2>
          <p class="muted">${escapeHtml(page.proposalLead)}</p>
          <ol class="proposal-list">
            ${page.proposal.map((item) => `<li class="proposal-item"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.text)}</span></li>`).join("")}
          </ol>
        </article>
        <article class="panel" data-reveal>
          <h2>${escapeHtml(page.requestsTitle)}</h2>
          <ul class="list">${page.requests.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </article>
      </div>
    </div>
  </section>

  ${renderComplaintSection(localeData)}

  <section class="section">
    <div class="shell">
      <div class="section-header">
        <h2>${escapeHtml(page.balanceTitle)}</h2>
      </div>
      <div class="balance-grid">
        ${page.balanceCards.map((item) => `
          <article class="cta-card" data-reveal>
            <span class="card-kicker">+</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </article>`).join("")}
      </div>
      <div class="info-band" style="margin-top:1rem" data-reveal>
        <h3>${escapeHtml(localeData.share.title)}</h3>
        <p>${escapeHtml(page.privacyNote)}</p>
      </div>
    </div>
  </section>`;
};

const renderResources = (localeData) => {
  const page = localeData.resources;
  const embed = page.embed || {
    title: localeData.locale === "ro" ? "Sticker de susținere" : "Support sticker",
    intro: localeData.locale === "ro" ? "Poți integra stickerul pe site-ul tău cu codul de mai jos." : "You can embed this sticker on your website using the code below.",
    previewLabel: localeData.locale === "ro" ? "Preview sticker" : "Sticker preview",
    codeLabel: localeData.locale === "ro" ? "Cod embed (HTML)" : "Embed code (HTML)",
    copyCta: localeData.locale === "ro" ? "Copiază codul" : "Copy code",
  };
  const stickerPath = withBase(`/og/sticker-${localeData.locale}.svg`);
  const stickerAbsoluteUrl = absoluteUrl(`/og/sticker-${localeData.locale}.svg`);
  const stickerTargetUrl = absoluteUrl(localeData.homePath);
  const embedCode = `<a href="${stickerTargetUrl}" target="_blank">\n  <img src="${stickerAbsoluteUrl}" alt="${site.brand[localeData.locale]}" width="280" height="280">\n</a>`;
  const embedId = `embed-sticker-${localeData.locale}`;
  return `${renderSubHero(localeData, "resources", page)}
  <section class="section">
    <div class="shell section-stack">
      <article class="panel" data-reveal>
        <h2>${escapeHtml(embed.title)}</h2>
        <p class="muted">${escapeHtml(embed.intro)}</p>
        <div class="resource-embed">
          <div class="resource-embed-preview">
            <img src="${escapeHtml(stickerPath)}" alt="${escapeHtml(embed.previewLabel)}" width="280" height="280" loading="lazy">
          </div>
          <div class="field">
            <label for="${escapeHtml(embedId)}">${escapeHtml(embed.codeLabel)}</label>
            <textarea class="input textarea resource-embed-code" id="${escapeHtml(embedId)}" readonly>${escapeHtml(embedCode)}</textarea>
            <button class="button button-secondary" type="button" data-copy-embed data-copy-target="${escapeHtml(embedId)}" data-copied-label="${escapeHtml(localeData.share.copied)}">${escapeHtml(embed.copyCta)}</button>
          </div>
        </div>
      </article>
      ${page.groups.map((group) => `
        <article class="panel" data-reveal>
          <h2>${escapeHtml(group.title)}</h2>
          <div class="resource-list">
            ${group.items.map((item) => `
              <div class="resource-item">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.text)}</p>
                <a class="inline-link" href="${escapeHtml(withExternalReferral(item.href))}" ${externalLinkAttrs}>${escapeHtml(item.cta)} <span aria-hidden="true">↗</span></a>
              </div>`).join("")}
          </div>
        </article>`).join("")}
      
      <aside class="callout" data-reveal>
        <h3>${escapeHtml(page.calloutTitle)}</h3>
        <p>${escapeHtml(page.calloutText)}</p>
      </aside>
    </div>
  </section>`;
};

const renderPage = (localeData, pageType) => {
  const bodyClass = `page-${pageType}`;
  const mainContent =
    pageType === "home" ? renderHome(localeData)
    : pageType === "petition" ? renderPetition(localeData)
    : pageType === "resources" ? renderResources(localeData)
    : renderPrivacy(localeData);

  return `<!doctype html>
<html lang="${escapeHtml(localeData.locale)}">
<head>
  ${renderHead(localeData, pageType)}
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#content">${escapeHtml(localeData.labels.skipToContent)}</a>
  <div class="progress" id="progress" aria-hidden="true"></div>
  ${renderHeader(localeData, pageType)}
  <main id="content">
    ${mainContent}
  </main>
  ${renderFooter(localeData)}
  ${renderAccessibilityControls(localeData, { floating: true })}
  ${renderConsent(localeData)}
  <div class="toast" id="toast" role="status" aria-live="polite"><span>${escapeHtml(localeData.share.copied)}</span></div>
</body>
</html>`;
};

const render404 = () => {
  const ro = content.ro;
  const en = content.en;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 - Page not found</title>
  <meta name="robots" content="noindex">
  <link rel="stylesheet" href="${escapeHtml(withBase("/assets/site.css"))}">
  <script defer src="${escapeHtml(withBase("/assets/site.js"))}"></script>
</head>
<body>
  <div class="progress" id="progress" aria-hidden="true"></div>
  <main class="center" style="min-height:100vh;padding:2rem">
    <section class="surface" style="width:min(720px,100%)">
      <span class="eyebrow">404</span>
      <h1 style="font-size:clamp(2rem,6vw,3.6rem);line-height:1;margin:1rem 0 .8rem">Page not found / Pagina nu a fost găsită</h1>
      <p class="hero-text">Use one of the localized entry points below.</p>
      <div class="button-row">
        <a class="button button-primary" href="${escapeHtml(withBase(ro.homePath))}">${escapeHtml(site.brand.ro)}</a>
        <a class="button button-secondary" href="${escapeHtml(withBase(en.homePath))}">${escapeHtml(site.brand.en)}</a>
      </div>
    </section>
  </main>
</body>
</html>`;
};

const writeCompressed = async (filePath, contentValue) => {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, contentValue, "utf8");
  const buffer = Buffer.from(contentValue, "utf8");
  await fs.writeFile(`${filePath}.gz`, zlib.gzipSync(buffer, { level: 9 }));
  await fs.writeFile(`${filePath}.br`, zlib.brotliCompressSync(buffer));
};

const COVER_FONT_5X7 = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  6: ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "10000", "10000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  ".": ["00000", "00000", "00000", "00000", "00000", "00110", "00110"],
  ",": ["00000", "00000", "00000", "00000", "00110", "00110", "00100"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "/": ["00001", "00010", "00100", "01000", "10000", "00000", "00000"],
  ":": ["00000", "00110", "00110", "00000", "00110", "00110", "00000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

const normalizeCoverText = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 .,/:-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const renderCoverPixelText = ({
  text,
  x,
  y,
  scale,
  color,
  maxWidth = Infinity,
  lineGap = 2,
  align = "left",
}) => {
  const normalized = normalizeCoverText(text);
  if (!normalized) return "";
  const charAdvance = (5 + 1) * scale;
  const lineAdvance = 7 * scale + lineGap * scale;
  const measure = (line) => (line.length ? line.length * charAdvance - scale : 0);

  const words = normalized.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if (!word) continue;
    const candidate = current ? `${current} ${word}` : word;
    if (measure(candidate) <= maxWidth || !current) {
      current = candidate;
      continue;
    }
    lines.push(current);
    if (measure(word) <= maxWidth) {
      current = word;
      continue;
    }
    let chunk = "";
    for (const char of word) {
      const piece = `${chunk}${char}`;
      if (!chunk || measure(piece) <= maxWidth) {
        chunk = piece;
      } else {
        lines.push(chunk);
        chunk = char;
      }
    }
    current = chunk;
  }
  if (current) lines.push(current);

  const rects = [];
  lines.forEach((line, lineIndex) => {
    const lineWidth = measure(line);
    let cursorX = x;
    if (align === "center" && Number.isFinite(maxWidth)) {
      cursorX = x + Math.max(0, (maxWidth - lineWidth) / 2);
    } else if (align === "right" && Number.isFinite(maxWidth)) {
      cursorX = x + Math.max(0, maxWidth - lineWidth);
    }
    const lineY = y + lineIndex * lineAdvance;
    for (const char of line) {
      const glyph = COVER_FONT_5X7[char] || COVER_FONT_5X7[" "];
      for (let row = 0; row < glyph.length; row += 1) {
        const rowBits = glyph[row];
        for (let col = 0; col < rowBits.length; col += 1) {
          if (rowBits[col] === "1") {
            rects.push(
              `<rect x="${(cursorX + col * scale).toFixed(2)}" y="${(lineY + row * scale).toFixed(2)}" width="${scale.toFixed(2)}" height="${scale.toFixed(2)}"/>`
            );
          }
        }
      }
      cursorX += charAdvance;
    }
  });

  return `<g fill="${color}">${rects.join("")}</g>`;
};

const resolveSiteLinkData = () => {
  let domainLabel = "";
  let linkUrl = "";
  try {
    const parsed = new URL(site.siteUrl);
    domainLabel = parsed.host || domainLabel;
    linkUrl = parsed.toString();
  } catch {
    try {
      const parsed = new URL(`https://${site.siteUrl}`);
      domainLabel = parsed.host || domainLabel;
      linkUrl = parsed.toString();
    } catch {}
  }
  return { domainLabel, linkUrl };
};

const buildCoverConfigs = () => {
  const { domainLabel, linkUrl } = resolveSiteLinkData();
  return site.locales.map((locale) => {
    const localeData = content[locale];
    const ogImagePath = localeData.home?.meta?.ogImage || `/og/cover-${locale}.png`;
    const pngFile = path.basename(ogImagePath);
    const svgFile = pngFile.replace(/\.png$/i, ".svg");
    return {
      locale,
      pngFile,
      svgFile,
      heading: site.brand[locale],
      subheading: localeData.home.hero.subtitle,
      badge: localeData.home.hero.eyebrow,
      domainLabel,
      linkUrl,
      localeAccentA: locale === "ro" ? "#7EF2C8" : "#63D3FF",
      localeAccentB: locale === "ro" ? "#63D3FF" : "#7EF2C8",
    };
  });
};

const buildStickerConfigs = () => {
  const { domainLabel, linkUrl } = resolveSiteLinkData();
  return site.locales.map((locale) => {
    const localeData = content[locale];
    return {
      locale,
      svgFile: `sticker-${locale}.svg`,
      heading: site.brand[locale],
      subheading: localeData.home.hero.subtitle,
      domainLabel,
      linkUrl,
      localeAccentA: locale === "ro" ? "#7EF2C8" : "#63D3FF",
      localeAccentB: locale === "ro" ? "#63D3FF" : "#7EF2C8",
    };
  });
};

const buildCoverSvg = (logoSvg, coverConfig) => {
  const {
    locale,
    heading,
    subheading,
    badge,
    domainLabel,
    linkUrl,
    localeAccentA,
    localeAccentB,
  } = coverConfig;
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;
  const badgeBox = { x: 242, y: 118, w: 380, h: 36, pad: 14 };
  const domainBox = { x: 96, y: 418, w: 398, h: 60, pad: 16 };
  const localeTagBox = { x: 1028, y: 94, w: 94, h: 28, pad: 10 };
  const badgeScale = 1.18;
  const domainScale = 3.2;
  const localeTagScale = 2.8;
  const badgeGlyphHeight = 7 * badgeScale;
  const domainGlyphHeight = 7 * domainScale;
  const localeTagGlyphHeight = 7 * localeTagScale;
  const badgeText = renderCoverPixelText({
    text: badge,
    x: badgeBox.x + badgeBox.pad,
    y: badgeBox.y + (badgeBox.h - badgeGlyphHeight) / 2,
    scale: badgeScale,
    color: "#B8D9FB",
    maxWidth: badgeBox.w - badgeBox.pad * 2,
    lineGap: 2,
    align: "center",
  });
  const headingText = renderCoverPixelText({
    text: heading,
    x: 96,
    y: 246,
    scale: 7.9,
    color: "#EAF2FF",
    maxWidth: 1000,
    lineGap: 1.5,
  });
  const subheadingText = renderCoverPixelText({
    text: subheading,
    x: 96,
    y: 354,
    scale: 2.5,
    color: "#AFC8E8",
    maxWidth: 980,
    lineGap: 2.5,
  });
  const domainText = renderCoverPixelText({
    text: domainLabel,
    x: domainBox.x + domainBox.pad,
    y: domainBox.y + (domainBox.h - domainGlyphHeight) / 2,
    scale: domainScale,
    color: "#CFF7E8",
    maxWidth: domainBox.w - domainBox.pad * 2,
    lineGap: 2,
    align: "center",
  });
  const localeTagText = renderCoverPixelText({
    text: locale.toUpperCase(),
    x: localeTagBox.x + localeTagBox.pad,
    y: localeTagBox.y + (localeTagBox.h - localeTagGlyphHeight) / 2,
    scale: localeTagScale,
    color: "#EAF2FF",
    maxWidth: localeTagBox.w - localeTagBox.pad * 2,
    lineGap: 1,
    align: "center",
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <defs>
    <linearGradient id="cover-bg" x1="40" y1="20" x2="1140" y2="620" gradientUnits="userSpaceOnUse">
      <stop stop-color="#07101B"/>
      <stop offset="1" stop-color="#0E1D33"/>
    </linearGradient>
    <linearGradient id="glow-a" x1="120" y1="120" x2="720" y2="520" gradientUnits="userSpaceOnUse">
      <stop stop-color="${localeAccentA}" stop-opacity=".18"/>
      <stop offset="1" stop-color="${localeAccentA}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="glow-b" x1="540" y1="80" x2="1080" y2="560" gradientUnits="userSpaceOnUse">
      <stop stop-color="${localeAccentB}" stop-opacity=".16"/>
      <stop offset="1" stop-color="${localeAccentB}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" rx="36" fill="url(#cover-bg)"/>
  <circle cx="320" cy="140" r="280" fill="url(#glow-a)"/>
  <circle cx="980" cy="500" r="260" fill="url(#glow-b)"/>
  <rect x="68" y="66" width="1064" height="498" rx="30" stroke="#8EC8FF" stroke-opacity=".22" stroke-width="2"/>
  <rect x="${localeTagBox.x}" y="${localeTagBox.y}" width="${localeTagBox.w}" height="${localeTagBox.h}" rx="14" fill="${localeAccentA}" fill-opacity=".35"/>
  ${localeTagText}
  <image href="${logoDataUri}" x="96" y="104" width="122" height="122"/>
  <rect x="${badgeBox.x}" y="${badgeBox.y}" width="${badgeBox.w}" height="${badgeBox.h}" rx="18" fill="#0F2239" stroke="#63D3FF" stroke-opacity=".4"/>
  ${badgeText}
  ${headingText}
  ${subheadingText}
  <a href="${escapeHtml(linkUrl)}" target="_blank" style="cursor:pointer">
    <rect x="${domainBox.x}" y="${domainBox.y}" width="${domainBox.w}" height="${domainBox.h}" rx="15" fill="#132A44" stroke="#7EF2C8" stroke-opacity=".45"/>
    ${domainText}
  </a>
</svg>`;
};

const buildStickerSvg = (logoSvg, stickerConfig) => {
  const {
    locale,
    heading,
    subheading,
    domainLabel,
    linkUrl,
    localeAccentA,
    localeAccentB,
  } = stickerConfig;
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;
  const localeTagBox = { x: 380, y: 48, w: 90, h: 30, pad: 8 };
  const domainBox = { x: 96, y: 420, w: 320, h: 54, pad: 12 };
  const localeTagScale = 2.25;
  const domainScale = 2.2;
  const localeTagGlyphHeight = 7 * localeTagScale;
  const domainGlyphHeight = 7 * domainScale;
  const headingText = renderCoverPixelText({
    text: heading,
    x: 48,
    y: 250,
    scale: 5.25,
    color: "#EAF2FF",
    maxWidth: 416,
    lineGap: 1.5,
    align: "center",
  });
  const subheadingText = renderCoverPixelText({
    text: subheading,
    x: 52,
    y: 356,
    scale: 1.65,
    color: "#BBD3EE",
    maxWidth: 408,
    lineGap: 2,
    align: "center",
  });
  const domainText = renderCoverPixelText({
    text: domainLabel,
    x: domainBox.x + domainBox.pad,
    y: domainBox.y + (domainBox.h - domainGlyphHeight) / 2,
    scale: domainScale,
    color: "#CFF7E8",
    maxWidth: domainBox.w - domainBox.pad * 2,
    lineGap: 1,
    align: "center",
  });
  const localeTagText = renderCoverPixelText({
    text: locale.toUpperCase(),
    x: localeTagBox.x + localeTagBox.pad,
    y: localeTagBox.y + (localeTagBox.h - localeTagGlyphHeight) / 2,
    scale: localeTagScale,
    color: "#EAF2FF",
    maxWidth: localeTagBox.w - localeTagBox.pad * 2,
    lineGap: 1,
    align: "center",
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="sticker-bg" x1="24" y1="16" x2="486" y2="500" gradientUnits="userSpaceOnUse">
      <stop stop-color="#07101B"/>
      <stop offset="1" stop-color="#0E1D33"/>
    </linearGradient>
    <linearGradient id="sticker-glow-a" x1="44" y1="40" x2="340" y2="322" gradientUnits="userSpaceOnUse">
      <stop stop-color="${localeAccentA}" stop-opacity=".2"/>
      <stop offset="1" stop-color="${localeAccentA}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="sticker-glow-b" x1="190" y1="214" x2="500" y2="494" gradientUnits="userSpaceOnUse">
      <stop stop-color="${localeAccentB}" stop-opacity=".16"/>
      <stop offset="1" stop-color="${localeAccentB}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="40" fill="url(#sticker-bg)"/>
  <circle cx="160" cy="110" r="150" fill="url(#sticker-glow-a)"/>
  <circle cx="420" cy="408" r="140" fill="url(#sticker-glow-b)"/>
  <rect x="32" y="32" width="448" height="448" rx="28" stroke="#8EC8FF" stroke-opacity=".24" stroke-width="2"/>
  <rect x="${localeTagBox.x}" y="${localeTagBox.y}" width="${localeTagBox.w}" height="${localeTagBox.h}" rx="15" fill="${localeAccentA}" fill-opacity=".35"/>
  ${localeTagText}
  <image href="${logoDataUri}" x="176" y="64" width="160" height="160"/>
  ${headingText}
  ${subheadingText}
  <a href="${escapeHtml(linkUrl)}" target="_blank" style="cursor:pointer">
    <rect x="${domainBox.x}" y="${domainBox.y}" width="${domainBox.w}" height="${domainBox.h}" rx="16" fill="#132A44" stroke="#7EF2C8" stroke-opacity=".45"/>
    ${domainText}
  </a>
</svg>`;
};

const toDataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

const renderSvgToPng = async (svg, targetPath, width) => {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    background: "rgba(0,0,0,0)",
    font: { loadSystemFonts: true },
  });
  await fs.writeFile(targetPath, resvg.render().asPng());
};

const buildIconCanvas = (logoSvg, { size, padding = 0, background = "" }) => {
  const inset = Math.round(size * padding);
  const inner = size - inset * 2;
  const logoDataUri = toDataUri(logoSvg);
  const backgroundLayer = background
    ? `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.25)}" fill="${background}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
    ${backgroundLayer}
    <image href="${logoDataUri}" x="${inset}" y="${inset}" width="${inner}" height="${inner}" preserveAspectRatio="xMidYMid meet"/>
  </svg>`;
};

const generateBrandAssets = async (outputRoot) => {
  const logoSvg = await fs.readFile(path.join(brandingDir, "logo.svg"), "utf8");
  const iconsDir = path.join(outputRoot, "icons");
  const ogDir = path.join(outputRoot, "og");
  const coverConfigs = buildCoverConfigs();
  const stickerConfigs = buildStickerConfigs();
  await ensureDir(iconsDir);
  await ensureDir(ogDir);

  await fs.writeFile(path.join(iconsDir, "logo.svg"), logoSvg, "utf8");
  await fs.writeFile(path.join(iconsDir, "favicon.svg"), logoSvg, "utf8");

  const iconSpecs = [
    { file: "favicon-16.png", size: 16 },
    { file: "favicon-32.png", size: 32 },
    { file: "apple-touch-icon.png", size: 180 },
    { file: "icon-192.png", size: 192 },
    { file: "icon-512.png", size: 512 },
    { file: "maskable-512.png", size: 512, padding: 0.125, background: "#0A1527" },
  ];
  await Promise.all([
    ...iconSpecs.map((spec) =>
      renderSvgToPng(
        buildIconCanvas(logoSvg, {
          size: spec.size,
          padding: spec.padding || 0,
          background: spec.background || "",
        }),
        path.join(iconsDir, spec.file),
        spec.size
      )
    ),
  ]);

  await fs.writeFile(path.join(ogDir, "cover-config.json"), JSON.stringify(coverConfigs, null, 2), "utf8");
  await fs.writeFile(path.join(ogDir, "sticker-config.json"), JSON.stringify(stickerConfigs, null, 2), "utf8");
  await Promise.all(
    coverConfigs.map(async (coverConfig) => {
      const coverSvg = buildCoverSvg(logoSvg, coverConfig);
      await fs.writeFile(path.join(ogDir, coverConfig.svgFile), coverSvg, "utf8");
      await renderSvgToPng(coverSvg, path.join(ogDir, coverConfig.pngFile), 1200);
    })
  );
  await Promise.all(
    stickerConfigs.map(async (stickerConfig) => {
      const stickerSvg = buildStickerSvg(logoSvg, stickerConfig);
      await fs.writeFile(path.join(ogDir, stickerConfig.svgFile), stickerSvg, "utf8");
    })
  );
};

const build = async () => {
  await fs.rm(distDir, { recursive: true, force: true });
  await ensureDir(path.join(distDir, "assets"));

  const css = minifyCss(await fs.readFile(path.join(srcDir, "styles.css"), "utf8"));
  const complaintModuleJs = await fs.readFile(path.join(srcDir, "modules", "complaint-form.js"), "utf8");
  const appJs = stripGaRuntime(await fs.readFile(path.join(srcDir, "app.js"), "utf8"));
  const js = minifyJs(`${complaintModuleJs}\n\n${appJs}`);
  await writeCompressed(path.join(distDir, "assets", "site.css"), css);
  await writeCompressed(path.join(distDir, "assets", "site.js"), js);

  await generateBrandAssets(distDir);

  for (const page of pageOrder) {
    const localeData = content[page.locale];
    const html = minifyHtml(renderPage(localeData, page.type));
    await writeCompressed(routeToFile(page.route), html);
  }

  await writeCompressed(path.join(distDir, "404.html"), minifyHtml(render404()));

  const sitemapEntries = pageOrder.map((page) => {
    const route = pagePathForType(content[page.locale], page.type);
    return `<url><loc>${escapeHtml(absoluteUrl(route))}</loc><lastmod>${buildDate}</lastmod></url>`;
  }).join("");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries}</urlset>`;
  await writeCompressed(path.join(distDir, "sitemap.xml"), sitemap);

  const robots = `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`;
  await writeCompressed(path.join(distDir, "robots.txt"), robots);

  const manifest = JSON.stringify({
    name: site.brand.ro,
    short_name: "Nu în numele meu",
    lang: "ro",
    dir: "ltr",
    start_url: withBase("/"),
    display: "standalone",
    background_color: "#08111d",
    theme_color: "#08111d",
    icons: [
      { src: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: withBase("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: withBase("/icons/maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  }, null, 2);
  await writeCompressed(path.join(distDir, "site.webmanifest"), manifest);

  const cspScriptSrc = hasGaTracking
    ? "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;"
    : "script-src 'self' 'unsafe-inline';";
  const cspConnectSrc = hasGaTracking
    ? "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com;"
    : "connect-src 'self';";
  const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), camera=(), microphone=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; ${cspScriptSrc} font-src 'self' data:; ${cspConnectSrc} object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/sitemap.xml
  Cache-Control: public, max-age=3600

/robots.txt
  Cache-Control: public, max-age=3600
`;
  await fs.writeFile(path.join(distDir, "_headers"), headers, "utf8");
  await fs.writeFile(path.join(distDir, ".nojekyll"), "", "utf8");
};

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
