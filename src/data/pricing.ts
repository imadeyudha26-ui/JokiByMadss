import type { LucideIcon } from 'lucide-react';
import {
  Headphones,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  Zap,
  MessageCircle,
} from 'lucide-react';

export type StarPricing = {
  id: string;
  name: string;
  price: string;
  note: string;
  description: string;
  highlight?: boolean;
  accent?: 'purple' | 'cyan';
};

export type PopularPackage = {
  id: string;
  label: string;
  rank: string;
  bonus: string;
  price: string;
  badge?: string;
  featured?: boolean;
  description: string;
  features: string[];
};

export type PushRankPackage = {
  id: string;
  from: string;
  to: string;
  price: string;
  eta: string;
  features: string[];
};

export type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export const starPricing: StarPricing[] = [
  { id: 'master', name: 'MASTER', price: 'Rp5.000', note: '/ Star', description: 'Untuk kamu yang ingin mulai push rank dari Master.', accent: 'purple' },
  { id: 'grandmaster', name: 'GRANDMASTER', price: 'Rp6.000', note: '/ Star', description: 'Cocok untuk mendorong rank dari Grandmaster.', accent: 'purple' },
  { id: 'epic', name: 'EPIC', price: 'Rp7.000', note: '/ Star', description: 'Pilihan siap untuk push rank Epic ke level berikutnya.', accent: 'purple' },
  { id: 'legend', name: 'LEGEND', price: 'Rp8.000', note: '/ Star', description: 'Mendukung progress Legend dengan sistem yang rapi.', accent: 'cyan' },
  { id: 'mythic', name: 'MYTHIC', price: 'Rp12.000', note: '/ Star', description: 'Push Mythic dengan timeline dan progress update.', highlight: true },
  { id: 'mythic-honor', name: 'MYTHIC HONOR', price: 'Rp15.000', note: '/ Star', description: 'Didesain untuk pemain yang ingin naik ke Honor.', accent: 'purple' },
  { id: 'mythic-glory', name: 'MYTHIC GLORY', price: 'Rp20.000', note: '/ Star', description: 'Tingkatkan progres untuk Glory dengan lebih cepat.', accent: 'purple' },
  { id: 'mythic-immortal', name: 'MYTHIC IMMORTAL', price: 'Rp25.000', note: '/ Star', description: 'Paket premium untuk target yang lebih ambisius.', highlight: true },
];

export const popularPackages: PopularPackage[] = [
  {
    id: 'starter',
    label: 'STARTER',
    rank: '5 Star Epic',
    bonus: 'Bonus +1 Star',
    price: 'Rp35.000',
    description: 'Paket paling ringan untuk kamu yang ingin mulai dari Epic.',
    features: ['5 Star', 'Bonus 1 Star', 'Progress Update'],
  },
  {
    id: 'boost',
    label: 'BOOST',
    rank: '10 Star Epic',
    bonus: 'Bonus +2 Star',
    price: 'Rp70.000',
    badge: 'HEMAT',
    description: 'Paket ekonomis untuk push rank tanpa ribet.',
    features: ['10 Star', 'Bonus 2 Star', 'Progress Update'],
  },
  {
    id: 'mythic-boost',
    label: 'MYTHIC BOOST',
    rank: '10 Star Mythic',
    bonus: 'Bonus +2 Star',
    price: 'Rp140.000',
    badge: 'TERLARIS',
    featured: true,
    description: 'Pilihan paling laris untuk kebutuhan push Mythic.',
    features: ['10 Star', 'Bonus 2 Star', 'Progress Update', 'Request Hero'],
  },
  {
    id: 'honor-boost',
    label: 'HONOR BOOST',
    rank: '10 Star Mythic Honor',
    bonus: 'Bonus +2 Star',
    price: 'Rp170.000',
    description: 'Membantu kamu menembus Mythic Honor dengan lebih aman.',
    features: ['10 Star', 'Bonus 2 Star', 'Progress Update'],
  },
  {
    id: 'glory-boost',
    label: 'GLORY BOOST',
    rank: '10 Star Mythic Glory',
    bonus: 'Bonus +2 Star',
    price: 'Rp220.000',
    description: 'Kombinasi boost dan progres yang stabil untuk target tinggi.',
    features: ['10 Star', 'Bonus 2 Star', 'Progress Update'],
  },
];

