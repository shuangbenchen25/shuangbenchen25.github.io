import { translations, type Locale } from "../data/site";
import { searchIndex } from "../data/search";

const root = document.documentElement;
const languageToggle = document.querySelector<HTMLButtonElement>("#language-toggle");
const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
const searchInput = document.querySelector<HTMLInputElement>("#site-search");
const searchResults = document.querySelector<HTMLDivElement>("#search-results");
const menuToggle = document.querySelector<HTMLButtonElement>("#menu-toggle");
const nav = document.querySelector<HTMLElement>(".nav");
const navLinks = document.querySelector<HTMLElement>(".nav-links");
const navTools = document.querySelector<HTMLElement>(".nav-tools");
const lastModifiedNode = document.querySelector<HTMLElement>("[data-last-modified]");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeModes = ["system", "light", "dark"] as const;

type ThemeMode = typeof themeModes[number];

let currentLanguage = (localStorage.getItem("language") as Locale | null) || "en";
let currentThemeMode = (localStorage.getItem("themeMode") as ThemeMode | null) || "system";
let menuScrollY = 0;

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

  if (languageToggle) {
    languageToggle.textContent = language === "en" ? "中文" : "EN";
  }
  updateThemeButton();
  updateLastModified();
  renderSearch(searchInput?.value || "");
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

function effectiveTheme() {
  if (currentThemeMode === "system") {
    return systemTheme.matches ? "dark" : "light";
  }
  return currentThemeMode;
}

function themeIcon(mode: ThemeMode) {
  if (mode === "light") {
    return '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/></svg>';
  }
  if (mode === "dark") {
    return '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M20.4 14.7A7.8 7.8 0 0 1 9.3 3.6 8.7 8.7 0 1 0 20.4 14.7Z"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3.5" y="4.5" width="17" height="11" rx="2"/><path d="M8 20h8M10 15.5v4.5M14 15.5v4.5"/></svg>';
}

function updateThemeButton() {
  if (!themeToggle) {
    return;
  }
  const label = translations[currentLanguage][`theme.${currentThemeMode}`];
  themeToggle.innerHTML = `<span class="theme-icon">${themeIcon(currentThemeMode)}</span><span class="theme-label">${label}</span>`;
  themeToggle.setAttribute("aria-label", label);
}

function applyThemeMode(mode: ThemeMode) {
  currentThemeMode = mode;
  localStorage.setItem("themeMode", mode);
  root.dataset.theme = effectiveTheme();
  updateThemeButton();
}

function renderSearch(query: string) {
  if (!searchResults) {
    return;
  }
  const cleanQuery = query.trim().toLowerCase();
  searchResults.innerHTML = "";
  if (!cleanQuery) {
    searchResults.classList.remove("is-open");
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
    searchResults.appendChild(empty);
  } else {
    matches.forEach((item) => {
      const result = document.createElement("a");
      result.className = "search-result";
      result.href = item.url;
      result.innerHTML = `<strong>${item.title[currentLanguage]}</strong><span>${item.text.slice(0, 118)}...</span>`;
      searchResults.appendChild(result);
    });
  }
  searchResults.classList.add("is-open");
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

menuToggle?.addEventListener("click", () => {
  if (!nav) {
    return;
  }
  setMenuOpen(!nav.classList.contains("is-open"));
});

languageToggle?.addEventListener("click", () => {
  applyLanguage(currentLanguage === "en" ? "zh" : "en");
});

themeToggle?.addEventListener("click", () => {
  const nextMode = themeModes[(themeModes.indexOf(currentThemeMode) + 1) % themeModes.length];
  applyThemeMode(nextMode);
});

searchInput?.addEventListener("input", (event) => {
  renderSearch((event.target as HTMLInputElement).value);
});

searchInput?.addEventListener("focus", () => {
  if (searchInput.value.trim()) {
    searchResults?.classList.add("is-open");
  }
});

document.addEventListener("click", (event) => {
  const target = event.target as Element;
  if (!target.closest(".search")) {
    searchResults?.classList.remove("is-open");
  }
  if (
    nav?.classList.contains("is-open") &&
    !target.closest(".nav-links, .nav-tools, .menu-toggle")
  ) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput?.focus();
  }
  if (event.key === "Escape" && nav?.classList.contains("is-open")) {
    setMenuOpen(false);
  }
});

systemTheme.addEventListener("change", () => {
  if (currentThemeMode === "system") {
    root.dataset.theme = effectiveTheme();
  }
});

markActiveNav();
applyThemeMode(currentThemeMode);
applyLanguage(currentLanguage);
