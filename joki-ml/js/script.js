/**
 * ============================================================
 *  JOKI ML — Main JavaScript  |  js/script.js
 * ============================================================
 */

/* ============================================================
   ⚙️  KONFIGURASI — EDIT BAGIAN INI SESUAI KEBUTUHAN
   ============================================================ */

/** Nomor WhatsApp (format: 628xxxxxxxxxx, tanpa + ) */
const WHATSAPP_NUMBER = "6287828344076";

/** Nama brand untuk pesan WhatsApp otomatis */
const BRAND_NAME = "[JokiByMadss]";

/**
 * Data harga per paket joki.
 *  - popular : true  → tampilkan badge "POPULAR"
 *  - icon    : emoji rank (bisa diganti teks/emoji lain)
 */
const PRICING_DATA = [
  { from: "Warrior",  to: "Elite",        price: 10000, popular: false, icon: "⚔️"  },
  { from: "Master",   to: "Grandmaster",  price: 15000, popular: false, icon: "🛡️"  },
  { from: "Epic",     to: "Legend",       price: 25000, popular: true,  icon: "⚡"  },
  { from: "Legend",   to: "Mythic",       price: 35000, popular: false, icon: "🏆"  },
  { from: "Mythic",   to: "Mythic Honor", price: 45000, popular: false, icon: "👑"  },
];

/**
 * Data semua rank untuk kalkulator harga.
 * Urutan = hierarki rank dari terendah ke tertinggi.
 */
const RANK_LIST = [
  { name: "Warrior I",      tier: "Warrior",      level: 1  },
  { name: "Warrior II",     tier: "Warrior",      level: 2  },
  { name: "Warrior III",    tier: "Warrior",      level: 3  },
  { name: "Elite I",        tier: "Elite",        level: 4  },
  { name: "Elite II",       tier: "Elite",        level: 5  },
  { name: "Elite III",      tier: "Elite",        level: 6  },
  { name: "Master I",       tier: "Master",       level: 7  },
  { name: "Master II",      tier: "Master",       level: 8  },
  { name: "Master III",     tier: "Master",       level: 9  },
  { name: "Grandmaster I",  tier: "Grandmaster",  level: 10 },
  { name: "Grandmaster II", tier: "Grandmaster",  level: 11 },
  { name: "Grandmaster III",tier: "Grandmaster",  level: 12 },
  { name: "Epic I",         tier: "Epic",         level: 13 },
  { name: "Epic II",        tier: "Epic",         level: 14 },
  { name: "Epic III",       tier: "Epic",         level: 15 },
  { name: "Legend I",       tier: "Legend",       level: 16 },
  { name: "Legend II",      tier: "Legend",       level: 17 },
  { name: "Legend III",     tier: "Legend",       level: 18 },
  { name: "Mythic",         tier: "Mythic",       level: 19 },
  { name: "Mythic Honor",   tier: "Mythic Honor", level: 20 },
  { name: "Mythic Glory",   tier: "Mythic Glory", level: 21 },
];

/**
 * Harga per-level (step) untuk kalkulator.
 * Digunakan untuk menghitung estimasi otomatis.
 */
const PRICE_PER_LEVEL = {
  "Warrior":      3500,
  "Elite":        4000,
  "Master":       5000,
  "Grandmaster":  6000,
  "Epic":         8000,
  "Legend":       11000,
  "Mythic":       15000,
  "Mythic Honor": 20000,
  "Mythic Glory": 25000,
};

/**
 * Notifikasi live order — tampil sebagai toast.
 * Ganti/tambah sesuai selera.
 */
const LIVE_ORDERS = [
  { name: "Andi S.",   initial: "A", service: "Joki Rank",      rank: "Epic → Legend",       color: "cyan"   },
  { name: "Rizky M.",  initial: "R", service: "Joki Star",       rank: "5 Star Tambahan",     color: "gold"   },
  { name: "Fajar K.",  initial: "F", service: "Custom Request",  rank: "Mythic Honor",         color: "purple" },
  { name: "Sinta D.",  initial: "S", service: "Joki Winrate",    rank: "WR 60% → 70%",        color: "cyan"   },
  { name: "Dimas R.",  initial: "D", service: "Joki Placement",  rank: "Season Baru",          color: "gold"   },
  { name: "Bayu W.",   initial: "B", service: "Joki Rank",       rank: "Legend → Mythic",      color: "purple" },
  { name: "Citra N.",  initial: "C", service: "Joki Event",      rank: "Event Reward",         color: "cyan"   },
  { name: "Hendra T.", initial: "H", service: "Joki Rank",       rank: "Grandmaster → Epic",   color: "gold"   },
];

