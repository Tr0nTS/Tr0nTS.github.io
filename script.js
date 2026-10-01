document.getElementById("year").textContent = new Date().getFullYear();

const themeToggle = document.querySelector(".theme-toggle");
const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

const updateThemeToggle = (theme) => {
  const isLight = theme === "light";
  themeToggle?.setAttribute("aria-checked", String(isLight));
  themeToggle?.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`);
};

const setTheme = (theme, persist = true) => {
  document.documentElement.dataset.theme = theme;
  updateThemeToggle(theme);

  if (persist) {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // The selected theme still works when storage is unavailable.
    }
  }
};

updateThemeToggle(document.documentElement.dataset.theme || "dark");

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  setTheme(nextTheme);
});

systemTheme.addEventListener?.("change", (event) => {
  try {
    if (localStorage.getItem("theme")) return;
  } catch {
    return;
  }
  setTheme(event.matches ? "light" : "dark", false);
});

const header = document.querySelector(".header");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  header.style.setProperty("--scroll-progress", `${Math.min(progress, 100)}%`);
};

const setActiveLink = () => {
  const offset = window.scrollY + 140;
  let current = sections[0]?.id ?? "home";

  sections.forEach((section) => {
    if (offset >= section.offsetTop) current = section.id;
  });

  const doc = document.documentElement;
  const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 8;
  if (atBottom) current = sections[sections.length - 1].id;

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${current}`;
    link.classList.toggle("is-active", isActive);
  });
};

setHeaderState();
setActiveLink();
window.addEventListener("scroll", () => {
  setHeaderState();
  setActiveLink();
}, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 60}ms`;
    observer.observe(item);
  });
}

const interactiveCards = document.querySelectorAll(
  ".skill-card, .project-card, .info-card, .contact-card"
);

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    });
  });

  const heroCard = document.querySelector(".hero-card");

  heroCard?.addEventListener("pointermove", (event) => {
    const rect = heroCard.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -3;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 3;
    heroCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  heroCard?.addEventListener("pointerleave", () => {
    heroCard.style.transform = "";
  });
}
