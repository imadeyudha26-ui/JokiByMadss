(function () {
  function normalize(rows) {
    if (!Array.isArray(rows) || rows.length < 2) {
      throw new Error("Konfigurasi tarif rank tidak tersedia.");
    }

    const config = rows
      .map(row => ({
        label: String(row.rank_label ?? row.label ?? "").trim(),
        sortOrder: Number(row.sort_order ?? row.sortOrder),
        starsToNext: Number(row.stars_to_next ?? row.starsToNext),
        pricePerStar: Number(row.price_per_star ?? row.pricePerStar)
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const labels = new Set();
    const orders = new Set();

    for (const rank of config) {
      if (!rank.label ||
          !Number.isInteger(rank.sortOrder) ||
          !Number.isInteger(rank.starsToNext) ||
          rank.starsToNext < 0 ||
          !Number.isSafeInteger(rank.pricePerStar) ||
          rank.pricePerStar < 0 ||
          labels.has(rank.label) ||
          orders.has(rank.sortOrder)) {
        throw new Error("Konfigurasi tarif rank memiliki data yang tidak valid.");
      }
      labels.add(rank.label);
      orders.add(rank.sortOrder);
    }

    if (config[config.length - 1].starsToNext !== 0 ||
        config.slice(0, -1).some(rank => rank.starsToNext === 0)) {
      throw new Error("Urutan rank dan tarif bintang belum lengkap.");
    }

    return config;
  }

  function calculate(config, fromLabel, toLabel) {
    const ranks = normalize(config);
    const start = ranks.findIndex(rank => rank.label === fromLabel);
    const target = ranks.findIndex(rank => rank.label === toLabel);
    if (start < 0 || target < 0 || target <= start) {
      throw new Error("Rank tujuan harus lebih tinggi dari rank awal.");
    }

    const steps = ranks.slice(start, target);
    const stars = steps.reduce((sum, rank) => sum + rank.starsToNext, 0);
    const amount = steps.reduce((sum, rank) =>
      sum + rank.starsToNext * rank.pricePerStar, 0);

    if (!Number.isSafeInteger(stars) || !Number.isSafeInteger(amount) || amount <= 0) {
      throw new Error("Estimasi harga tidak valid. Periksa konfigurasi tarif rank.");
    }

    return { rankStars: stars, amount };
  }

  async function load() {
    const baseUrl = window.JBM_SUPABASE_URL;
    const anonKey = window.JBM_SUPABASE_ANON_KEY;
    if (!baseUrl || !anonKey) throw new Error("Konfigurasi Supabase belum tersedia.");

    const url = new URL("/rest/v1/jbm_rank_price_steps", baseUrl);
    url.searchParams.set("select", "rank_label,sort_order,stars_to_next,price_per_star");
    url.searchParams.set("order", "sort_order.asc");
    const response = await fetch(url, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
    });
    if (!response.ok) {
      const reason = await response.text();
      throw new Error(`Tarif rank tidak dapat dimuat (${response.status}): ${reason}`);
    }
    return normalize(await response.json());
  }

  window.JBMRankPricing = Object.freeze({ normalize, calculate, load });
})();
