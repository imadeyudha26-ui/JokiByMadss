(function () {
  // ===== UBAH DI SINI =====
  var WA_NUMBER = '6287828344076'; // nomor WA kamu, format 62 tanpa + dan tanpa 0 di depan
  var BRAND = 'JokiByMadss';

  // Ambil harga dari kartu yang diklik, jadi otomatis ikut kalau harga di HTML diubah
  function getPrice() {
    try {
      var el = window.event && window.event.currentTarget;
      var card = el && el.closest ? el.closest('.pkg-card, .service-card') : null;
      if (!card) return '';
      var p = card.querySelector('.pkg-card__price, .service-card__price-value');
      var unit = card.querySelector('.service-card__price-unit');
      if (!p) return '';
      return p.textContent.trim() + (unit ? ' ' + unit.textContent.trim() : '');
    } catch (e) { return ''; }
  }

  function buildMessage(item) {
    var hi = 'Halo admin ' + BRAND + ', ';
    var price = getPrice();
    var akun = [
      '',
      'Data akun:',
      '- Nickname: ',
      '- ID / Server: ',
      '- Login via: (Moonton / Facebook / Google / VK)',
      '- Rank saat ini: ',
      '- Target rank: ',
      '- Hero yang sering dipakai: '
    ].join('\n');

    if (!item) {
      return hi + 'saya mau tanya soal layanan joki Mobile Legends.\n\nBisa dibantu?';
    }

    // Dari kalkulator harga
    if (item.indexOf('estimasi') > -1) {
      return hi + 'saya mau order ' + item + '.\n' +
        '\nData akun:\n- Nickname: \n- ID / Server: \n- Login via: (Moonton / Facebook / Google / VK)\n' +
        '\nMohon konfirmasi harga final dan jadwal pengerjaannya ya.';
    }

    // Paket harga
    if (item.indexOf('Paket') === 0) {
      return hi + 'saya mau order *' + item + '*' + (price ? ' (' + price + ')' : '') + '.\n' + akun +
        '\n\nMohon info estimasi waktu dan metode pembayarannya ya.';
    }

    // Promo
    if (item === 'Promo Order Pertama') {
      return hi + 'saya mau klaim promo order pertama.\n' + akun +
        '\n- Layanan yang diinginkan: \n\nMohon info detail promonya ya.';
    }

    // Layanan
    if (item === 'Joki Rank') {
      return hi + 'saya mau order *Joki Rank*' + (price ? ' (mulai ' + price + ')' : '') + '.\n' + akun +
        '\n\nMohon info estimasi harga dan waktunya ya.';
    }
    if (item === 'Joki Star') {
      return hi + 'saya mau order *Joki Star*' + (price ? ' (mulai ' + price + ')' : '') + '.\n' + akun +
        '\n- Jumlah star yang diinginkan: \n\nMohon info total harganya ya.';
    }
    if (item === 'Joki Winrate') {
      return hi + 'saya mau order *Joki Winrate*' + (price ? ' (mulai ' + price + ')' : '') + '.\n' + akun +
        '\n- Winrate saat ini: \n- Target winrate: \n- Total match saat ini: \n\nMohon info total harganya ya.';
    }
    if (item === 'Joki Event') {
      return hi + 'saya mau order *Joki Event*' + (price ? ' (mulai ' + price + ')' : '') + '.\n' +
        '\nData akun:\n- Nickname: \n- ID / Server: \n- Login via: (Moonton / Facebook / Google / VK)\n- Nama event: \n- Reward yang dituju: \n\nMohon info harga dan waktunya ya.';
    }

    // Layanan lain yang belum punya template
    return hi + 'saya mau order *' + item + '*.\n' + akun + '\n\nMohon info harga dan waktunya ya.';
  }

  window.orderViaWhatsApp = function (item) {
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildMessage(item));
    window.open(url, '_blank', 'noopener');
  };
})();