/* ============================================================
   1. WHATSAPP INTEGRATION
   ============================================================ */

/**
 * Buka WhatsApp dengan pesan otomatis.
 * @param {string} service - Nama layanan (opsional)
 */
function orderViaWhatsApp(service = "") {
  const serviceText = service
    ? `Layanan   : ${service}`
    : `Layanan   : (sebutkan layanan yang diinginkan)`;

  const message =
    `Halo ${BRAND_NAME}! 👋\n\n` +
    `Saya ingin melakukan order jasa joki Mobile Legends.\n\n` +
    `${serviceText}\n\n` +
    `Mohon informasi harga dan proses order. Terima kasih! 🙏`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ============================================================
   2. LOADING SCREEN
   ============================================================ */
function initLoadingScreen() {
  const screen    = document.getElementById("loadingScreen");
  const bar       = document.getElementById("loadingBar");
  const text      = document.getElementById("loadingText");
  if (!screen) return;

  const messages  = ["Memuat...", "Menyiapkan aset...", "Hampir selesai...", "Selamat datang!"];
  let progress    = 0;
  let msgIndex    = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 8;
    if (progress > 100) progress = 100;

    if (bar) bar.style.width = progress + "%";

    // Rotate loading text
    const newMsg = messages[Math.floor(progress / 30)];
    if (newMsg && text && text.textContent !== newMsg) {
      text.textContent = newMsg;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add("hidden");
      }, 400);
    }
  }, 80);
}

/* ============================================================
   3. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const doc  = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct  = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + "%";
  }, { passive: true });
}

/* ============================================================
   4. PROMO BANNER
   ============================================================ */
function initPromoBanner() {
  const banner = document.getElementById("promoBanner");
  const close  = document.getElementById("promoBannerClose");
  if (!banner || !close) return;

  // Don't show if dismissed in this session
  if (sessionStorage.getItem("promoDismissed")) {
    banner.classList.add("hidden");
    return;
  }

  close.addEventListener("click", () => {
    banner.classList.add("hidden");
    sessionStorage.setItem("promoDismissed", "1");
    // Adjust navbar top offset
    document.documentElement.style.setProperty("--navbar-h", "72px");
  });
}

/* ============================================================
   5. CANVAS PARTICLE BACKGROUND (HERO)
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.6 + 0.1,
      dx:    (Math.random() - 0.5) * 0.4,
      dy:    (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.5 ? "0, 217, 255" : "255, 200, 87",
    };
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 9000), 80);
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();

      // Move
      p.x += p.dx; p.y += p.dy;

      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 217, 255, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  draw();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initParticles();
    }, 250);
  });
}

/* ============================================================
   6. TYPEWRITER EFFECT (HERO)
   ============================================================ */
function initTypewriter() {
  const el     = document.getElementById("heroTypewriter");
  if (!el) return;

  const words  = ["Cepat.", "Aman.", "Terjamin.", "Profesional."];
  let wIdx     = 0;
  let cIdx     = 0;
  let deleting = false;
  let timer;

  function type() {
    const word = words[wIdx];

    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) {
        deleting = true;
        timer = setTimeout(type, 2000); // Pause before deleting
        return;
      }
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
      }
    }
    timer = setTimeout(type, deleting ? 60 : 100);
  }

  type();
}

/* ============================================================
   7. NAVBAR — scroll effect, hamburger, active state
   ============================================================ */
function initNavbar() {
  const navbar     = document.getElementById("navbar");
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".navbar__mobile-link");
  if (!navbar) return;

  // Scroll effect
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
    updateActiveNav();
    toggleBackToTop();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Hamburger
  function closeMenu() {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Buka menu navigasi");
    document.body.style.overflow = "";
  }
  function openMenu() {
    hamburger.classList.add("open");
    mobileMenu.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Tutup menu navigasi");
    document.body.style.overflow = "hidden";
  }
  hamburger.addEventListener("click", () => {
    hamburger.classList.contains("open") ? closeMenu() : openMenu();
  });
  mobileLinks.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && hamburger.classList.contains("open")) closeMenu();
  });

  // Active nav on scroll
  const sections  = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".navbar__link");
  function updateActiveNav() {
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("data-nav") === current);
    });
  }
  onScroll();
}

