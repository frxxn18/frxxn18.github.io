// ==========================================================
// Portfolio de Fran (frxxn18)
// Efecto de escritura, animaciones de aparición,
// barras de nivel y contadores de estadísticas
// ==========================================================

// ---------- efecto de escritura en el hero ----------
const ROLES = [
  "desarrollador web",
  "estudiante de DAW",
  "creador de apps multiplataforma",
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

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

// ---------- aparición al hacer scroll ----------
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
