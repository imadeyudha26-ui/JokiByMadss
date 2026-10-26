import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock3, MoveUpRight, Star, Trophy } from 'lucide-react';
import { useState } from 'react';
import { createWhatsAppLink } from '../config/site';
import { popularPackages, pushRankPackages, starPricing } from '../data/pricing';
import { SectionHeading } from './SectionHeading';

const tabs = ['Per Star', 'Paket Star', 'Push Rank'] as const;

type PricingTab = (typeof tabs)[number];

function PricingCard({ name, price, note, description, highlight, accent }: (typeof starPricing)[number]) {
  return (
    <motion.article
      className={`price-card ${highlight ? 'featured' : ''} ${accent === 'cyan' ? 'cyan' : ''}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="price-card-top">
        <span className="rank-chip">
          {highlight ? <Trophy size={13} /> : <Star size={13} />}
          {name}
        </span>
        <MoveUpRight size={18} />
      </div>

      <div className="price-value">
        {price}
        <small>{note}</small>
      </div>

      <p className="card-description">{description}</p>

      <a href={createWhatsAppLink(name, price)} target="_blank" rel="noreferrer">
        Order Sekarang
        <ArrowRight size={14} />
      </a>
    </motion.article>
  );
}

export function PricingSection() {
  const [activeTab, setActiveTab] = useState<PricingTab>('Per Star');

  return (
    <motion.section
      className="section container"
      id="pricing"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      <SectionHeading
        eyebrow="PRICING"
        title="Harga Joki MLBB"
        description="Pilih paket sesuai rank dan target yang kamu inginkan."
      />

      <div className="tabs" aria-label="Tab pricing">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Paket Star' && <span>Populer</span>}
          </button>
        ))}
      </div>

      {activeTab === 'Per Star' && (
        <div className="price-grid">
          {starPricing.map((item) => (
            <PricingCard key={item.id} {...item} />
          ))}
        </div>
      )}

      {activeTab === 'Paket Star' && (
        <div className="package-grid">
          {popularPackages.map((item) => {
            const isFeatured = !!item.featured;
            return (
              <motion.article
                key={item.id}
                className={`package-card ${isFeatured ? 'featured' : ''}`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
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
                  className={`button ${isFeatured ? '' : 'button-ghost'}`}
                  href={createWhatsAppLink(item.rank, item.price)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Order Sekarang
                  <ArrowRight size={15} />
                </a>
              </motion.article>
            );
          })}
        </div>
      )}

      {activeTab === 'Push Rank' && (
        <div className="push-grid">
          {pushRankPackages.map((item) => (
            <motion.article key={item.id} className="push-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div className="route">
                <span>{item.from}</span>
                <ArrowRight size={16} />
                <strong>{item.to}</strong>
              </div>

              <div className="push-meta">
                <span>
                  <Clock3 size={14} />
                  {item.eta}
                </span>
                <b>{item.price}</b>
              </div>

              <ul className="push-features">
                {item.features.map((feature) => (
                  <li key={feature}>
                    <Check size={14} />
                    {feature}
                  </li>
                ))}
              </ul>

              <a href={createWhatsAppLink(`${item.from} ke ${item.to}`, item.price)} target="_blank" rel="noreferrer">
                Pilih paket
                <ArrowRight size={15} />
              </a>
            </motion.article>
          ))}
        </div>
      )}
    </motion.section>
  );
}