/* ============================================================
   8. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
    });
  });
}

/* ============================================================
   9. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  elements.forEach((el) => observer.observe(el));
}

/* ============================================================
   10. COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || "";
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target).toLocaleString("id-ID") + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString("id-ID") + suffix;
    }
    requestAnimationFrame(update);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

/* ============================================================
   11. PRICING CARDS RENDER
   ============================================================ */
function renderPricingCards() {
  const grid = document.getElementById("pricingGrid");
  if (!grid) return;

  PRICING_DATA.forEach((item, i) => {
    const card = document.createElement("article");
    card.className = `pricing-card${item.popular ? " pricing-card--popular" : ""}`;
    card.setAttribute("data-reveal", "");
    card.setAttribute("data-delay", String(i * 100));
    card.setAttribute("aria-label", `Paket ${item.from} ke ${item.to}`);

    const priceFormatted = "Rp" + item.price.toLocaleString("id-ID");
    const orderLabel = `Joki Rank ${item.from} ke ${item.to}`;

    card.innerHTML = `
      ${item.popular ? '<span class="pricing-card__badge">POPULAR</span>' : ""}
      <div class="pricing-card__rank-icon">${item.icon}</div>
      <p class="pricing-card__tier">
        <span class="pricing-card__tier-from">${item.from}</span>
        <i class="fas fa-long-arrow-alt-right" style="color:var(--clr-text-3);font-size:.7rem;margin-inline:.3rem;"></i>
        <span class="pricing-card__tier-to">${item.to}</span>
      </p>
      <p class="pricing-card__price">${priceFormatted}</p>
      <p class="pricing-card__sub">per tier / star</p>
      <a href="#" class="btn ${item.popular ? "btn--gold" : "btn--outline"} btn--sm"
         onclick="orderViaWhatsApp('${orderLabel}'); return false;"
         aria-label="Pesan paket ${item.from} ke ${item.to} via WhatsApp">
        <i class="fab fa-whatsapp"></i> Pesan
      </a>
    `;
    grid.appendChild(card);
  });
}

/* ============================================================
   12. RANK CALCULATOR
   ============================================================ */
function initCalculator() {
  const fromSel      = document.getElementById("rankFrom");
  const toSel        = document.getElementById("rankTo");
  const resultEl     = document.getElementById("calcResult");
  const ctaEl        = document.getElementById("calcCta");
  const orderBtn     = document.getElementById("calcOrderBtn");
  const fromBadge    = document.getElementById("rankFromBadge");
  const toBadge      = document.getElementById("rankToBadge");
  if (!fromSel || !toSel) return;

  // Populate dropdowns
  RANK_LIST.forEach(rank => {
    fromSel.add(new Option(rank.name, rank.name));
    toSel.add(new Option(rank.name, rank.name));
  });

  function getRankObj(name) {
    return RANK_LIST.find(r => r.name === name);
  }

  function formatPrice(num) {
    return "Rp " + num.toLocaleString("id-ID");
  }

  function getTierEmoji(tier) {
    const map = {
      "Warrior": "⚔️", "Elite": "🛡️", "Master": "🎯",
      "Grandmaster": "💎", "Epic": "⚡", "Legend": "🏆",
      "Mythic": "👑", "Mythic Honor": "🌟", "Mythic Glory": "🔥",
    };
    return map[tier] || "🎮";
  }

  function calculate() {
    const fromName = fromSel.value;
    const toName   = toSel.value;
    const fromRank = getRankObj(fromName);
    const toRank   = getRankObj(toName);

    // Update badges
    if (fromRank && fromBadge) {
      fromBadge.textContent = getTierEmoji(fromRank.tier) + " " + fromRank.tier;
    } else if (fromBadge) {
      fromBadge.textContent = "";
    }
    if (toRank && toBadge) {
      toBadge.textContent = getTierEmoji(toRank.tier) + " " + toRank.tier;
    } else if (toBadge) {
      toBadge.textContent = "";
    }

    if (!fromRank || !toRank) {
      showPlaceholder();
      return;
    }
    if (fromRank.level >= toRank.level) {
      showError("❌ Rank target harus lebih tinggi dari rank saat ini.");
      return;
    }

    // Calculate price: sum price per level for each step
    let totalPrice = 0;
    const steps    = toRank.level - fromRank.level;

    for (let lvl = fromRank.level; lvl < toRank.level; lvl++) {
      const rankAtLevel = RANK_LIST.find(r => r.level === lvl);
      const price       = rankAtLevel ? (PRICE_PER_LEVEL[rankAtLevel.tier] || 5000) : 5000;
      totalPrice += price;
    }

    // Estimate days (rough: 2-3 levels per day)
    const minDays = Math.max(1, Math.floor(steps / 3));
    const maxDays = Math.max(1, Math.ceil(steps / 2));
    const estTime = minDays === maxDays ? `${minDays} Hari` : `${minDays}–${maxDays} Hari`;

    resultEl.innerHTML = `
      <div class="calc-result__content">
        <div class="calc-result__item">
          <span class="calc-result__label">TOTAL TIER</span>
          <span class="calc-result__value">${steps}</span>
        </div>
        <div class="calc-result__divider"></div>
        <div class="calc-result__item">
          <span class="calc-result__label">ESTIMASI HARGA</span>
          <span class="calc-result__value price-big text-gradient-gold">${formatPrice(totalPrice)}</span>
        </div>
        <div class="calc-result__divider"></div>
        <div class="calc-result__item">
          <span class="calc-result__label">ESTIMASI WAKTU</span>
          <span class="calc-result__value" style="font-size:1.3rem;">${estTime}</span>
        </div>
      </div>
    `;

    ctaEl.style.display = "flex";

    // Update order button context
    const orderLabel = `Joki Rank ${fromName} ke ${toName} (Estimasi: ${formatPrice(totalPrice)})`;
    if (orderBtn) {
      orderBtn.onclick = () => {
        orderViaWhatsApp(orderLabel);
        return false;
      };
    }
  }

  function showPlaceholder() {
    resultEl.innerHTML = `
      <div class="calc-result__placeholder">
        <i class="fas fa-calculator"></i>
        <p>Pilih rank asal &amp; target untuk melihat estimasi harga</p>
      </div>
    `;
    ctaEl.style.display = "none";
  }

  function showError(msg) {
    resultEl.innerHTML = `
      <div class="calc-result__placeholder">
        <i class="fas fa-exclamation-triangle" style="color:var(--clr-gold)"></i>
        <p>${msg}</p>
      </div>
    `;
    ctaEl.style.display = "none";
  }

  fromSel.addEventListener("change", calculate);
  toSel.addEventListener("change", calculate);
}

