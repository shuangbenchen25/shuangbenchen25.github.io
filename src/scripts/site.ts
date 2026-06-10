import { translations, type Locale } from "../data/site";
import { searchIndex } from "../data/search";

const root = document.documentElement;
const languageToggles = Array.from(document.querySelectorAll<HTMLButtonElement>("#language-toggle, [data-language-toggle]"));
const themeToggles = Array.from(document.querySelectorAll<HTMLButtonElement>("#theme-toggle, [data-theme-toggle]"));
const searchInputs = Array.from(document.querySelectorAll<HTMLInputElement>("#site-search, [data-site-search]"));
const searchResultsNodes = Array.from(document.querySelectorAll<HTMLDivElement>("#search-results, [data-search-results]"));
const menuToggle = document.querySelector<HTMLButtonElement>("#menu-toggle");
const nav = document.querySelector<HTMLElement>(".nav");
const navLinks = document.querySelector<HTMLElement>(".nav-links");
const navTools = document.querySelector<HTMLElement>(".nav-tools");
const refDemo = document.querySelector<HTMLElement>(".ref-demo");
const refDemoMenuToggle = document.querySelector<HTMLButtonElement>("[data-ref-demo-menu]");
const refDemoDockToggle = document.querySelector<HTMLButtonElement>("[data-ref-demo-dock-toggle]");
const refDemoCursor = document.querySelector<HTMLElement>("[data-ref-demo-cursor]");
const siteDockToggle = document.querySelector<HTMLButtonElement>("[data-site-dock-toggle]");
const siteCursor = document.querySelector<HTMLElement>("[data-site-cursor]");
const lastModifiedNode = document.querySelector<HTMLElement>("[data-last-modified]");
const finePointer = window.matchMedia("(pointer: fine)");

let currentLanguage = (localStorage.getItem("language") as Locale | null) || "en";
let menuScrollY = 0;
const refDemoDockVisibleOffset = 120;

localStorage.removeItem("themeMode");
root.dataset.theme = "light";

function applyLanguage(language: Locale) {
  currentLanguage = language;
  localStorage.setItem("language", language);
  root.lang = language === "zh" ? "zh-CN" : "en";

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n as keyof typeof translations.en | undefined;
    if (key && translations[language][key]) {
      node.textContent = translations[language][key];
    }
  });

  document.querySelectorAll<HTMLInputElement>("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder as keyof typeof translations.en | undefined;
    if (key && translations[language][key]) {
      node.placeholder = translations[language][key];
    }
  });

  document.querySelectorAll<HTMLElement>("[data-locale-en]").forEach((node) => {
    const text = language === "zh" ? node.dataset.localeZh : node.dataset.localeEn;
    if (text) {
      node.textContent = text;
    }
  });

  languageToggles.forEach((toggle) => {
    toggle.textContent = language === "en" ? "中文" : "EN";
  });
  updateThemeButton();
  updateLastModified();
  renderSearchForAllInputs();
}

function formatLastModified() {
  const date = new Date(document.lastModified);
  if (Number.isNaN(date.getTime())) {
    return document.lastModified;
  }
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function updateLastModified() {
  if (!lastModifiedNode) {
    return;
  }
  lastModifiedNode.textContent = `${translations[currentLanguage]["footer.updated"]}: ${formatLastModified()}`;
}

function updateThemeButton() {
  themeToggles.forEach((toggle) => {
    toggle.hidden = true;
    toggle.tabIndex = -1;
    toggle.setAttribute("aria-hidden", "true");
  });
}

function searchResultsForInput(input: HTMLInputElement) {
  return input.closest(".search")?.querySelector<HTMLDivElement>("#search-results, [data-search-results]") || null;
}

function positionSearchResults(input: HTMLInputElement, resultsNode: HTMLDivElement) {
  const rect = input.getBoundingClientRect();
  const isHeaderSearch = Boolean(resultsNode.closest(".site-ref-header-content"));
  const top = isHeaderSearch ? Math.min(Math.max(rect.bottom + 8, 68), 112) : rect.bottom + 8;
  resultsNode.style.setProperty("--search-results-top", `${Math.round(top)}px`);
  resultsNode.style.setProperty("--search-results-right", `${Math.max(10, Math.round(window.innerWidth - rect.right))}px`);
  resultsNode.style.setProperty("--search-results-width", `${Math.min(360, Math.max(260, Math.round(rect.width * 1.82)))}px`);
}

function renderSearch(query: string, resultsNode: HTMLDivElement | null) {
  if (!resultsNode) {
    return;
  }
  const owningInput = resultsNode.closest(".search")?.querySelector<HTMLInputElement>("input");
  if (owningInput) {
    positionSearchResults(owningInput, resultsNode);
  }
  const cleanQuery = query.trim().toLowerCase();
  resultsNode.innerHTML = "";
  if (!cleanQuery) {
    resultsNode.classList.remove("is-open");
    return;
  }

  const matches = searchIndex
    .filter((item) => {
      const title = item.title[currentLanguage].toLowerCase();
      return title.includes(cleanQuery) || item.text.toLowerCase().includes(cleanQuery);
    })
    .slice(0, 6);

  if (matches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "search-result";
    empty.innerHTML = `<span>${translations[currentLanguage]["search.none"]}</span>`;
    resultsNode.appendChild(empty);
  } else {
    matches.forEach((item) => {
      const result = document.createElement("a");
      result.className = "search-result";
      result.href = item.url;
      result.innerHTML = `<strong>${item.title[currentLanguage]}</strong><span>${item.text.slice(0, 118)}...</span>`;
      resultsNode.appendChild(result);
    });
  }
  resultsNode.classList.add("is-open");
}

function renderSearchForAllInputs() {
  searchInputs.forEach((input) => {
    renderSearch(input.value || "", searchResultsForInput(input));
  });
}

function markActiveNav() {
  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll<HTMLAnchorElement>(".nav-links a").forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    const normalizedLink = linkPath === "/index.html" ? "/" : linkPath;
    if (normalizedLink === currentPath || (normalizedLink !== "/" && currentPath.startsWith(normalizedLink))) {
      link.classList.add("is-active");
    }
  });
}

