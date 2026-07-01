// Cannabis Strain Types

export type StrainType = 'indica' | 'sativa' | 'hybrid';

export type EffectType = 
  | 'relaxed'
  | 'happy'
  | 'euphoric'
  | 'uplifted'
  | 'creative'
  | 'energetic'
  | 'focused'
  | 'sleepy'
  | 'hungry'
  | 'tingly'
  | 'giggly'
  | 'aroused'
  | 'talkative';

export type FlavorType = 
  | 'earthy'
  | 'sweet'
  | 'fruity'
  | 'citrus'
  | 'berry'
  | 'grape'
  | 'diesel'
  | 'pine'
  | 'woody'
  | 'spicy'
  | 'herbal'
  | 'cheese'
  | 'minty'
  | 'vanilla'
  | 'nutty'
  | 'sour'
  | 'tropical'
  | 'pineapple'
  | 'creamy';

export type MedicalUseType = 
  | 'stress'
  | 'anxiety'
  | 'depression'
  | 'insomnia'
  | 'pain'
  | 'inflammation'
  | 'appetite'
  | 'nausea'
  | 'seizures'
  | 'spasticity'
  | 'fatigue'
  | 'headaches'
  | 'migraines';

export interface Strain {
  id: string;
  name: string;
  slug: string;
  type: StrainType;
  description: string;
  thc: number | null;
  cbd: number | null;
  thca: number | null;
  cbn: number | null;
  cbg: number | null;
  terpenes: Terpene[];
  effects: EffectType[];
  flavors: FlavorType[];
  medical_uses: MedicalUseType[];
  growing_difficulty: 'easy' | 'moderate' | 'difficult';
  flowering_time_weeks: number | null;
  yield_indoor: string | null; // e.g., "1-2 oz/ft²"
  yield_outdoor: string | null; // e.g., "10-15 oz/plant"
  height_indoor: string | null; // e.g., "30-60 in"
  height_outdoor: string | null; // e.g., "60-80 in"
  climate: 'indoor' | 'outdoor' | 'greenhouse' | 'both';
  genetics: string | null; // e.g., "OG Kush x Durban Poison"
  breeder: string | null;
  awards: string[]; // e.g., ["1st Place - High Times Cannabis Cup 2020"]
  popularity: number; // 1-100 scale
  rating: number; // 1-5 scale
  review_count: number;
  images: StrainImage[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StrainImage {
  id: string;
  strain_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Terpene {
  name: string;
  percentage: number | null;
  description: string;
  effects: string[];
}

export interface StrainCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface StrainFilter {
  type?: StrainType[];
  thc_range?: [number, number];
  cbd_range?: [number, number];
  effects?: EffectType[];
  flavors?: FlavorType[];
  medical_uses?: MedicalUseType[];
  growing_difficulty?: ('easy' | 'moderate' | 'difficult')[];
  climate?: ('indoor' | 'outdoor' | 'greenhouse' | 'both')[];
  search_query?: string;
  sort_by?: 'name' | 'thc' | 'cbd' | 'rating' | 'popularity' | 'newest';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface StrainSearchResult {
  strains: Strain[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export type CommonStrain = Omit<
  Strain,
  | 'id'
  | 'slug'
  | 'description'
  | 'thca'
  | 'cbn'
  | 'cbg'
  | 'terpenes'
  | 'images'
  | 'awards'
  | 'is_featured'
  | 'is_active'
  | 'created_at'
  | 'updated_at'
  | 'review_count'
>;

// Common cannabis strains data for reference
export const COMMON_STRAINS: CommonStrain[] = [
  {
    name: 'OG Kush',
    type: 'hybrid' as StrainType,
    thc: 20.0,
    cbd: 0.1,
    effects: ['relaxed', 'happy', 'euphoric', 'sleepy'],
    flavors: ['earthy', 'pine', 'woody'],
    medical_uses: ['stress', 'pain', 'insomnia', 'appetite'],
    growing_difficulty: 'moderate',
    flowering_time_weeks: 8,
    yield_indoor: '1-2 oz/ft²',
    yield_outdoor: '10-15 oz/plant',
    height_indoor: '30-60 in',
    height_outdoor: '60-80 in',
    climate: 'both',
    genetics: 'Chemdawg x Hindu Kush',
    breeder: 'Unknown',
    popularity: 95,
    rating: 4.7,
  },
  {
    name: 'Blue Dream',
    type: 'sativa' as StrainType,
    thc: 18.0,
    cbd: 0.2,
    effects: ['happy', 'euphoric', 'uplifted', 'energetic', 'creative'],
    flavors: ['sweet', 'berry', 'fruity'],
    medical_uses: ['stress', 'depression', 'pain', 'fatigue'],
    growing_difficulty: 'easy',
    flowering_time_weeks: 9,
    yield_indoor: '1-2 oz/ft²',
    yield_outdoor: '12-16 oz/plant',
    height_indoor: '30-60 in',
    height_outdoor: '72-96 in',
    climate: 'both',
    genetics: 'Blueberry x Haze',
    breeder: 'Unknown',
    popularity: 90,
    rating: 4.6,
  },
  {
    name: 'Granddaddy Purple',
    type: 'indica' as StrainType,
    thc: 17.0,
    cbd: 0.1,
    effects: ['relaxed', 'happy', 'sleepy', 'hungry', 'euphoric'],
    flavors: ['grape', 'berry', 'sweet'],
    medical_uses: ['stress', 'pain', 'insomnia', 'appetite', 'anxiety'],
    growing_difficulty: 'easy',
    flowering_time_weeks: 8,
    yield_indoor: '1-2 oz/ft²',
    yield_outdoor: '8-10 oz/plant',
    height_indoor: '30-60 in',
    height_outdoor: '60-72 in',
    climate: 'both',
    genetics: 'Purple Urkle x Big Bud',
    breeder: 'Ken Estes',
    popularity: 88,
    rating: 4.5,
  },
  {
    name: 'Sour Diesel',
    type: 'sativa' as StrainType,
    thc: 21.0,
    cbd: 0.1,
    effects: ['energetic', 'uplifted', 'euphoric', 'creative', 'happy'],
    flavors: ['diesel', 'citrus', 'earthy', 'sour'],
    medical_uses: ['stress', 'depression', 'pain', 'fatigue'],
    growing_difficulty: 'moderate',
    flowering_time_weeks: 10,
    yield_indoor: '1-2 oz/ft²',
    yield_outdoor: '12-16 oz/plant',
    height_indoor: '30-60 in',
    height_outdoor: '72-96 in',
    climate: 'both',
    genetics: 'Chemdawg 91 x Super Skunk',
    breeder: 'Unknown',
    popularity: 85,
    rating: 4.4,
  },
  {
    name: 'Girl Scout Cookies',
    type: 'hybrid' as StrainType,
    thc: 20.0,
    cbd: 0.1,
    effects: ['euphoric', 'happy', 'relaxed', 'creative', 'uplifted'],
    flavors: ['sweet', 'earthy', 'minty'],
    medical_uses: ['stress', 'pain', 'depression', 'anxiety', 'appetite'],
    growing_difficulty: 'moderate',
    flowering_time_weeks: 9,
    yield_indoor: '1-2 oz/ft²',
    yield_outdoor: '10-12 oz/plant',
    height_indoor: '30-60 in',
    height_outdoor: '60-72 in',
    climate: 'both',
    genetics: 'OG Kush x Durban Poison',
    breeder: 'Unknown',
    popularity: 92,
    rating: 4.8,
  },
  {
    name: 'White Widow',
    type: 'hybrid' as StrainType,
    thc: 18.0,
    cbd: 0.1,
    effects: ['euphoric', 'happy', 'relaxed', 'uplifted', 'creative'],
    flavors: ['earthy', 'woody', 'sweet'],
    medical_uses: ['stress', 'pain', 'depression', 'anxiety'],
    growing_difficulty: 'easy',
    flowering_time_weeks: 8,
    yield_indoor: '1.5-2 oz/ft²',
    yield_outdoor: '12-16 oz/plant',
    height_indoor: '30-60 in',
    height_outdoor: '60-78 in',
    climate: 'both',
    genetics: 'Brazilian Sativa x South Indian Indica',
    breeder: 'Green House Seeds',
    popularity: 87,
    rating: 4.6,
  },
  {
    name: 'Gelato',
    type: 'hybrid' as StrainType,
    thc: 20.0,
    cbd: 0.1,
    effects: ['happy', 'euphoric', 'relaxed', 'uplifted', 'creative'],
    flavors: ['citrus', 'sweet', 'berry', 'creamy'],
    medical_uses: ['stress', 'pain', 'depression', 'anxiety'],
    growing_difficulty: 'moderate',
    flowering_time_weeks: 8,
    yield_indoor: '1-2 oz/ft²',
    yield_outdoor: '10-12 oz/plant',
    height_indoor: '30-60 in',
    height_outdoor: '60-72 in',
    climate: 'both',
    genetics: 'Sunset Sherbet x Thin Mint GSC',
    breeder: 'Cookie Fam',
    popularity: 94,
    rating: 4.8,
  },
  {
    name: 'Northern Lights',
    type: 'indica' as StrainType,
    thc: 16.0,
    cbd: 0.1,
    effects: ['relaxed', 'sleepy', 'happy', 'euphoric', 'hungry'],
    flavors: ['sweet', 'earthy', 'pine'],
    medical_uses: ['insomnia', 'pain', 'stress', 'anxiety', 'appetite'],
    growing_difficulty: 'easy',
    flowering_time_weeks: 7,
    yield_indoor: '1.5-2 oz/ft²',
    yield_outdoor: '10-12 oz/plant',
    height_indoor: '24-48 in',
    height_outdoor: '48-72 in',
    climate: 'both',
    genetics: 'Afghani x Thai',
    breeder: 'Sensi Seeds',
    popularity: 89,
    rating: 4.7,
  },
  {
    name: 'Pineapple Express',
    type: 'sativa' as StrainType,
    thc: 17.0,
    cbd: 0.1,
    effects: ['happy', 'energetic', 'uplifted', 'euphoric', 'creative'],
    flavors: ['pineapple', 'tropical', 'sweet', 'earthy'],
    medical_uses: ['stress', 'depression', 'pain', 'fatigue'],
    growing_difficulty: 'easy',
    flowering_time_weeks: 8,
    yield_indoor: '1-2 oz/ft²',
    yield_outdoor: '12-16 oz/plant',
    height_indoor: '30-60 in',
    height_outdoor: '72-96 in',
    climate: 'both',
    genetics: 'Trainwreck x Hawaiian',
    breeder: 'G13 Labs',
    popularity: 82,
    rating: 4.5,
  },
  {
    name: 'Green Crack',
    type: 'sativa' as StrainType,
    thc: 18.0,
    cbd: 0.1,
    effects: ['energetic', 'focused', 'uplifted', 'euphoric', 'happy'],
    flavors: ['sweet', 'citrus', 'fruity', 'tropical'],
    medical_uses: ['fatigue', 'stress', 'depression', 'pain'],
    growing_difficulty: 'moderate',
    flowering_time_weeks: 7,
    yield_indoor: '1-2 oz/ft²',
    yield_outdoor: '10-12 oz/plant',
    height_indoor: '30-60 in',
    height_outdoor: '60-72 in',
    climate: 'both',
    genetics: 'Skunk #1 x Afghani',
    breeder: 'Unknown',
    popularity: 86,
    rating: 4.5,
  },
];

const DEMO_STRAIN_DATE = "2026-07-01T00:00:00.000Z";

export const MOCK_STRAINS: Strain[] = COMMON_STRAINS.map((strain, index) => {
  const id = `strain-${index + 1}`;
  const slug = strain.name.toLowerCase().replace(/\s+/g, '-');

  return {
    ...strain,
    id,
    slug,
    description: `A popular cannabis strain known for its ${strain.effects.join(', ')} effects and ${strain.flavors.join(', ')} flavors.`,
    thca: null,
    cbn: null,
    cbg: null,
    terpenes: [],
    images: [
      {
        id: `${id}-image-1`,
        strain_id: id,
        image_url: `/images/strains/${slug}.jpg`,
        alt_text: strain.name,
        is_primary: true,
        sort_order: 1,
        created_at: DEMO_STRAIN_DATE,
      },
    ],
    awards: [],
    is_featured: index < 3,
    is_active: true,
    created_at: DEMO_STRAIN_DATE,
    updated_at: DEMO_STRAIN_DATE,
    review_count: 50 + index * 7,
  };
});

// Terpene data
export const TERPENES = [
  { name: 'Myrcene', description: 'Earthy, musky, with hints of cloves and herbs', effects: ['relaxing', 'sedating', 'anti-inflammatory'] },
  { name: 'Limonene', description: 'Citrus, lemon, orange aromas', effects: ['mood-enhancing', 'anti-anxiety', 'anti-depressant'] },
  { name: 'Pinene', description: 'Pine scent, fresh and woody', effects: ['anti-inflammatory', 'bronchodilator', 'memory retention'] },
  { name: 'Linalool', description: 'Floral, lavender-like aroma', effects: ['anti-anxiety', 'sedating', 'anti-depressant'] },
  { name: 'Caryophyllene', description: 'Spicy, peppery, woody aroma', effects: ['anti-inflammatory', 'pain relief', 'anti-anxiety'] },
  { name: 'Humulene', description: 'Hoppy, earthy, woody aroma', effects: ['anti-inflammatory', 'appetite suppressant', 'antibacterial'] },
  { name: 'Terpinolene', description: 'Piney, floral, herbal, citrusy', effects: ['sedating', 'anti-anxiety', 'antibacterial'] },
  { name: 'Ocimene', description: 'Sweet, herbal, woody', effects: ['anti-viral', 'anti-fungal', 'anti-inflammatory'] },
  { name: 'Geraniol', description: 'Rose, floral, citrus', effects: ['neuroprotective', 'anti-depressant'] },
  { name: 'Borneol', description: 'Minty, camphor-like', effects: ['pain relief', 'anti-inflammatory', 'digestive aid'] },
];

// Effect categories for filtering
export const EFFECT_CATEGORIES: { value: EffectType; label: string; icon: string }[] = [
  { value: 'relaxed', label: 'Relaxed', icon: '😌' },
  { value: 'happy', label: 'Happy', icon: '😊' },
  { value: 'euphoric', label: 'Euphoric', icon: '🌈' },
  { value: 'uplifted', label: 'Uplifted', icon: '🚀' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'energetic', label: 'Energetic', icon: '⚡' },
  { value: 'focused', label: 'Focused', icon: '🎯' },
  { value: 'sleepy', label: 'Sleepy', icon: '😴' },
  { value: 'hungry', label: 'Hungry', icon: '🍕' },
  { value: 'tingly', label: 'Tingly', icon: '✨' },
  { value: 'giggly', label: 'Giggly', icon: '😂' },
  { value: 'aroused', label: 'Aroused', icon: '💋' },
  { value: 'talkative', label: 'Talkative', icon: '🗣️' },
];

// Flavor categories for filtering
export const FLAVOR_CATEGORIES: { value: FlavorType; label: string; icon: string }[] = [
  { value: 'earthy', label: 'Earthy', icon: '🌱' },
  { value: 'sweet', label: 'Sweet', icon: '🍬' },
  { value: 'fruity', label: 'Fruity', icon: '🍓' },
  { value: 'citrus', label: 'Citrus', icon: '🍊' },
  { value: 'berry', label: 'Berry', icon: '🫐' },
  { value: 'grape', label: 'Grape', icon: '🍇' },
  { value: 'diesel', label: 'Diesel', icon: '⛽' },
  { value: 'pine', label: 'Pine', icon: '🌲' },
  { value: 'woody', label: 'Woody', icon: '🪵' },
  { value: 'spicy', label: 'Spicy', icon: '🌶️' },
  { value: 'herbal', label: 'Herbal', icon: '🌿' },
  { value: 'cheese', label: 'Cheese', icon: '🧀' },
  { value: 'minty', label: 'Minty', icon: '🌿' },
  { value: 'vanilla', label: 'Vanilla', icon: '🍦' },
  { value: 'nutty', label: 'Nutty', icon: '🌰' },
  { value: 'sour', label: 'Sour', icon: '🍋' },
  { value: 'tropical', label: 'Tropical', icon: '🌴' },
  { value: 'pineapple', label: 'Pineapple', icon: '🍍' },
  { value: 'creamy', label: 'Creamy', icon: '🍦' },
];

// Medical use categories for filtering
export const MEDICAL_CATEGORIES: { value: MedicalUseType; label: string; icon: string }[] = [
  { value: 'stress', label: 'Stress', icon: '🧘' },
  { value: 'anxiety', label: 'Anxiety', icon: '😰' },
  { value: 'depression', label: 'Depression', icon: '😞' },
  { value: 'insomnia', label: 'Insomnia', icon: '😴' },
  { value: 'pain', label: 'Pain', icon: '🩹' },
  { value: 'inflammation', label: 'Inflammation', icon: '🔥' },
  { value: 'appetite', label: 'Appetite', icon: '🍽️' },
  { value: 'nausea', label: 'Nausea', icon: '🤢' },
  { value: 'seizures', label: 'Seizures', icon: '⚡' },
  { value: 'spasticity', label: 'Spasticity', icon: '🦵' },
  { value: 'fatigue', label: 'Fatigue', icon: '😫' },
  { value: 'headaches', label: 'Headaches', icon: '🤕' },
  { value: 'migraines', label: 'Migraines', icon: '💥' },
];

// Strain type options
export const STRAIN_TYPES: { value: StrainType; label: string; icon: string; description: string }[] = [
  { value: 'indica', label: 'Indica', icon: '🌙', description: 'Relaxing, body high, nighttime use' },
  { value: 'sativa', label: 'Sativa', icon: '☀️', description: 'Energizing, cerebral high, daytime use' },
  { value: 'hybrid', label: 'Hybrid', icon: '🌅', description: 'Balanced effects, best of both worlds' },
];

// Growing difficulty options
export const GROWING_DIFFICULTY: { value: Strain['growing_difficulty']; label: string; icon: string; description: string }[] = [
  { value: 'easy', label: 'Easy', icon: '🟢', description: 'Great for beginners' },
  { value: 'moderate', label: 'Moderate', icon: '🟡', description: 'Some experience recommended' },
  { value: 'difficult', label: 'Difficult', icon: '🔴', description: 'Expert growers only' },
];

// Climate options
export const CLIMATE_OPTIONS: { value: Strain['climate']; label: string; icon: string }[] = [
  { value: 'indoor', label: 'Indoor', icon: '🏠' },
  { value: 'outdoor', label: 'Outdoor', icon: '🌳' },
  { value: 'greenhouse', label: 'Greenhouse', icon: '🏡' },
  { value: 'both', label: 'Both', icon: '🌍' },
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'thc', label: 'THC % (High to Low)' },
  { value: 'cbd', label: 'CBD % (High to Low)' },
  { value: 'rating', label: 'Rating (High to Low)' },
  { value: 'popularity', label: 'Popularity (High to Low)' },
  { value: 'newest', label: 'Newest' },
];