/* ============================================================
   13. FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  document.querySelectorAll(".faq__item").forEach(item => {
    const btn    = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");
    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close all
      document.querySelectorAll(".faq__item.open").forEach(other => {
        other.classList.remove("open");
        other.querySelector(".faq__question")?.setAttribute("aria-expanded", "false");
      });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ============================================================
   14. TESTIMONIAL SLIDER with autoplay progress bar
   ============================================================ */
function initTestimonialSlider() {
  const track     = document.getElementById("testimonialSlider");
  const prevBtn   = document.getElementById("testiPrev");
  const nextBtn   = document.getElementById("testiNext");
  const dotsWrap  = document.getElementById("testiDots");
  const progBar   = document.getElementById("testiProgressBar");
  if (!track) return;

  const cards         = Array.from(track.querySelectorAll(".testi-card"));
  if (!cards.length) return;

  let current         = 0;
  let autoplayTimer   = null;
  let progressTimer   = null;
  let progressVal     = 0;
  const AUTOPLAY_MS   = 5000;

  function getVisible() {
    if (window.innerWidth <= 768)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMax() { return Math.max(0, cards.length - getVisible()); }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= getMax(); i++) {
      const dot = document.createElement("button");
      dot.className   = "testi-dot" + (i === current ? " active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.setAttribute("aria-selected", String(i === current));
      dot.addEventListener("click", () => { goTo(i); restartAutoplay(); });
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, getMax()));
    const cardW  = cards[0].offsetWidth;
    const gap    = 24;
    track.style.transform  = `translateX(-${current * (cardW + gap)}px)`;
    track.style.transition = "transform 0.45s cubic-bezier(0.4,0,0.2,1)";
    dotsWrap?.querySelectorAll(".testi-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
      d.setAttribute("aria-selected", String(i === current));
    });
  }

  function next() { goTo(current + 1 > getMax() ? 0 : current + 1); }
  function prev() { goTo(current - 1 < 0 ? getMax() : current - 1); }

  // Autoplay with progress bar
  function startProgress() {
    stopProgress();
    progressVal = 0;
    if (progBar) progBar.style.width = "0%";
    const step = 50; // ms per tick
    progressTimer = setInterval(() => {
      progressVal += (step / AUTOPLAY_MS) * 100;
      if (progBar) progBar.style.width = Math.min(progressVal, 100) + "%";
    }, step);
  }

  function stopProgress() {
    clearInterval(progressTimer);
    progressVal = 0;
    if (progBar) progBar.style.width = "0%";
  }

  function startAutoplay() {
    stopAutoplay();
    startProgress();
    autoplayTimer = setInterval(() => { next(); startProgress(); }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    stopProgress();
  }

  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  prevBtn?.addEventListener("click", () => { prev(); restartAutoplay(); });
  nextBtn?.addEventListener("click", () => { next(); restartAutoplay(); });

  // Pause on hover
  track.addEventListener("mouseenter", stopAutoplay);
  track.addEventListener("mouseleave", startAutoplay);

  // Touch/swipe
  let touchX = 0;
  track.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
  track.addEventListener("touchend",   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    startAutoplay();
  }, { passive: true });

  // Keyboard support
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")  { prev(); restartAutoplay(); }
    if (e.key === "ArrowRight") { next(); restartAutoplay(); }
  });

  // Resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { goTo(0); buildDots(); }, 200);
  });

  buildDots();
  goTo(0);
  startAutoplay();
}

