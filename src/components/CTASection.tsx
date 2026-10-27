import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Sparkles } from 'lucide-react';
import { createWhatsAppLink } from '../config/site';

export function CTASection() {
  return (
    <motion.section
      className="final-cta container"
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="cta-glow" />
      <div className="cta-content">
        <div className="pill">
          <Sparkles size={14} />
          Rank kamu, next level
        </div>
        <h2>Siap Naik Rank?</h2>
        <p>Sudah menentukan target? Pilih paket dan mulai order sekarang.</p>
        <a className="button button-light" href={createWhatsAppLink('Pilihan saya', 'hubungi admin')} target="_blank" rel="noreferrer">
          <Rocket size={17} />
          Order Sekarang
          <ArrowRight size={17} />
        </a>
      </div>
    </motion.section>
  );
}
