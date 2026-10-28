(function () {
  function rp(amount) {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function renderError(error) {
    const result = document.getElementById("calcResult");
    const cta = document.getElementById("calcCta");
    if (result) {
      result.textContent = `Kalkulator harga belum tersedia: ${error.message}`;
      result.classList.add("calc-result--error");
    }
    if (cta) cta.style.display = "none";
  }

  function init(config) {
    const oldFrom = document.getElementById("rankFrom");
    const oldTo = document.getElementById("rankTo");
    const oldBtn = document.getElementById("calcOrderBtn");
    const result = document.getElementById("calcResult");
    const cta = document.getElementById("calcCta");
    const fromBadge = document.getElementById("rankFromBadge");
    const toBadge = document.getElementById("rankToBadge");
    if (!oldFrom || !oldTo || !oldBtn || !result) return;

    const ranks = window.JBMRankPricing.normalize(config);
    const from = oldFrom.cloneNode(false);
    const to = oldTo.cloneNode(false);
    const btn = oldBtn.cloneNode(true);
    oldFrom.parentNode.replaceChild(from, oldFrom);
    oldTo.parentNode.replaceChild(to, oldTo);
    oldBtn.parentNode.replaceChild(btn, oldBtn);
    btn.removeAttribute("onclick");

    from.innerHTML = '<option value="">-- Pilih Rank --</option>' +
      ranks.slice(0, -1).map(rank =>
        `<option value="${escapeHtml(rank.label)}">${escapeHtml(rank.label)}</option>`).join("");
    to.innerHTML = '<option value="">-- Pilih Target --</option>' +
      ranks.map(rank =>
        `<option value="${escapeHtml(rank.label)}">${escapeHtml(rank.label)}</option>`).join("");

    function calculate() {
      fromBadge.textContent = from.value;
      toBadge.textContent = to.value;
      if (!from.value || !to.value) {
        result.innerHTML = '<div class="calc-result__placeholder"><i class="fas fa-calculator" aria-hidden="true"></i><p>Pilih rank asal &amp; target untuk melihat estimasi harga</p></div>';
        cta.style.display = "none";
        return;
      }

      try {
        const estimate = window.JBMRankPricing.calculate(ranks, from.value, to.value);
        result.innerHTML =
          '<div class="calc-final">' +
            `<div class="calc-final__route">${escapeHtml(from.value)} <i class="fas fa-arrow-right"></i> ${escapeHtml(to.value)}</div>` +
            `<div class="calc-final__row"><span>Total bintang</span><strong>${estimate.rankStars} star</strong></div>` +
            `<div class="calc-final__row calc-final__row--total"><span>Estimasi harga</span><strong>${rp(estimate.amount)}</strong></div>` +
          "</div>";
        cta.style.display = "";
        const message = `Joki Rank ${from.value} ke ${to.value} (${estimate.rankStars} star), estimasi ${rp(estimate.amount)}`;
        btn.onclick = () => {
          if (typeof window.orderViaWhatsApp === "function") window.orderViaWhatsApp(message);
        };
      } catch (error) {
        result.textContent = error.message;
        cta.style.display = "none";
      }
    }

    from.addEventListener("change", calculate);
    to.addEventListener("change", calculate);
    calculate();
  }

  window.addEventListener("load", async function () {
    try {
      const config = await window.JBMRankPricing.load();
      init(config);
    } catch (error) {
      console.error("Kalkulator harga rank gagal dimuat:", error);
      renderError(error);
    }
  });
})();
