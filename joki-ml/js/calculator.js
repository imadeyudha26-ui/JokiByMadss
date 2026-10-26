(function () {
  // ===== HARGA PER STAR (ubah sesuai harga kamu) =====
  // divisi = jumlah divisi, stars = star per divisi, price = harga per star (Rp)
  var TIERS = [
    { name: 'Warrior',        divisi: 3, stars: 3,  price: 1500 },
    { name: 'Elite',          divisi: 3, stars: 3,  price: 2000 },
    { name: 'Master',         divisi: 4, stars: 4,  price: 2500 },
    { name: 'Grandmaster',    divisi: 5, stars: 5,  price: 3000 },
    { name: 'Epic',           divisi: 5, stars: 5,  price: 4000 },
    { name: 'Legend',         divisi: 5, stars: 5,  price: 6000 },
    { name: 'Mythic',         divisi: 1, stars: 25, price: 8000 },
    { name: 'Mythical Honor', divisi: 1, stars: 25, price: 14000 },
    { name: 'Mythical Glory', divisi: 1, stars: 50, price: 14000 },
    { name: 'Mythical Immortal', divisi: 1, stars: 0, price: 0 }
  ];
  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];

  // Bangun daftar rank satu per satu
  var RANKS = [];
  TIERS.forEach(function (t) {
    for (var d = t.divisi; d >= 1; d--) {
      RANKS.push({
        label: t.divisi > 1 ? t.name + ' ' + ROMAN[d] : t.name,
        stars: t.stars,
        price: t.price
      });
    }
  });

  function rp(n) {
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
  }

  function init() {
    var oldFrom = document.getElementById('rankFrom');
    var oldTo = document.getElementById('rankTo');
    var oldBtn = document.getElementById('calcOrderBtn');
    var result = document.getElementById('calcResult');
    var cta = document.getElementById('calcCta');
    var fromBadge = document.getElementById('rankFromBadge');
    var toBadge = document.getElementById('rankToBadge');
    if (!oldFrom || !oldTo || !result) return;

    // Ganti elemen dengan salinan bersih supaya listener lama tidak bentrok
    var from = oldFrom.cloneNode(false);
    var to = oldTo.cloneNode(false);
    var btn = oldBtn.cloneNode(true);
    oldFrom.parentNode.replaceChild(from, oldFrom);
    oldTo.parentNode.replaceChild(to, oldTo);
    oldBtn.parentNode.replaceChild(btn, oldBtn);
    btn.removeAttribute('onclick');

    from.innerHTML = '<option value="">-- Pilih Rank --</option>';
    to.innerHTML = '<option value="">-- Pilih Target --</option>';
    RANKS.forEach(function (r, i) {
      from.insertAdjacentHTML('beforeend', '<option value="' + i + '">' + r.label + '</option>');
      to.insertAdjacentHTML('beforeend', '<option value="' + i + '">' + r.label + '</option>');
    });
    // Tambah Immortal sebagai target terakhir
    var last = RANKS.length;
    to.insertAdjacentHTML('beforeend', '<option value="' + last + '">Mythical Immortal</option>');

    var message = '';

    function labelOf(i) {
      return i === RANKS.length ? 'Mythical Immortal' : RANKS[i].label;
    }

    function hitung() {
      var a = from.value, b = to.value;
      fromBadge.textContent = a !== '' ? labelOf(+a) : '';
      toBadge.textContent = b !== '' ? labelOf(+b) : '';

      if (a === '' || b === '') {
        result.innerHTML = '<div class="calc-result__placeholder"><i class="fas fa-calculator" aria-hidden="true"></i><p>Pilih rank asal &amp; target untuk melihat estimasi harga</p></div>';
        cta.style.display = 'none';
        return;
      }
      a = +a; b = +b;
      if (b <= a) {
        result.innerHTML = '<div class="calc-result__placeholder"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i><p>Rank target harus lebih tinggi dari rank saat ini</p></div>';
        cta.style.display = 'none';
        return;
      }

      var totalStars = 0, total = 0;
      for (var i = a; i < b; i++) {
        totalStars += RANKS[i].stars;
        total += RANKS[i].stars * RANKS[i].price;
      }

      result.innerHTML =
        '<div class="calc-final">' +
          '<div class="calc-final__route">' + labelOf(a) + ' <i class="fas fa-arrow-right"></i> ' + labelOf(b) + '</div>' +
          '<div class="calc-final__row"><span>Total bintang</span><strong>' + totalStars + ' star</strong></div>' +
          '<div class="calc-final__row calc-final__row--total"><span>Estimasi harga</span><strong>' + rp(total) + '</strong></div>' +
        '</div>';
      cta.style.display = '';
      message = 'Joki Rank ' + labelOf(a) + ' ke ' + labelOf(b) + ' (' + totalStars + ' star), estimasi ' + rp(total);
    }

    from.addEventListener('change', hitung);
    to.addEventListener('change', hitung);
    btn.addEventListener('click', function () {
      if (typeof orderViaWhatsApp === 'function') orderViaWhatsApp(message);
    });
  }

  window.addEventListener('load', function () { setTimeout(init, 0); });
})();