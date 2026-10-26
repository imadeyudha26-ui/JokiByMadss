import { motion } from 'framer-motion';
import { ArrowRight, Check, Rocket, ShieldCheck, Star, Trophy, Zap } from 'lucide-react';
import { createWhatsAppLink } from '../config/site';
import { heroHighlights } from '../data/pricing';

export function Hero() {
  return (
    <section className="hero container" id="home">
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="pill">
          <span className="status-dot" />
          JOKI MLBB PREMIUM
        </div>

        <h1>
          Push Rank MLBB
          <br />
          <span>Tanpa Harus Begadang.</span>
        </h1>

        <p className="hero-lede">
          Jasa joki Mobile Legends dengan pilihan paket fleksibel, harga transparan, dan
          proses yang mudah. Pilih target rank kamu dan langsung order melalui WhatsApp.
        </p>

        <div className="hero-actions">
          <a className="button" href={createWhatsAppLink('Pilihan saya', 'hubungi admin')} target="_blank" rel="noreferrer">
            <Rocket size={17} />
            Mulai Joki
          </a>
          <a className="button button-ghost" href="#pricing">
            Lihat Harga
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="hero-subtext">Mulai dari Rp5.000 / Star</div>

        <div className="trust-points">
          {heroHighlights.map((label) => (
            <span key={label}>
              <Check size={13} />
              {label}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="hero-visual" aria-label="Visual rank up preview">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />

        <motion.div
          className="rank-card rank-card-main"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="card-top">
            <span className="mini-label accent-label">MOST POPULAR</span>
            <Trophy size={19} />
          </div>
          <p className="rank-name">MYTHIC HONOR</p>
          <div className="stars">
            <Star fill="currentColor" size={18} />
            <strong>+10</strong>
            <span>Star</span>
          </div>
          <div className="price-row">
            <span>Mulai dari</span>
            <b>Rp150.000</b>
          </div>
          <div className="progress">
            <i />
          </div>
          <small>Slot terbatas · minggu ini</small>
        </motion.div>

        <motion.div
          className="rank-card rank-card-left"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="mini-label">CURRENT RANK</span>
          <div className="stars">
            <Star fill="currentColor" size={14} />
            <strong>+5</strong>
            <span>Star</span>
          </div>
          <p className="rank-pill">MYTHIC</p>
          <b>Rp60.000</b>
        </motion.div>

        <motion.div
          className="rank-card rank-card-right"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="mini-label cyan-label">RANK UP</span>
          <p>
            EPIC <ArrowRight size={13} /> MYTHIC
          </p>
          <b>Rp250.000</b>
        </motion.div>

        <div className="visual-badge">
          <ShieldCheck size={15} />
          100% privasi
        </div>
      </div>
    </section>
  );
}
