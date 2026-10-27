import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, Shield, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createWhatsAppLink, siteConfig } from '../config/site';
import { navigationLinks } from '../data/pricing';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <a className="brand" href="#home" aria-label="Halaman utama RANKUP ML">
        <span className="brand-mark">
          <Shield size={16} />
        </span>
        <span>
          RANKUP <b>ML</b>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Navigasi utama">
        {navigationLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <a
        className="button button-small nav-cta"
        href={createWhatsAppLink('Pilihan saya', 'hubungi admin')}
        target="_blank"
        rel="noreferrer"
      >
        Order Sekarang
        <ArrowRight size={15} />
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            aria-label="Menu mobile"
          >
            {navigationLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <a
              className="button"
              href={createWhatsAppLink('Pilihan saya', 'hubungi admin')}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Order Sekarang
              <ArrowRight size={15} />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
