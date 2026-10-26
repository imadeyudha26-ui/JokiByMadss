import { motion } from 'framer-motion';
import { steps } from '../data/pricing';
import { SectionHeading } from './SectionHeading';

export function HowItWorks() {
  return (
    <section className="section container" id="cara-order">
      <SectionHeading
        eyebrow="SIMPLE PROCESS"
        title="Cara Order"
        description="Empat langkah singkat, lalu rank kamu kami bantu dorong."
      />

      <div className="timeline">
        {steps.map(({ index, title, description }, itemIndex) => (
          <motion.div
            key={index}
            className="timeline-item"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: itemIndex * 0.08 }}
          >
            <div className="timeline-number">{index}</div>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            {itemIndex < steps.length - 1 && <div className="timeline-line" />}
          </motion.div>
        ))}
      </div>

      <div className="security-note">
        <span className="shield-mini">✓</span>
        Jangan pernah memberikan kode OTP kepada pihak lain.
      </div>
    </section>
  );
}
