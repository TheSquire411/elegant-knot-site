// Wedding planning constants and data

export const WEDDING_STYLES = [
  'Classic & Elegant',
  'Modern & Minimalist', 
  'Rustic & Bohemian',
  'Vintage & Romantic',
  'Beach & Tropical',
  'Garden & Natural',
  'Industrial Chic',
  'Luxury & Glamorous'
];

export const LOCATION_MULTIPLIERS: { [key: string]: number } = {
  'NSW': 1.4, // New South Wales - Sydney premium
  'VIC': 1.3, // Victoria - Melbourne premium
  'QLD': 1.1, // Queensland - Brisbane/Gold Coast
  'WA': 1.2, // Western Australia - Perth
  'SA': 1.0, // South Australia - Adelaide
  'ACT': 1.3, // Australian Capital Territory - Canberra
  'NT': 0.9, // Northern Territory - Darwin
  'TAS': 0.8  // Tasmania - Hobart
};

export const LOCATION_OPTIONS = [
  { value: 'NSW', label: 'New South Wales (NSW)' },
  { value: 'VIC', label: 'Victoria (VIC)' },
  { value: 'QLD', label: 'Queensland (QLD)' },
  { value: 'SA', label: 'South Australia (SA)' },
  { value: 'WA', label: 'Western Australia (WA)' },
  { value: 'NT', label: 'Northern Territory (NT)' },
  { value: 'ACT', label: 'Australian Capital Territory (ACT)' },
  { value: 'TAS', label: 'Tasmania (TAS)' }
];

export const STYLE_MULTIPLIERS: { [key: string]: number } = {
  'Luxury & Glamorous': 1.5,
  'Classic & Elegant': 1.2,
  'Vintage & Romantic': 1.1,
  'Modern & Minimalist': 1.0,
  'Garden & Natural': 0.95,
  'Beach & Tropical': 0.9,
  'Industrial Chic': 0.9,
  'Rustic & Bohemian': 0.8
};

export const BUDGET_CATEGORIES = [
  {
    category: 'Venue & Catering',
    percentage: 45,
    description: 'Reception venue, ceremony site, food, beverages, service fees',
    costSavingTips: [
      'Consider off-peak seasons (winter, weekdays)',
      'Look into all-inclusive venues',
      'Opt for brunch or lunch instead of dinner',
      'Choose venues that include tables, chairs, and linens'
    ]
  },
  {
    category: 'Photography & Videography',
    percentage: 12,
    description: 'Wedding photographer, videographer, engagement photos, albums',
    costSavingTips: [
      'Book newer photographers building their portfolio',
      'Consider photography-only packages',
      'Ask about digital-only delivery',
      'Limit hours of coverage'
    ]
  },
  {
    category: 'Attire & Beauty',
    percentage: 8,
    description: 'Wedding dress, suit/tux, shoes, accessories, hair, makeup',
    costSavingTips: [
      'Shop sample sales and trunk shows',
      'Consider renting formal wear',
      'Do your own makeup trial',
      'Buy accessories online or secondhand'
    ]
  },
  {
    category: 'Flowers & Decor',
    percentage: 8,
    description: 'Bridal bouquet, centerpieces, ceremony decor, lighting',
    costSavingTips: [
      'Use seasonal and local flowers',
      'Repurpose ceremony flowers for reception',
      'DIY some centerpieces',
      'Rent decor items instead of buying'
    ]
  },
  {
    category: 'Music & Entertainment',
    percentage: 8,
    description: 'DJ or band, ceremony music, sound system, special lighting',
    costSavingTips: [
      'Book a DJ instead of a live band',
      'Create your own playlists for cocktail hour',
      'Skip special lighting effects',
      'Ask about package deals'
    ]
  },
  {
    category: 'Transportation',
    percentage: 3,
    description: 'Wedding party transportation, guest shuttles, getaway car',
    costSavingTips: [
      'Use personal vehicles',
      'Book transportation for shorter periods',
      'Consider ride-sharing for guests',
      'Skip the getaway car'
    ]
  },
  {
    category: 'Stationery & Invitations',
    percentage: 2,
    description: 'Save the dates, invitations, programs, menus, signage',
    costSavingTips: [
      'Use digital save the dates',
      'Print invitations yourself',
      'Skip formal programs',
      'Use online RSVP systems'
    ]
  },
  {
    category: 'Wedding Cake & Desserts',
    percentage: 3,
    description: 'Wedding cake, grooms cake, dessert bar, late night snacks',
    costSavingTips: [
      'Order a smaller display cake with sheet cakes',
      'Choose simple decorations',
      'Skip the grooms cake',
      'Serve cake as the only dessert'
    ]
  },
  {
    category: 'Miscellaneous & Gifts',
    percentage: 3,
    description: 'Wedding favors, welcome bags, tips, marriage license',
    costSavingTips: [
      'Skip wedding favors',
      'Give edible favors you make yourself',
      'Limit welcome bag contents',
      'Research tipping guidelines'
    ]
  },
  {
    category: 'Emergency Buffer',
    percentage: 8,
    description: 'Unexpected expenses, last-minute additions, price increases',
    costSavingTips: [
      'Set aside 5-10% of total budget',
      'Track expenses carefully',
      'Get contracts with fixed pricing',
      'Plan for potential guest count changes'
    ]
  }
];