// ==========================================================
// Portfolio de Fran (frxxn18)
// Carrusel de tecnologías, efecto de escritura, animaciones
// de aparición, barras de nivel, contadores, barra de
// progreso, enlace activo en la nav y botón de volver arriba
// ==========================================================

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- carrusel de tecnologías ----------
// [nombre visible, slug en cdn.simpleicons.org]
const TECHS = [
  ["JavaScript", "javascript"],
  ["TypeScript", "typescript"],
  ["React", "react"],
  ["React Native", "react"],
  ["Tauri", "tauri"],
  ["Electron", "electron"],
  ["Laravel", "laravel"],
  ["PHP", "php"],
  ["Python", "python"],
  ["Sass", "sass"],
  ["Bootstrap", "bootstrap"],
  ["Tailwind CSS", "tailwindcss"],
  ["MySQL", "mysql"],
  ["MariaDB", "mariadb"],
  ["MongoDB", "mongodb"],
  ["SQLite", "sqlite"],
  ["HTML5", "html5"],
  ["CSS", "css"],
  ["Git", "git"],
];

const track = document.getElementById("mq-track");
if (track) {
  // dos copias de la lista para que el bucle sea continuo
  const items = TECHS.concat(TECHS)
    .map(
      ([name, slug]) =>
        `<span class="mq-item"><img class="mq-logo" src="https://cdn.simpleicons.org/${slug}" alt="" width="17" height="17" loading="lazy">${name}</span>`
    )
    .join("");
  track.innerHTML = items;
}

// ---------- efecto de escritura en el hero ----------
const ROLES = [
  "desarrollador web",
  "desarrollador multiplataforma",
  "estudiante de DAW",
  "autodidacta por naturaleza",
];

const typedEl = document.getElementById("typed");

function typeLoop(roleIndex = 0) {
  const word = ROLES[roleIndex % ROLES.length];
  let i = 0;
  let deleting = false;

  const tick = () => {
    typedEl.textContent = word.slice(0, i);
    if (!deleting) {
      i++;
      if (i > word.length) {
        deleting = true;
        setTimeout(tick, 1800); // pausa con la palabra completa
        return;
      }
      setTimeout(tick, 55 + Math.random() * 45);
    } else {
      i--;
      if (i < 0) {
        typeLoop(roleIndex + 1);
        return;
      }
      setTimeout(tick, 28);
    }
  };
  tick();
}

if (typedEl) {
  if (reduceMotion) {
    typedEl.textContent = ROLES[0];
  } else {
    typeLoop();
  }
}

// ---------- contador animado de estadísticas ----------
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---------- aparición al hacer scroll (escalonada) ----------
// los .reveal hermanos dentro del mismo contenedor aparecen en cascada
document.querySelectorAll("section, .hero-grid, .grid, .contact-grid").forEach((parent) => {
  parent.querySelectorAll(":scope > .reveal, :scope > * > .reveal").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 90, 450)}ms`;
  });
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");

      // barras de nivel dentro del bloque visible
      entry.target.querySelectorAll(".fill").forEach((fill) => {
        fill.style.width = fill.dataset.w;
      });

      // contadores dentro del bloque visible
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);

      io.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---------- barra de progreso de scroll ----------
const progress = document.getElementById("progress");

// ---------- botón de volver arriba ----------
const toTop = document.getElementById("toTop");
if (toTop) {
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) {
    progress.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";
  }
  if (toTop) {
    toTop.classList.toggle("show", window.scrollY > 600);
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- enlace activo en la nav ----------
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const navIo = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => navIo.observe(s));
