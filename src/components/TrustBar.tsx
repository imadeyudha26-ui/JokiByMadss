import { Gem, LockKeyhole, MessageCircle, Trophy, Zap } from 'lucide-react';

const trustItems = [
  { icon: Zap, label: 'Proses Cepat' },
  { icon: LockKeyhole, label: 'Privasi Dijaga' },
  { icon: MessageCircle, label: 'Support WhatsApp' },
  { icon: Gem, label: 'Harga Transparan' },
  { icon: Trophy, label: 'Joki Berpengalaman' },
];

export function TrustBar() {
  return (
    <section className="trust-bar">
      <div className="container trust-grid">
        {trustItems.map(({ icon: Icon, label }) => (
          <span key={label}>
            <Icon size={16} />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
