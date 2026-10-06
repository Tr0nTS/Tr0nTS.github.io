document.getElementById("year").textContent = new Date().getFullYear();

const backgroundMusic = document.getElementById("background-music");
const musicPrompt = document.querySelector(".music-prompt");

if (backgroundMusic) {
  backgroundMusic.volume = 0.35;
  backgroundMusic.pause();
  backgroundMusic.load();
  backgroundMusic.currentTime = 0;

  const playBackgroundMusic = () => {
    backgroundMusic.play().then(() => {
      musicPrompt?.classList.remove("is-visible");
      document.removeEventListener("pointerdown", playBackgroundMusic);
      document.removeEventListener("keydown", playBackgroundMusic);
    }).catch(() => {
      musicPrompt?.classList.add("is-visible");
    });
  };

  playBackgroundMusic();
  document.addEventListener("pointerdown", playBackgroundMusic);
  document.addEventListener("keydown", playBackgroundMusic);
  musicPrompt?.addEventListener("click", playBackgroundMusic);

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    playBackgroundMusic();
  });

  window.addEventListener("beforeunload", () => {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  });
}

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

const avatarSlides = [...document.querySelectorAll(".avatar-slide")];
let activeAvatarSlide = 0;

if (avatarSlides.length > 1) {
  window.setInterval(() => {
    avatarSlides[activeAvatarSlide].classList.remove("is-active");
    activeAvatarSlide = (activeAvatarSlide + 1) % avatarSlides.length;
    avatarSlides[activeAvatarSlide].classList.add("is-active");
  }, 7000);
}

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
  ".skill-card, .project-card, .info-card"
);

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    });
  });

  const avatar = document.querySelector(".avatar");

  avatar?.addEventListener("pointermove", (event) => {
    const rect = avatar.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -3;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 3;
    avatar.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  avatar?.addEventListener("pointerleave", () => {
    avatar.style.transform = "";
  });
}

const contactMascot = document.querySelector(".contact-mascot");
const mascotSquash = contactMascot?.querySelector(".contact-mascot-squash");
const mascotDirections = contactMascot?.querySelector(".contact-mascot-directions");
const mascotReactions = contactMascot?.querySelector(".contact-mascot-reactions");

if (contactMascot && mascotDirections && mascotReactions) {
  const directions = ["right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right"];
  const directionCells = {
    "up-left": 0, up: 1, "up-right": 2,
    left: 3, center: 4, right: 5,
    "down-left": 6, down: 7, "down-right": 8
  };
  const reactionCells = { blink: 0, heart: 1, sparkle: 2, dizzy: 7, delighted: 8 };
  const payoffs = ["heart", "sparkle", "delighted"];
  const sectorSize = (Math.PI * 2) / directions.length;
  const deadZone = 70;
  const hysteresis = .12;
  let activeSector = -1;
  let pointer = null;
  let boopCount = 0;
  let lastBoop = 0;
  let timers = [];

  const setCell = (layer, index) => {
    layer.style.backgroundPosition = `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`;
  };

  const wrapAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

  const aimMascot = () => {
    if (!pointer) return;
    const box = contactMascot.getBoundingClientRect();
    const dx = pointer.x - (box.left + box.width / 2);
    const dy = pointer.y - (box.top + box.height / 2);

    if (Math.hypot(dx, dy) < deadZone) {
      activeSector = -1;
      setCell(mascotDirections, directionCells.center);
      return;
    }

    const angle = Math.atan2(dy, dx);
    if (activeSector !== -1 && Math.abs(wrapAngle(angle - activeSector * sectorSize)) < sectorSize / 2 + hysteresis) return;

    activeSector = (Math.round(angle / sectorSize) + directions.length) % directions.length;
    setCell(mascotDirections, directionCells[directions[activeSector]]);
  };

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      aimMascot();
    }, { passive: true });
    window.addEventListener("scroll", aimMascot, { passive: true });
  }

  const showReaction = (name) => {
    setCell(mascotReactions, reactionCells[name]);
    contactMascot.classList.add("is-reacting");
  };

  contactMascot.addEventListener("click", () => {
    timers.forEach(window.clearTimeout);
    timers = [];

    const now = Date.now();
    boopCount = now - lastBoop < 1600 ? boopCount + 1 : 1;
    lastBoop = now;

    if (boopCount >= 4) {
      boopCount = 0;
      showReaction("dizzy");
      timers.push(window.setTimeout(() => contactMascot.classList.remove("is-reacting"), 1100));
    } else {
      showReaction("blink");
      timers.push(window.setTimeout(() => showReaction(payoffs[(boopCount - 1) % payoffs.length]), 120));
      timers.push(window.setTimeout(() => contactMascot.classList.remove("is-reacting"), 560));
    }

    if (!prefersReducedMotion) {
      mascotSquash?.animate([
        { transform: "scale(1, 1)", easing: "ease-in" },
        { transform: "scale(1.10, .86)", offset: .18, easing: "ease-out" },
        { transform: "scale(.95, 1.08)", offset: .45, easing: "ease-in-out" },
        { transform: "scale(1.03, .97)", offset: .72, easing: "ease-in-out" },
        { transform: "scale(1, 1)" }
      ], { duration: 420, easing: "linear" });
    }
  });
}