/* ============================================================
   15. LIVE ORDER TOAST NOTIFICATIONS
   ============================================================ */
function initLiveToasts() {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  let idx = 0;

  function showToast() {
    const order = LIVE_ORDERS[idx % LIVE_ORDERS.length];
    idx++;

    const toast = document.createElement("div");
    toast.className  = "toast";
    toast.setAttribute("role", "alert");

    const minutes = Math.floor(Math.random() * 8) + 1;

    toast.innerHTML = `
      <div class="toast__avatar" style="background:linear-gradient(135deg,${
        order.color === "gold"   ? "var(--clr-gold-dark),var(--clr-gold)" :
        order.color === "purple" ? "#7E22CE,var(--clr-purple)" :
                                   "var(--clr-cyan-dark),var(--clr-cyan)"
      })">${order.initial}</div>
      <div class="toast__body">
        <span class="toast__name">${order.name} baru saja order!</span>
        <span class="toast__msg">${order.service} · ${order.rank}</span>
      </div>
      <span class="toast__time">${minutes}m lalu</span>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.classList.add("toast--out");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }, 4000);
  }

  // Show first toast after 4 seconds, then every 8-12 seconds
  setTimeout(() => {
    showToast();
    setInterval(showToast, Math.random() * 4000 + 8000);
  }, 4000);
}

/* ============================================================
   16. BACK TO TOP BUTTON
   ============================================================ */
function toggleBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  btn.classList.toggle("visible", window.scrollY > 400);
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ============================================================
   17. FLOATING WA BUTTON — hide when footer visible
   ============================================================ */
function initFloatingWA() {
  const btn    = document.getElementById("floatingWA");
  const footer = document.querySelector(".footer");
  if (!btn || !footer) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      btn.style.opacity = entry.isIntersecting ? "0" : "1";
      btn.style.pointerEvents = entry.isIntersecting ? "none" : "all";
    });
  }, { threshold: 0.3 });

  obs.observe(footer);
}

/* ============================================================
   18. LAZY LOADING IMAGES
   ============================================================ */
function initLazyImages() {
  document.querySelectorAll("img:not(.hero__img)").forEach(img => {
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
  });
}

/* ============================================================
   19. MAIN INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();       // ① Splash/loading screen
  initScrollProgress();      // ② Top scroll progress bar
  initPromoBanner();         // ③ Promo banner close
  initHeroCanvas();          // ④ Canvas particle background
  initTypewriter();          // ⑤ Typewriter effect hero
  initNavbar();              // ⑥ Navbar & hamburger
  initSmoothScroll();        // ⑦ Smooth scroll
  initScrollReveal();        // ⑧ Scroll reveal animation
  initCounters();            // ⑨ Counter animation
  renderPricingCards();      // ⑩ Render pricing from data
  initCalculator();          // ⑪ Rank price calculator
  initFAQ();                 // ⑫ Accordion FAQ
  initTestimonialSlider();   // ⑬ Testimonial slider + autoplay
  initLiveToasts();          // ⑭ Live order notifications
  initBackToTop();           // ⑮ Back to top button
  initFloatingWA();          // ⑯ Floating WA button behavior
  initLazyImages();          // ⑰ Lazy load images
});
