/* ============================================================
   VANTA — Data Module
   Business catalogue: gallery, menu, services, bookings
   ============================================================ */

window.VANTA = window.VANTA || {};

/* ── Gallery Items ─────────────────────────────────────────── */
VANTA.galleryItems = [
  {
    id: 'g1',
    title: 'Studio Portrait — Elise',
    category: 'portraits',
    src: 'assets/img/gallery-portrait-1.jpg',
    aspect: 'tall',  // 3:4
    alt: 'Black and white fine art portrait of a woman in a studio',
  },
  {
    id: 'g2',
    title: 'The Whitmore Wedding',
    category: 'weddings',
    src: 'assets/img/gallery-wedding-1.jpg',
    aspect: 'wide',  // 16:9
    alt: 'Couple silhouetted in golden cathedral light on their wedding day',
  },
  {
    id: 'g3',
    title: 'Amber No. 5 — Campaign',
    category: 'commercial',
    src: 'assets/img/gallery-commercial-1.jpg',
    aspect: 'wide',
    alt: 'Luxury perfume bottle on dark marble — commercial campaign photography',
  },
  // External high-quality images (Unsplash)
  {
    id: 'g4',
    title: 'Autumn Light — Portrait',
    category: 'portraits',
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop',
    aspect: 'tall',
    alt: 'Close-up portrait in warm autumn light',
  },
  {
    id: 'g5',
    title: 'Coast & Ceremony',
    category: 'weddings',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop',
    aspect: 'wide',
    alt: 'Wedding couple on a coastal cliff at sunset',
  },
  {
    id: 'g6',
    title: 'Dialogue — Editorial Series',
    category: 'editorial',
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&auto=format&fit=crop',
    aspect: 'tall',
    alt: 'Editorial fashion photography — two models in minimalist setting',
  },
  {
    id: 'g7',
    title: 'Interior Spaces — Mayfair',
    category: 'commercial',
    src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80&auto=format&fit=crop',
    aspect: 'wide',
    alt: 'Architectural interior photography of a luxury living room',
  },
  {
    id: 'g8',
    title: 'Form & Shadow',
    category: 'editorial',
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&auto=format&fit=crop',
    aspect: 'tall',
    alt: 'High-contrast studio silhouette with architectural light and shadow',
  },
  {
    id: 'g9',
    title: 'The Lennox Reception',
    category: 'weddings',
    src: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&q=80&auto=format&fit=crop',
    aspect: 'wide',
    alt: 'Wedding reception — beautifully lit long table setting',
  },
];

/* ── Menu Items ─────────────────────────────────────────────── */
VANTA.menuItems = [
  // Starters
  {
    id: 'm1',
    name: 'Smoked Trout Rillettes',
    desc: 'Cold-smoked river trout, crème fraîche, cucumber, dill oil, sourdough crispbread.',
    price: 14,
    category: 'starters',
    tags: ['gf'],
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=75&auto=format&fit=crop',
  },
  {
    id: 'm2',
    name: 'Burrata & Heritage Tomato',
    desc: 'Pugliese burrata, roasted heritage tomatoes, aged balsamic, basil oil, toasted pine nuts.',
    price: 13,
    category: 'starters',
    tags: ['vg', 'gf'],
    img: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=600&q=75&auto=format&fit=crop',
  },
  {
    id: 'm3',
    name: 'Celeriac Velouté',
    desc: 'Silky celeriac soup, truffle oil, crispy capers, chive cream, walnut gremolata.',
    price: 11,
    category: 'starters',
    tags: ['vg', 've'],
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=75&auto=format&fit=crop',
  },
  // Mains
  {
    id: 'm4',
    name: 'Dry-Aged Côte de Boeuf',
    desc: '450g 35-day dry-aged rib on the bone, bone marrow butter, watercress, chips. For two.',
    price: 68,
    category: 'mains',
    tags: ['gf'],
    img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=75&auto=format&fit=crop',
  },
  {
    id: 'm6',
    name: 'Wild Mushroom Risotto',
    desc: 'Arborio, forest mushroom duxelles, aged Parmigiano-Reggiano, black truffle shaving.',
    price: 24,
    category: 'mains',
    tags: ['vg'],
    img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=75&auto=format&fit=crop',
  },
  // Desserts
  {
    id: 'm7',
    name: 'Valrhona Chocolate Fondant',
    desc: '72% dark chocolate, molten centre, Tahitian vanilla ice cream, cocoa tuile.',
    price: 10,
    category: 'desserts',
    tags: ['vg'],
    img: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&q=75&auto=format&fit=crop',
  },
  {
    id: 'm8',
    name: 'Île Flottante',
    desc: 'Soft meringue islands, crème anglaise, toasted almonds, passion fruit coulis.',
    price: 9,
    category: 'desserts',
    tags: ['vg', 'gf'],
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=75&auto=format&fit=crop',
  },
  // Drinks
  {
    id: 'm10',
    name: 'House Negroni',
    desc: 'Tanqueray, Campari, Martini Rosso, orange twist. Stirred.',
    price: 13,
    category: 'drinks',
    tags: ['vg', 've', 'gf'],
    img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=75&auto=format&fit=crop',
  },
  {
    id: 'm11',
    name: 'Natural Wine — Glass',
    desc: 'Ask your server for today\'s selection. Natural and low-intervention producers.',
    price: 12,
    category: 'drinks',
    tags: ['vg', 've', 'gf'],
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=75&auto=format&fit=crop',
  },
];

