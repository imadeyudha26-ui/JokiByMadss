import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createWhatsAppLink } from '../config/site';

export function WhatsAppButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 180);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.a
      href={createWhatsAppLink('Order sekarang', 'hubungi admin')}
      target="_blank"
      rel="noreferrer"
      className={`floating-whatsapp ${show ? 'visible' : ''}`}
      aria-label="Chat Admin via WhatsApp"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20 }}
      transition={{ duration: 0.2 }}
      title="Chat Admin"
    >
      <MessageCircle size={24} />
    </motion.a>
  );
}
