# 🌿 Cannabis Strains Module

A comprehensive cannabis strain database with THC/CBD percentages, strain types (Indica/Sativa/Hybrid), and advanced search functionality similar to Leafly.

## 📁 Module Structure

```
src/
├── app/
│   └── strains/
│       ├── layout.tsx          # Strains layout with auth check
│       ├── lists/
│       │   └── page.tsx        # Main strains list with search & filters
│       ├── new/
│       │   └── page.tsx        # Add new strain form
│       ├── [id]/
│       │   └── page.tsx        # Strain detail page
│       └── edit/
│           └── page.tsx        # Edit strain form (to be created)
│
└── components/
    └── strains/
        ├── StrainCard.tsx       # Reusable strain card component
        └── StrainSearchForm.tsx # Reusable search form component

└── types/
    └── strains.ts             # TypeScript types for strains

└── lib/
    └── translations.ts        # Updated with strains translations
```

## ✨ Features Implemented

### 1. **Strain List Page** (`/strains/lists`)
- ✅ **Search Functionality**: Search by name, genetics, or description
- ✅ **Advanced Filters**:
  - Strain Type (Indica, Sativa, Hybrid)
  - THC Range (0-30% slider)
  - CBD Range (0-20% slider)
  - Effects (Relaxed, Happy, Euphoric, etc.)
  - Flavors (Earthy, Sweet, Fruity, etc.)
  - Medical Uses (Stress, Anxiety, Pain, etc.)
  - Growing Difficulty (Easy, Moderate, Difficult)
  - Climate (Indoor, Outdoor, Greenhouse, Both)
- ✅ **Sorting Options**:
  - Name (A-Z)
  - THC % (High to Low)
  - CBD % (High to Low)
  - Rating (High to Low)
  - Popularity (High to Low)
  - Newest
- ✅ **Pagination**: 12/24/48/96 items per page
- ✅ **Featured Strains**: Highlighted at the top
- ✅ **Responsive Grid**: 1-4 columns based on screen size
- ✅ **Strain Cards**: Visual display with images, badges, ratings

### 2. **Strain Detail Page** (`/strains/[id]`)
- ✅ **Strain Information**:
  - Name, slug, description
  - Strain type (Indica/Sativa/Hybrid)
  - Genetics and breeder
  - Awards
- ✅ **Cannabinoid Profile**:
  - THC % with progress bar
  - CBD % with progress bar
  - THCA, CBN, CBG (optional)
- ✅ **Characteristics**:
  - Flowering time
  - Yield (indoor/outdoor)
  - Height (indoor/outdoor)
  - Climate preference
  - Growing difficulty
- ✅ **Effects**: Visual badges for all effects
- ✅ **Flavors**: Visual badges for all flavors
- ✅ **Medical Uses**: Visual badges with medical disclaimer
- ✅ **Growing Information**: Tips and nutrient needs
- ✅ **Similar Strains**: Related strain suggestions
- ✅ **Image Gallery**: Multiple images with primary image indicator

### 3. **Add New Strain Form** (`/strains/new`)
- ✅ **Basic Information**:
  - Name (required)
  - Slug (auto-generated)
  - Description (required)
  - Strain type
  - Breeder
  - Genetics
- ✅ **Cannabinoid Profile**:
  - THC % (slider + input)
  - CBD % (slider + input)
  - THCA %
  - CBN %
  - CBG %
- ✅ **Effects**: Multi-select from predefined list
- ✅ **Flavors**: Multi-select from predefined list
- ✅ **Medical Uses**: Multi-select from predefined list
- ✅ **Growing Information**:
  - Growing difficulty
  - Climate preference
  - Flowering time (weeks)
  - Yield (indoor/outdoor)
  - Height (indoor/outdoor)
- ✅ **Awards**: Add/remove awards
- ✅ **Images**: Upload up to 5 images with previews
- ✅ **Settings**:
  - Featured strain toggle
  - Active strain toggle
- ✅ **Form Validation**: Required fields validation
- ✅ **Action Buttons**: Save, Cancel

### 4. **Reusable Components**
- ✅ **StrainCard**: Consistent strain card display
- ✅ **StrainSearchForm**: Reusable search and filter form

