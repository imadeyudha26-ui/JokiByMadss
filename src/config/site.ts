export const siteConfig = {
  brandName: 'RANKUP ML',
  whatsappNumber: '628XXXXXXXXXX',
  instagram: '#',
  tiktok: '#',
};

export const createWhatsAppLink = (packageName: string, price: string) => {
  const message = `Halo ${siteConfig.brandName},\n\nSaya ingin order:\nPaket: ${packageName}\nHarga: ${price}\n\nMohon informasi proses selanjutnya.\n\nTerima kasih.`;

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
};
