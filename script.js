/* =========================================================
   AKHIL JOJO — PORTFOLIO SCRIPT
   Loader · Cursor · Themes · Reveal · Nav · Canvas
   ========================================================= */
(function () {
  "use strict";
  const html = document.documentElement;
  html.classList.add("js");

  const isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- LOADER ---------- */
  const loader = document.getElementById("loader");
  function hideLoader() {
    loader.classList.add("done");
    setTimeout(() => loader.remove(), 900);
  }
  window.addEventListener("load", () => setTimeout(hideLoader, 2400));
  // safety fallback
  setTimeout(hideLoader, 4000);

  /* ---------- CUSTOM CURSOR ---------- */
  if (!isTouch) {
    document.body.classList.add("cursor-on");
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    const label = document.getElementById("cursorLabel");
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    const hoverEls = document.querySelectorAll("[data-cursor]");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const txt = el.getAttribute("data-cursor");
        ring.classList.add("show");
        if (txt) { label.textContent = txt; }
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("show");
        label.textContent = "";
      });
    });
  }

  /* ---------- THEME SYSTEM ---------- */
  const THEMES = {
    ivory: "IVORY", charcoal: "CHARCOAL", forest: "FOREST",
    burgundy: "BURGUNDY", sand: "SAND", black: "BLACK", sunset: "SUNSET"
  };
  const themeBtn = document.getElementById("themeBtn");
  const themePanel = document.getElementById("themePanel");
  const themeNameEl = themeBtn.querySelector(".theme-name");
  const themeDot = themeBtn.querySelector(".theme-dot");

  function applyTheme(name, animate) {
    if (!THEMES[name]) return;
    if (animate) {
      html.classList.add("theme-anim");
      setTimeout(() => html.classList.remove("theme-anim"), 750);
    }
    html.setAttribute("data-theme", name);
    themeNameEl.textContent = THEMES[name];
    try { localStorage.setItem("aj-theme", name); } catch (e) {}
  }

  // restore saved theme
  let saved = null;
  try { saved = localStorage.getItem("aj-theme"); } catch (e) {}
  if (saved) applyTheme(saved, false);
  themeNameEl.textContent = THEMES[html.getAttribute("data-theme")] || "IVORY";

  themeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    themePanel.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!themePanel.contains(e.target) && e.target !== themeBtn) {
      themePanel.classList.remove("open");
    }
  });
  document.querySelectorAll(".theme-swatch").forEach((sw) => {
    sw.addEventListener("click", () => {
      applyTheme(sw.getAttribute("data-set"), true);
      themePanel.classList.remove("open");
    });
  });

  /* ---------- NAV: scroll compact + active link ---------- */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-link")];

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 50);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // active link via IntersectionObserver
  const linkMap = {};
  navLinks.forEach((l) => { linkMap[l.getAttribute("href").slice(1)] = l; });
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const link = linkMap[en.target.id];
        if (link) link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => navObserver.observe(s));

  /* ---------- MOBILE MENU ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinksWrap = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => {
    navLinksWrap.classList.toggle("show");
    navToggle.classList.toggle("open");
  });
  navLinksWrap.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinksWrap.classList.remove("show");
      navToggle.classList.remove("open");
    })
  );

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in-view");
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (i % 3 === 1) el.classList.add("d1");
    if (i % 3 === 2) el.classList.add("d2");
    revealObserver.observe(el);
  });

  /* ---------- YEAR ---------- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- PHONE REVEAL ---------- */
  const phoneReveal = document.getElementById("phoneReveal");
  const phoneNumber = document.getElementById("phoneNumber");
  if (phoneReveal && phoneNumber) {
    phoneReveal.addEventListener("click", () => {
      const hidden = phoneNumber.hasAttribute("hidden");
      if (hidden) {
        phoneNumber.removeAttribute("hidden");
        phoneReveal.textContent = "Hide phone number";
        phoneReveal.setAttribute("aria-expanded", "true");
      } else {
        phoneNumber.setAttribute("hidden", "");
        phoneReveal.textContent = "Show phone number";
        phoneReveal.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- SHARE YOUR IDEA FORM ---------- */
  const ideaForm = document.getElementById("ideaForm");
  const ideaSuccess = document.getElementById("ideaSuccess");
  if (ideaForm && ideaSuccess) {
    const nextInput = ideaForm.querySelector('input[name="_next"]');
    if (nextInput) nextInput.value = location.href.split("?")[0] + "?sent=1";
    if (new URLSearchParams(location.search).get("sent") === "1") {
      ideaForm.hidden = true;
      ideaSuccess.hidden = false;
    }
    ideaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = ideaForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "SENDING…";
      fetch("https://formsubmit.co/ajax/akhiljojo00@gmail.com", {
        method: "POST",
        body: new FormData(ideaForm),
        headers: { "Accept": "application/json" }
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            ideaForm.hidden = true;
            ideaSuccess.hidden = false;
            history.replaceState(null, "", location.pathname);
          } else {
            throw new Error("submit-failed");
          }
        })
        .catch(() => {
          ideaForm.submit();
        });
    });
  }

  /* ---------- BACKGROUND CANVAS ---------- */
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let W, H, DPR, particles = [], shapes = [], accentRGB = [169, 121, 79];
  let mouseX = 0.5, mouseY = 0.5;

  function readAccent() {
    const v = getComputedStyle(html).getPropertyValue("--accent").trim();
    const m = v.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (m) { accentRGB = [+m[1], +m[2], +m[3]]; return; }
    // hex fallback
    if (v.startsWith("#") && v.length === 7) {
      accentRGB = [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16)];
    }
  }
  readAccent();
  // update accent when theme changes
  const accentWatch = new MutationObserver(readAccent);
  accentWatch.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildScene();
  }

  function buildScene() {
    const area = W * H;
    const pCount = isTouch ? Math.min(34, Math.round(area / 42000)) : Math.min(70, Math.round(area / 26000));
    particles = [];
    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.5
      });
    }
    const sCount = isTouch ? 5 : 11;
    shapes = [];
    for (let i = 0; i < sCount; i++) {
      shapes.push({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 120 + 60,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.0025,
        depth: Math.random() * 0.6 + 0.2,
        type: i % 3
      });
    }
  }

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX / W; mouseY = e.clientY / H;
  });
  window.addEventListener("resize", resize);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const [r, g, b] = accentRGB;

    // floating geometric forms
    shapes.forEach((s) => {
      s.rot += s.vr;
      const px = (mouseX - 0.5) * 40 * s.depth;
      const py = (mouseY - 0.5) * 40 * s.depth;
      const x = s.x + px, y = s.y + py;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(s.rot);
      ctx.globalAlpha = 0.05 + s.depth * 0.06;
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.lineWidth = 1;
      if (s.type === 0) {
        ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
      } else if (s.type === 1) {
        ctx.beginPath();
        ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -s.size / 2);
        ctx.lineTo(s.size / 2, s.size / 2);
        ctx.lineTo(-s.size / 2, s.size / 2);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    });

    // particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
      ctx.fill();
    }

    // faint connective lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], c = particles[j];
        const dx = a.x - c.x, dy = a.y - c.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 13000) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(c.x, c.y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${0.06 * (1 - d2 / 13000)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize();
  draw();
})();
