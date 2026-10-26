import { AtSign, MessageCircle, Play } from 'lucide-react';
import { siteConfig } from '../config/site';
import { createWhatsAppLink } from '../config/site';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div>
          <a className="brand" href="#home" aria-label="RANKUP ML home">
            <span className="brand-mark">
              <span className="brand-mini">R</span>
            </span>
            <span>
              RANKUP <b>ML</b>
            </span>
          </a>
          <p className="footer-tagline">Push Rank Tanpa Drama.</p>
        </div>

        <div className="footer-links">
          <div>
            <b>NAVIGASI</b>
            <a href="#home">Home</a>
            <a href="#pricing">Harga</a>
            <a href="#layanan">Layanan</a>
          </div>

          <div>
            <b>BANTUAN</b>
            <a href="#cara-order">Cara Order</a>
            <a href="#faq">FAQ</a>
            <a href={createWhatsAppLink('bantuan', 'hubungi admin')} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>

          <div>
            <b>INFORMASI</b>
            <a href={siteConfig.instagram === '#' ? '#home' : siteConfig.instagram}><AtSign size={14} /> Instagram</a>
            <a href={siteConfig.tiktok === '#' ? '#home' : siteConfig.tiktok}><Play size={14} /> TikTok</a>
            <span>Harga dapat berubah.</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 {siteConfig.brandName}. All rights reserved.</span>
        <span>Harga dapat berubah. Estimasi dapat berbeda.</span>
      </div>

      <div className="container disclaimer">
        {siteConfig.brandName} adalah layanan independen dan tidak berafiliasi dengan Moonton atau Mobile Legends: Bang Bang.
      </div>
    </footer>
  );
}