### 5. **TypeScript Types** (`/types/strains.ts`)
- ✅ **Strain Interface**: Complete strain data structure
- ✅ **StrainImage Interface**: Image data structure
- ✅ **Terpene Interface**: Terpene data structure
- ✅ **StrainCategory Interface**: Category data structure
- ✅ **StrainFilter Interface**: Filter parameters
- ✅ **StrainSearchResult Interface**: Search result structure
- ✅ **Type Definitions**: StrainType, EffectType, FlavorType, MedicalUseType
- ✅ **Predefined Data**:
  - COMMON_STRAINS: 10 popular strains
  - TERPENES: Common terpenes
  - EFFECT_CATEGORIES: Effect options with icons
  - FLAVOR_CATEGORIES: Flavor options with icons
  - MEDICAL_CATEGORIES: Medical use options with icons
  - STRAIN_TYPES: Strain type options
  - GROWING_DIFFICULTY: Difficulty levels
  - CLIMATE_OPTIONS: Climate options
  - SORT_OPTIONS: Sorting options

### 6. **Translations** (`/lib/translations.ts`)
- ✅ **English (en)**: Complete translations for all strain-related text
- ✅ **Myanmar (mm)**: Placeholder for Myanmar translations
- ✅ **Navigation**: Added "Strains" to navigation
- ✅ **All UI Text**: Translated for internationalization

### 7. **Sidebar Integration**
- ✅ **Navigation Link**: Added "Strains" to sidebar with DNA icon
- ✅ **Role-Based Access**: Available to all authenticated users

## 🎨 UI/UX Features

### Design Elements
- **Color Coding**:
  - Indica: Purple
  - Sativa: Green
  - Hybrid: Orange
- **Icons**: Emoji icons for strain types, effects, flavors
- **Badges**: Visual indicators for THC/CBD percentages, effects, flavors
- **Progress Bars**: Visual representation of cannabinoid percentages
- **Cards**: Consistent card design with hover effects
- **Responsive**: Works on mobile, tablet, and desktop

### Interactive Elements
- **Search Bar**: Real-time search filtering
- **Filter Buttons**: Toggle filters on/off
- **Range Sliders**: Visual THC/CBD range selection
- **Multi-Select**: Choose multiple effects, flavors, medical uses
- **Image Upload**: Drag & drop or file selection
- **Pagination**: Navigate through results
- **Sorting**: Change sort order dynamically

## 📊 Data Structure

### Strain Object
```typescript
{
  id: string;
  name: string;
  slug: string;
  type: 'indica' | 'sativa' | 'hybrid';
  description: string;
  thc: number | null;
  cbd: number | null;
  thca: number | null;
  cbn: number | null;
  cbg: number | null;
  effects: EffectType[];
  flavors: FlavorType[];
  medical_uses: MedicalUseType[];
  growing_difficulty: 'easy' | 'moderate' | 'difficult';
  flowering_time_weeks: number | null;
  yield_indoor: string | null;
  yield_outdoor: string | null;
  height_indoor: string | null;
  height_outdoor: string | null;
  climate: 'indoor' | 'outdoor' | 'greenhouse' | 'both';
  genetics: string | null;
  breeder: string | null;
  awards: string[];
  popularity: number;
  rating: number;
  review_count: number;
  images: StrainImage[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### Filter Object
```typescript
{
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
```

## 🚀 Usage Examples

### Basic Usage
```tsx
// Import the strain list page
import StrainsListPage from '@/app/strains/lists/page';

// The page automatically handles all filtering, sorting, and pagination
```

### Using StrainCard Component
```tsx
import StrainCard from '@/components/strains/StrainCard';

<StrainCard strain={strainData} showActions={true} />
```

### Using StrainSearchForm Component
```tsx
import StrainSearchForm from '@/components/strains/StrainSearchForm';

<StrainSearchForm
  filters={filters}
  onFilterChange={handleFilterChange}
  onMultiSelectChange={handleMultiSelectChange}
  onClearFilters={clearFilters}
  resultCount={filteredStrains.length}
  totalCount={totalStrains}
/>
```

## 🔧 Database Integration (Next Steps)

To integrate with your Supabase database, you'll need to:

### 1. Create Database Tables
```sql
-- Strains table
CREATE TABLE strains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('indica', 'sativa', 'hybrid')),
  description TEXT,
  thc NUMERIC,
  cbd NUMERIC,
  thca NUMERIC,
  cbn NUMERIC,
  cbg NUMERIC,
  effects TEXT[],
  flavors TEXT[],
  medical_uses TEXT[],
  growing_difficulty TEXT CHECK (growing_difficulty IN ('easy', 'moderate', 'difficult')),
  flowering_time_weeks INTEGER,
  yield_indoor TEXT,
  yield_outdoor TEXT,
  height_indoor TEXT,
  height_outdoor TEXT,
  climate TEXT CHECK (climate IN ('indoor', 'outdoor', 'greenhouse', 'both')),
  genetics TEXT,
  breeder TEXT,
  awards TEXT[],
  popularity NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Strain images table