export const pushRankPackages: PushRankPackage[] = [
  {
    id: 'epic-to-mythic',
    from: 'EPIC',
    to: 'MYTHIC',
    price: 'Rp250.000',
    eta: '1–3 Hari',
    features: ['Progress update', 'Request hero', 'Support admin'],
  },
  {
    id: 'legend-to-mythic',
    from: 'LEGEND',
    to: 'MYTHIC',
    price: 'Rp150.000',
    eta: '1–2 Hari',
    features: ['Target jelas', 'Antrian rapi', 'WhatsApp update'],
  },
  {
    id: 'mythic-to-honor',
    from: 'MYTHIC',
    to: 'HONOR',
    price: 'Rp300.000',
    eta: '1–3 Hari',
    features: ['Tim support', 'Estimasi real-time', 'Request hero'],
  },
  {
    id: 'mythic-to-glory',
    from: 'MYTHIC',
    to: 'GLORY',
    price: 'Rp650.000',
    eta: '2–4 Hari',
    features: ['Push stabil', 'Proses terjadwal', 'Update berkala'],
  },
  {
    id: 'mythic-to-immortal',
    from: 'MYTHIC',
    to: 'IMMORTAL',
    price: 'Rp1.500.000',
    eta: '3–7 Hari',
    features: ['Sesuai target', 'Admin terpercaya', 'Custom request'],
  },
];

export const features: FeatureItem[] = [
  { title: 'Proses Terjadwal', description: 'Order diproses berdasarkan antrean dan estimasi yang diberikan.', icon: Zap },
  { title: 'Privasi Dijaga', description: 'Informasi customer diperlakukan secara rahasia dan aman.', icon: ShieldCheck },
  { title: 'Progress Update', description: 'Customer dapat memperoleh informasi perkembangan order.', icon: MessageCircle },
  { title: 'Harga Transparan', description: 'Harga ditampilkan sebelum order dan mudah dipahami.', icon: Wallet },
  { title: 'Custom Request', description: 'Diskusikan target atau kebutuhan khusus dengan admin.', icon: Target },
  { title: 'Support Admin', description: 'Hubungi admin melalui WhatsApp untuk bantuan kapan saja.', icon: Headphones },
];

export const faqItems: FAQItem[] = [
  {
    question: 'Berapa lama proses joki?',
    answer: 'Estimasi bergantung pada paket, rank awal, target, dan kondisi pertandingan.',
  },
  {
    question: 'Apakah bisa request hero?',
    answer: 'Request dapat disampaikan saat order, tetapi tidak selalu dapat dijamin.',
  },
  {
    question: 'Apakah harga bisa berubah?',
    answer: 'Harga dapat berubah berdasarkan paket dan kondisi layanan.',
  },
  {
    question: 'Bagaimana cara order?',
    answer: 'Pilih paket dan tekan tombol Order Sekarang untuk melanjutkan melalui WhatsApp.',
  },
  {
    question: 'Apakah bisa custom paket?',
    answer: 'Silakan hubungi admin melalui WhatsApp.',
  },
  {
    question: 'Bagaimana keamanan akun?',
    answer: 'Ikuti prosedur login yang diberikan dan jangan pernah memberikan kode OTP kepada pihak lain.',
  },
];

export const steps = [
  { index: '01', title: 'Pilih Paket', description: 'Pilih paket sesuai rank dan target.' },
  { index: '02', title: 'Klik Order', description: 'Tekan tombol Order Sekarang.' },
  { index: '03', title: 'Kirim Detail', description: 'Lengkapi detail order melalui WhatsApp.' },
  { index: '04', title: 'Proses Dimulai', description: 'Admin mengkonfirmasi dan proses dimulai.' },
];

export const testimonials = [
  {
    quote: 'Proses ordernya simpel dan admin responsif.',
    name: 'Customer 01',
    badge: 'CUSTOMER',
  },
  {
    quote: 'Pilihan paketnya jelas dan support cepat membantu.',
    name: 'Customer 02',
    badge: 'CUSTOMER',
  },
  {
    quote: 'Saya dapat update progress dengan jelas dan masuk akal.',
    name: 'Customer 03',
    badge: 'CUSTOMER',
  },
];

export const navigationLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Harga', href: '#pricing' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Cara Order', href: '#cara-order' },
  { label: 'FAQ', href: '#faq' },
];

export const footerColumns = {
  help: ['WhatsApp', 'Instagram', 'TikTok'],
};

export const heroHighlights = ['Harga transparan', 'Support WhatsApp', 'Progress update'];

export const brandBadges = [
  { icon: Sparkles, label: 'Joki premium' },
  { icon: Zap, label: 'Order cepat' },
  { icon: ShieldCheck, label: 'Privasi aman' },
];
