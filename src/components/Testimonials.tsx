import { motion } from 'framer-motion';
import { testimonials } from '../data/pricing';
import { SectionHeading } from './SectionHeading';

export function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <SectionHeading
          eyebrow="KATA MEREKA"
          title="Customer Experience"
          description="Contoh testimonial — ganti dengan testimonial customer asli."
        />

        <div className="testimonial-grid">
          {testimonials.map(({ quote, name, badge }, index) => (
            <motion.article
              key={name}
              className="testimonial"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="quote-mark">“</div>
              <p>{quote}</p>

              <div className="testimonial-author">
                <div className="avatar">{name.charAt(name.length - 2).toUpperCase()}</div>
                <span>
                  {name}
                  <small>{badge}</small>
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