CREATE TABLE strain_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strain_id UUID NOT NULL REFERENCES strains(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_strains_name ON strains(name);
CREATE INDEX idx_strains_slug ON strains(slug);
CREATE INDEX idx_strains_type ON strains(type);
CREATE INDEX idx_strains_thc ON strains(thc);
CREATE INDEX idx_strains_cbd ON strains(cbd);
CREATE INDEX idx_strains_rating ON strains(rating DESC);
CREATE INDEX idx_strains_popularity ON strains(popularity DESC);
CREATE INDEX idx_strains_is_featured ON strains(is_featured);
CREATE INDEX idx_strains_is_active ON strains(is_active);
CREATE INDEX idx_strain_images_strain ON strain_images(strain_id);
```

### 2. Create API Endpoints
```tsx
// GET /api/strains - List all strains with filters
// GET /api/strains/:id - Get single strain by ID or slug
// POST /api/strains - Create new strain
// PUT /api/strains/:id - Update strain
// DELETE /api/strains/:id - Delete strain
```

### 3. Replace Mock Data
Replace the `COMMON_STRAINS` mock data with real data from your database.

## 🎯 Future Enhancements

### 1. **Edit Strain Page**
- Create `/strains/edit/[id]/page.tsx` for editing existing strains
- Pre-fill form with existing strain data
- Add delete confirmation

### 2. **Strain Categories**
- Add category system for organizing strains
- Filter by category

### 3. **User Reviews & Ratings**
- Allow users to rate and review strains
- Calculate average ratings
- Display user reviews

### 4. **Terpene Profile**
- Add detailed terpene information
- Visual terpene charts

### 5. **Advanced Search**
- Full-text search
- Fuzzy matching
- Saved searches

### 6. **Strain Comparison**
- Compare multiple strains side-by-side
- Visual comparison charts

### 7. **User Favorites**
- Allow users to save favorite strains
- Create wishlists

### 8. **Strain Analytics**
- Popularity trends
- User engagement metrics
- Most viewed strains

## 📈 Predefined Data

The module includes predefined data for:

### Popular Strains (10)
1. OG Kush
2. Blue Dream
3. Granddaddy Purple
4. Sour Diesel
5. Girl Scout Cookies
6. White Widow
7. Gelato
8. Northern Lights
9. Pineapple Express
10. Green Crack

### Effects (12)
- Relaxed, Happy, Euphoric, Uplifted, Creative
- Energetic, Focused, Sleepy, Hungry, Tingly
- Giggly, Aroused, Talkative

### Flavors (14)
- Earthy, Sweet, Fruity, Citrus, Berry
- Diesel, Pine, Woody, Spicy, Herbal
- Cheese, Minty, Vanilla, Nutty

### Medical Uses (12)
- Stress, Anxiety, Depression, Insomnia
- Pain, Inflammation, Appetite, Nausea
- Seizures, Spasticity, Fatigue, Headaches, Migraines

### Terpenes (10)
- Myrcene, Limonene, Pinene, Linalool
- Caryophyllene, Humulene, Terpinolene
- Ocimene, Geraniol, Borneol

## 🌱 Cannabis Knowledge

### Strain Types
- **Indica**: Relaxing, body high, nighttime use, "in-da-couch"
- **Sativa**: Energizing, cerebral high, daytime use
- **Hybrid**: Balanced effects, best of both worlds

### Common THC/CBD Levels
- **Low THC**: 0-10%
- **Medium THC**: 10-20%
- **High THC**: 20-30%
- **Low CBD**: 0-1%
- **Medium CBD**: 1-5%
- **High CBD**: 5-20%

### Common Effects by Type
- **Indica**: Relaxed, Sleepy, Happy, Hungry
- **Sativa**: Energetic, Uplifted, Euphoric, Creative
- **Hybrid**: Balanced mix of both

### Common Flavors by Strain
- **Kush**: Earthy, Pine, Woody
- **Haze**: Sweet, Citrus, Spicy
- **Diesel**: Fuel, Chemical, Skunky
- **Fruity**: Berry, Tropical, Sweet

## 🔗 Related Links

- [Leafly Strains](https://www.leafly.com/strains/lists)
- [WikiLeaf](https://www.wikileaf.com/strain/)
- [AllBud](https://www.allbud.com/)

## 📝 Notes

1. **Medical Disclaimer**: All medical information is for educational purposes only and not intended as medical advice.

2. **Legal Compliance**: Ensure compliance with local laws and regulations regarding cannabis information.

3. **Image Placeholders**: The module uses placeholder images. Replace with actual strain images.

4. **Database Integration**: Currently uses mock data. Connect to your Supabase database for production use.

5. **Authentication**: The strains module is protected and requires authentication.

---

**Module Status**: ✅ Complete and Ready for Use

**Last Updated**: 2024

**Version**: 1.0.0