/* ── Services ──────────────────────────────────────────────── */
VANTA.services = [
  {
    id: 's1',
    name: 'Classic Cut',
    desc: 'A precision haircut tailored to your face shape, hair type, and personal style. Includes consultation, wash, cut, and finish.',
    duration: '45 min',
    price: '£38',
  },
  {
    id: 's2',
    name: 'Hot Towel Shave',
    desc: 'Traditional straight-razor shave with pre-shave oil, hot towel, premium cream, and aftershave balm. A ritual in itself.',
    duration: '40 min',
    price: '£45',
  },
  {
    id: 's3',
    name: 'Cut & Shave',
    desc: 'The full service. Classic cut followed immediately by a hot towel shave. The complete grooming experience.',
    duration: '80 min',
    price: '£75',
  },
  {
    id: 's4',
    name: 'Beard Sculpture',
    desc: 'Expert beard shaping, sculpting, and conditioning. Includes hot towel, line detailing, and beard oil treatment.',
    duration: '30 min',
    price: '£30',
  },
  {
    id: 's5',
    name: 'Head Shave',
    desc: 'Wet head shave with straight razor, hot towels, and scalp massage. Includes scalp conditioning treatment.',
    duration: '50 min',
    price: '£42',
  },
  {
    id: 's6',
    name: 'Junior Cut',
    desc: 'Precision cut for clients under 16. Patient, attentive service in a calm environment.',
    duration: '30 min',
    price: '£22',
  },
];

/* ── Booking services catalogue ───────────────────────────── */
VANTA.bookingServices = [
  { id: 'bs1', name: 'Classic Cut', duration: '45 min', price: '£38' },
  { id: 'bs2', name: 'Hot Towel Shave', duration: '40 min', price: '£45' },
  { id: 'bs3', name: 'Cut & Shave', duration: '80 min', price: '£75' },
  { id: 'bs4', name: 'Beard Sculpture', duration: '30 min', price: '£30' },
];

/* Time slots: available or not */
VANTA.getTimeSlots = function(dateStr) {
  // Deterministic mock based on date
  const d = new Date(dateStr);
  const seed = d.getDate() + d.getMonth();
  const allSlots = ['09:00','09:30','10:00','10:30','11:00','11:30',
                    '12:00','14:00','14:30','15:00','15:30','16:00',
                    '16:30','17:00','17:30','18:00'];
  return allSlots.map((t, i) => ({
    time: t,
    available: (i + seed) % 3 !== 0,
  }));
};

/* ── Active Bookings (account area) ────────────────────────── */
VANTA.bookings = [
  {
    ref: 'ACRE-0481',
    service: 'Cut & Shave',
    date: '2026-11-08',
    time: '10:00',
    business: 'Acre Barbershop',
    status: 'confirmed',
    price: '£75',
  },
  {
    ref: 'MAREN-0219',
    service: 'Portrait Session',
    date: '2026-11-22',
    time: '14:30',
    business: 'Maren Voigt Photography',
    status: 'pending',
    price: '£350',
  },
  {
    ref: 'CARTA-0077',
    service: 'Table for 2 — Dinner',
    date: '2026-10-20',
    time: '19:30',
    business: 'Carta Restaurant',
    status: 'confirmed',
    price: '—',
  },
  {
    ref: 'ACRE-0390',
    service: 'Hot Towel Shave',
    date: '2026-09-14',
    time: '11:30',
    business: 'Acre Barbershop',
    status: 'cancelled',
    price: '£45',
  },
];
VANTA.demoBookings = VANTA.bookings;

