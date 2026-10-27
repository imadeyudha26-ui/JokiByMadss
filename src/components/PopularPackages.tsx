import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { createWhatsAppLink } from '../config/site';
import { popularPackages } from '../data/pricing';
import { SectionHeading } from './SectionHeading';

export function PopularPackages() {
  return (
    <section className="section section-muted" id="layanan">
      <div className="container">
        <SectionHeading
          eyebrow="BEST SELLERS"
          title="Paket Joki Terlaris"
          description="Lebih praktis dengan paket star dan bonus yang jelas."
        />

        <div className="package-grid">
          {popularPackages.map((item) => (
            <motion.article
              key={item.id}
              className={`package-card ${item.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              whileHover={{ y: -4 }}
            >
              <div className="package-head">
                <span>{item.label}</span>
                {item.badge && <b>{item.badge}</b>}
              </div>

              <div className="package-icon">
                <Star size={22} />
              </div>

              <h3>{item.rank}</h3>
              <p className="bonus">{item.bonus}</p>
              <div className="package-price">{item.price}</div>
              <p className="package-desc">{item.description}</p>

              <div className="feature-list">
                {item.features.map((feature) => (
                  <span key={feature}>
                    <Check size={14} />
                    {feature}
                  </span>
                ))}
              </div>

              <a
                className={`button ${item.featured ? '' : 'button-ghost'}`}
                href={createWhatsAppLink(item.rank, item.price)}
                target="_blank"
                rel="noreferrer"
              >
                Order Sekarang
                <ArrowRight size={15} />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
