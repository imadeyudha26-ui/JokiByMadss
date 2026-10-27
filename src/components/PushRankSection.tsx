import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock3 } from 'lucide-react';
import { createWhatsAppLink } from '../config/site';
import { pushRankPackages } from '../data/pricing';
import { SectionHeading } from './SectionHeading';

export function PushRankSection() {
  return (
    <section className="section container">
      <SectionHeading
        eyebrow="TARGET LOCKED"
        title="Push Rank Sampai Target"
        description="Mulai dari rank kamu sekarang dan tentukan target yang ingin dicapai."
      />

      <div className="push-grid">
        {pushRankPackages.map((item) => (
          <motion.article
            key={item.id}
            className="push-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
          >
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
              Order Sekarang
              <ArrowRight size={15} />
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
