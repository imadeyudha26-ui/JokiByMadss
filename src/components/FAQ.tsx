import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { faqItems } from '../data/pricing';
import { SectionHeading } from './SectionHeading';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section container faq-section" id="faq">
      <SectionHeading
        eyebrow="NEED TO KNOW"
        title="Pertanyaan yang Sering Ditanyakan"
        description="Jawaban cepat sebelum kamu mulai order."
      />

      <div className="faq-list">
        {faqItems.map((item, index) => {
          const expanded = openIndex === index;
          return (
            <div className={`faq-item ${expanded ? 'open' : ''}`} key={item.question}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpenIndex(expanded ? null : index)}
              >
                <span>{item.question}</span>
                <ChevronDown size={19} />
              </button>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
