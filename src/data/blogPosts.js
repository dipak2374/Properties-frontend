export const blogPosts = [
  {
    slug: 'how-to-buy-your-first-home',
    title: 'How to buy your first home with confidence',
    excerpt: 'A practical guide to preparing your budget, documents, and shortlist before you make an offer.',
    category: 'Buying Tips',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80',
    author: 'Mina Chen',
    body: [
      'Buying your first home can feel overwhelming, but a calm plan makes the process easier.',
      'Start by defining your budget, reviewing your credit profile, and getting pre-approved before you begin touring homes.',
      'Then narrow your shortlist around schools, commute time, amenities, and long-term value.',
    ],
  },
  {
    slug: 'why-investors-love-premium-offices',
    title: 'Why investors are choosing premium office spaces again',
    excerpt: 'Downtown assets are returning to demand, boosted by flexible layouts and location-based value.',
    category: 'Investment',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80',
    author: 'Daniel Reyes',
    body: [
      'Flexible layouts, high-speed connectivity, and mixed-use neighborhoods continue to raise the bar for commercial assets.',
      'Today’s investors are prioritizing properties with strong tenant retention and digital-ready infrastructure.',
      'Premium office listings are attractive when they blend convenience, design, and community access.',
    ],
  },
  {
    slug: 'smart-renovation-tips-for-owners',
    title: 'Smart renovation tips that add value fast',
    excerpt: 'Small upgrades can lift perceived value without requiring a full remodel.',
    category: 'Home Advice',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=80',
    author: 'Ella Brooks',
    body: [
      'Fresh paint, upgraded lighting, and modern hardware can transform a property quickly.',
      'Focus on the spaces that buyers notice first: kitchen, bathrooms, entryway, and curb appeal.',
      'A well-planned update can improve both comfort and resale value.',
    ],
  },
];

export const getBlogPostBySlug = (slug) => blogPosts.find((post) => post.slug === slug);
