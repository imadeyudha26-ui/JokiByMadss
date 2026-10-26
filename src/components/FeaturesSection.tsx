import { motion } from 'framer-motion';
import { SectionHeading } from './SectionHeading';
import { features } from '../data/pricing';

export function FeaturesSection() {
  return (
    <section className="section section-muted">
      <div className="container">
        <SectionHeading
          eyebrow="WHY RANKUP"
          title="Kenapa Pilih RANKUP ML?"
          description="Semua yang kamu butuhkan untuk push rank dengan tenang."
        />

        <div className="benefit-grid">
          {features.map(({ icon: Icon, title, description }) => (
            <motion.article
              key={title}
              className="benefit-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35 }}
              whileHover={{ y: -4 }}
            >
              <div className="icon-box">
                <Icon size={19} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