function setMenuPanelState(isOpen: boolean) {
  [navLinks, navTools].forEach((panel) => {
    if (!panel) {
      return;
    }
    if (isOpen) {
      panel.style.transition = "none";
      panel.style.opacity = "1";
      panel.style.pointerEvents = "auto";
      panel.style.transform = "translateX(0)";
      return;
    }
    panel.style.removeProperty("transition");
    panel.style.removeProperty("opacity");
    panel.style.removeProperty("pointer-events");
    panel.style.removeProperty("transform");
  });
}

function setMenuOpen(isOpen: boolean) {
  if (!nav) {
    return;
  }
  if (isOpen) {
    menuScrollY = window.scrollY;
  }
  nav.classList.toggle("is-open", isOpen);
  navLinks?.classList.toggle("is-open", isOpen);
  navTools?.classList.toggle("is-open", isOpen);
  setMenuPanelState(isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  if (!isOpen) {
    window.scrollTo(0, menuScrollY);
  }
}

function updateRefDemoDockVisibility() {
  if (!refDemo) {
    return;
  }
  const isVisible = window.scrollY > refDemoDockVisibleOffset;
  refDemo.classList.toggle("is-dock-visible", isVisible);
  if (!isVisible && refDemo.classList.contains("is-dock-open")) {
    refDemo.classList.remove("is-dock-open");
    refDemoDockToggle?.setAttribute("aria-expanded", "false");
  }
}

function updateSiteDockVisibility() {
  if (!siteDockToggle) {
    return;
  }
  const isVisible = window.scrollY > refDemoDockVisibleOffset;
  document.body.classList.toggle("is-dock-visible", isVisible);
  if (!isVisible && document.body.classList.contains("is-dock-open")) {
    document.body.classList.remove("is-dock-open");
    siteDockToggle.setAttribute("aria-expanded", "false");
  }
}

function updateRefDemoCursor(event: PointerEvent) {
  if (!refDemo || !refDemoCursor || !finePointer.matches) {
    return;
  }
  const target = event.target as Element | null;
  const isHoveringTarget = Boolean(target?.closest("a, button, input, textarea, select, .ref-demo-feature-mark, .ref-demo-feature-details p, .ref-demo-feature-console, .ref-demo-media-card"));
  refDemo.style.setProperty("--cursor-x", `${event.clientX + 14}px`);
  refDemo.style.setProperty("--cursor-y", `${event.clientY + 14}px`);
  refDemo.classList.add("is-cursor-live");
  refDemo.classList.toggle("is-cursor-hover", isHoveringTarget);
}

function hideRefDemoCursor() {
  refDemo?.classList.remove("is-cursor-live", "is-cursor-hover");
}

function updateSiteCursor(event: PointerEvent) {
  if (refDemo || !siteCursor || !finePointer.matches) {
    return;
  }
  const target = event.target as Element | null;
  const isHoveringTarget = Boolean(target?.closest("a, button, input, textarea, select, summary, .card, .news-item, .project-card, .post-item"));
  document.body.style.setProperty("--cursor-x", `${event.clientX + 14}px`);
  document.body.style.setProperty("--cursor-y", `${event.clientY + 14}px`);
  document.body.classList.add("is-cursor-live");
  document.body.classList.toggle("is-cursor-hover", isHoveringTarget);
}

function hideSiteCursor() {
  document.body.classList.remove("is-cursor-live", "is-cursor-hover");
}

menuToggle?.addEventListener("click", () => {
  if (!nav) {
    return;
  }
  setMenuOpen(!nav.classList.contains("is-open"));
});

languageToggles.forEach((toggle) => toggle.addEventListener("click", () => {
  applyLanguage(currentLanguage === "en" ? "zh" : "en");
}));

refDemoMenuToggle?.addEventListener("click", () => {
  const isOpen = !refDemo?.classList.contains("is-menu-open");
  refDemo?.classList.toggle("is-menu-open", isOpen);
  refDemoMenuToggle.setAttribute("aria-expanded", String(isOpen));
});

refDemoDockToggle?.addEventListener("click", () => {
  const isOpen = !refDemo?.classList.contains("is-dock-open");
  refDemo?.classList.toggle("is-dock-open", isOpen);
  refDemo?.classList.toggle("is-dock-visible", true);
  refDemoDockToggle.setAttribute("aria-expanded", String(isOpen));
});

siteDockToggle?.addEventListener("click", () => {
  const isOpen = !document.body.classList.contains("is-dock-open");
  document.body.classList.toggle("is-dock-open", isOpen);
  document.body.classList.toggle("is-dock-visible", true);
  siteDockToggle.setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("scroll", () => {
  updateRefDemoDockVisibility();
  updateSiteDockVisibility();
}, { passive: true });

refDemo?.addEventListener("pointermove", updateRefDemoCursor);
refDemo?.addEventListener("pointerleave", hideRefDemoCursor);
document.addEventListener("pointermove", updateSiteCursor);
document.addEventListener("pointerleave", hideSiteCursor);

searchInputs.forEach((input) => input.addEventListener("input", (event) => {
  const currentInput = event.target as HTMLInputElement;
  renderSearch(currentInput.value, searchResultsForInput(currentInput));
}));

searchInputs.forEach((input) => input.addEventListener("focus", () => {
  if (input.value.trim()) {
    const resultsNode = searchResultsForInput(input);
    if (resultsNode) {
      positionSearchResults(input, resultsNode);
      resultsNode.classList.add("is-open");
    }
  }
}));

searchResultsNodes.forEach((resultsNode) => resultsNode.addEventListener("click", (event) => {
  if ((event.target as Element).closest("a")) {
    refDemo?.classList.remove("is-menu-open");
    refDemoMenuToggle?.setAttribute("aria-expanded", "false");
  }
}));

document.addEventListener("click", (event) => {
  const target = event.target as Element;
  if (!target.closest(".search")) {
    searchResultsNodes.forEach((resultsNode) => resultsNode.classList.remove("is-open"));
  }
  if (
    nav?.classList.contains("is-open") &&
    !target.closest(".nav-links, .nav-tools, .menu-toggle")
  ) {
    setMenuOpen(false);
  }
  if (
    refDemo?.classList.contains("is-menu-open") &&
    !target.closest(".ref-demo-header-content, [data-ref-demo-menu]")
  ) {
    refDemo.classList.remove("is-menu-open");
    refDemoMenuToggle?.setAttribute("aria-expanded", "false");
  }
  if (
    refDemo?.classList.contains("is-dock-open") &&
    !target.closest(".ref-demo-dock, [data-ref-demo-dock-toggle]")
  ) {
    refDemo.classList.remove("is-dock-open");
    refDemoDockToggle?.setAttribute("aria-expanded", "false");
  }
  if (
    document.body.classList.contains("is-dock-open") &&
    !target.closest(".site-ref-dock, [data-site-dock-toggle]")
  ) {
    document.body.classList.remove("is-dock-open");
    siteDockToggle?.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    const visibleSearchInput = searchInputs.find((input) => input.offsetParent !== null) || searchInputs[0];
    visibleSearchInput?.focus();
  }
  if (event.key === "Escape" && nav?.classList.contains("is-open")) {
    setMenuOpen(false);
  }
  if (event.key === "Escape" && refDemo?.classList.contains("is-menu-open")) {
    refDemo.classList.remove("is-menu-open");
    refDemoMenuToggle?.setAttribute("aria-expanded", "false");
  }
  if (event.key === "Escape" && refDemo?.classList.contains("is-dock-open")) {
    refDemo.classList.remove("is-dock-open");
    refDemoDockToggle?.setAttribute("aria-expanded", "false");
  }
  if (event.key === "Escape" && document.body.classList.contains("is-dock-open")) {
    document.body.classList.remove("is-dock-open");
    siteDockToggle?.setAttribute("aria-expanded", "false");
  }
});

markActiveNav();
updateRefDemoDockVisibility();
updateSiteDockVisibility();
root.dataset.theme = "light";
updateThemeButton();
applyLanguage(currentLanguage);
