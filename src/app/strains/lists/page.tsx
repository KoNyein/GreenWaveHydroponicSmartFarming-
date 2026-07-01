"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Slider } from "@/components/ui/Slider";
import { t } from "@/lib/translations";
import {
  Search,
  Filter,
  X,
  Plus,
  SortAsc,
  SortDesc,
  Leaf,
  Star,
  Flame,
  Heart,
  TrendingUp,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Strain,
  StrainFilter,
  STRAIN_TYPES,
  EFFECT_CATEGORIES,
  FLAVOR_CATEGORIES,
  MEDICAL_CATEGORIES,
  GROWING_DIFFICULTY,
  CLIMATE_OPTIONS,
  SORT_OPTIONS,
  MOCK_STRAINS,
} from "@/types/strains";

// Mock data for demo - in production, this would come from your database
const mockStrains: Strain[] = MOCK_STRAINS;

function getStrainTypeColor(type: string) {
  switch (type) {
    case 'indica':
      return 'bg-purple-500';
    case 'sativa':
      return 'bg-green-500';
    case 'hybrid':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
}

function getStrainTypeIcon(type: string) {
  switch (type) {
    case 'indica':
      return '🌙';
    case 'sativa':
      return '☀️';
    case 'hybrid':
      return '🌅';
    default:
      return '🌱';
  }
}

export default function StrainsListPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string, params?: Record<string, string | number>) => t(key, locale, params);

  // State for filters
  const [filters, setFilters] = useState<StrainFilter>({
    type: [],
    thc_range: [0, 30],
    cbd_range: [0, 20],
    effects: [],
    flavors: [],
    medical_uses: [],
    growing_difficulty: [],
    climate: [],
    search_query: '',
    sort_by: 'popularity',
    sort_order: 'desc',
    page: 1,
    limit: 12,
  });

  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort strains
  const filteredStrains = useMemo(() => {
    return mockStrains
      .filter(strain => {
        // Search query filter
        if (filters.search_query) {
          const query = filters.search_query.toLowerCase();
          if (!strain.name.toLowerCase().includes(query) &&
              !strain.description.toLowerCase().includes(query) &&
              !strain.genetics?.toLowerCase().includes(query)) {
            return false;
          }
        }

        // Type filter
        if (filters.type?.length > 0 && !filters.type.includes(strain.type)) {
          return false;
        }

        // THC range filter
        if (strain.thc !== null) {
          if (strain.thc < filters.thc_range![0] || strain.thc > filters.thc_range![1]) {
            return false;
          }
        }

        // CBD range filter
        if (strain.cbd !== null) {
          if (strain.cbd < filters.cbd_range![0] || strain.cbd > filters.cbd_range![1]) {
            return false;
          }
        }

        // Effects filter
        if (filters.effects?.length > 0) {
          const hasEffect = filters.effects.some(effect => strain.effects.includes(effect));
          if (!hasEffect) return false;
        }

        // Flavors filter
        if (filters.flavors?.length > 0) {
          const hasFlavor = filters.flavors.some(flavor => strain.flavors.includes(flavor));
          if (!hasFlavor) return false;
        }

        // Medical uses filter
        if (filters.medical_uses?.length > 0) {
          const hasMedicalUse = filters.medical_uses.some(use => strain.medical_uses.includes(use));
          if (!hasMedicalUse) return false;
        }

        // Growing difficulty filter
        if (filters.growing_difficulty?.length > 0 && !filters.growing_difficulty.includes(strain.growing_difficulty)) {
          return false;
        }

        // Climate filter
        if (filters.climate?.length > 0 && !filters.climate.includes(strain.climate)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sort_by) {
          case 'name':
            return filters.sort_order === 'asc' 
              ? a.name.localeCompare(b.name) 
              : b.name.localeCompare(a.name);
          case 'thc':
            return filters.sort_order === 'asc' 
              ? (a.thc || 0) - (b.thc || 0) 
              : (b.thc || 0) - (a.thc || 0);
          case 'cbd':
            return filters.sort_order === 'asc' 
              ? (a.cbd || 0) - (b.cbd || 0) 
              : (b.cbd || 0) - (a.cbd || 0);
          case 'rating':
            return filters.sort_order === 'asc' 
              ? a.rating - b.rating 
              : b.rating - a.rating;
          case 'popularity':
            return filters.sort_order === 'asc' 
              ? a.popularity - b.popularity 
              : b.popularity - a.popularity;
          case 'newest':
            return filters.sort_order === 'asc' 
              ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() 
              : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          default:
            return 0;
        }
      });
  }, [filters]);

  // Pagination
  const totalStrains = filteredStrains.length;
  const totalPages = Math.ceil(totalStrains / (filters.limit || 12));
  const paginatedStrains = filteredStrains.slice(
    (filters.page! - 1) * (filters.limit || 12),
    filters.page! * (filters.limit || 12)
  );

  // Handle filter changes
  const handleFilterChange = (key: keyof StrainFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle multi-select filter changes
  const handleMultiSelectChange = (key: keyof StrainFilter, value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] as string[] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues, page: 1 };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: [],
      thc_range: [0, 30],
      cbd_range: [0, 20],
      effects: [],
      flavors: [],
      medical_uses: [],
      growing_difficulty: [],
      climate: [],
      search_query: '',
      sort_by: 'popularity',
      sort_order: 'desc',
      page: 1,
      limit: 12,
    });
  };

  // Get strain type badge color
  const getStrainTypeColor = (type: string) => {
    switch (type) {
      case 'indica':
        return 'bg-purple-500';
      case 'sativa':
        return 'bg-green-500';
      case 'hybrid':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get strain type icon
  const getStrainTypeIcon = (type: string) => {
    switch (type) {
      case 'indica':
        return '🌙';
      case 'sativa':
        return '☀️';
      case 'hybrid':
        return '🌅';
      default:
        return '🌱';
    }
  };

  // Get THC/CBD level indicator
  const getPotencyLevel = (percentage: number | null) => {
    if (percentage === null) return 'Unknown';
    if (percentage >= 25) return 'Very High';
    if (percentage >= 20) return 'High';
    if (percentage >= 15) return 'Medium';
    if (percentage >= 10) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-500" />
            {tr("strains.title")}
          </h1>
          <p className="text-muted text-sm mt-1">{tr("strains.subtitle")}</p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/strains/new">
            <Plus className="w-4 h-4" />
            {tr("strains.addStrain")}
          </Link>
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <Input
              type="text"
              placeholder={tr("strains.searchPlaceholder")}
              value={filters.search_query || ''}
              onChange={(e) => handleFilterChange('search_query', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 flex-shrink-0"
          >
            <Filter className="w-4 h-4" />
            {tr("common.filters")}
            {Object.values(filters).some(val => {
              if (Array.isArray(val)) return val.length > 0;
              if (typeof val === 'string') return val !== '';
              if (Array.isArray(val) && val.length === 2) {
                // For range sliders, check if not default
                if (filters.thc_range && val[0] !== 0 && val[1] !== 30) return true;
                if (filters.cbd_range && val[0] !== 0 && val[1] !== 20) return true;
              }
              return false;
            }) && (
              <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                {Object.values(filters).filter(val => {
                  if (Array.isArray(val)) return val.length > 0;
                  if (typeof val === 'string') return val !== '';
                  return false;
                }).length}
              </Badge>
            )}
          </Button>

          {/* Sort Select */}
          <Select
            value={`${filters.sort_by}-${filters.sort_order}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              handleFilterChange('sort_by', sortBy as 'name' | 'thc' | 'cbd' | 'rating' | 'popularity' | 'newest');
              handleFilterChange('sort_order', sortOrder as 'asc' | 'desc');
            }}
          >
            <SelectTrigger className="w-48 flex-shrink-0">
              <SelectValue placeholder={tr("strains.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={`${option.value}-${filters.sort_order}`}>
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                    {filters.sort_order === 'asc' ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters (Collapsible) */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{tr("strains.advancedFilters")}</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                {tr("common.clearAll")}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Strain Type Filter */}
              <div>
                <h4 className="font-medium mb-3">{tr("strains.strainType")}</h4>
                <div className="flex flex-wrap gap-2">
                  {STRAIN_TYPES.map((type) => (
                    <Button
                      key={type.value}
                      variant={filters.type?.includes(type.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMultiSelectChange('type', type.value)}
                      className="gap-2"
                    >
                      <span>{type.icon}</span>
                      <span>{tr(`strains.${type.value}`) || type.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* THC Range Filter */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  {tr("strains.thcContent")}
                </h4>
                <div className="space-y-2">
                  <Slider
                    value={filters.thc_range || [0, 30]}
                    onValueChange={(value) => handleFilterChange('thc_range', value)}
                    min={0}
                    max={30}
                    step={1}
                    className="mt-4"
                  />
                  <div className="flex justify-between text-sm text-muted">
                    <span>0%</span>
                    <span>30%</span>
                  </div>
                  <div className="text-center text-sm">
                    {filters.thc_range?.[0]}% - {filters.thc_range?.[1]}%
                  </div>
                </div>
              </div>

              {/* CBD Range Filter */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-green-500" />
                  {tr("strains.cbdContent")}
                </h4>
                <div className="space-y-2">
                  <Slider
                    value={filters.cbd_range || [0, 20]}
                    onValueChange={(value) => handleFilterChange('cbd_range', value)}
                    min={0}
                    max={20}
                    step={1}
                    className="mt-4"
                  />
                  <div className="flex justify-between text-sm text-muted">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                  <div className="text-center text-sm">
                    {filters.cbd_range?.[0]}% - {filters.cbd_range?.[1]}%
                  </div>
                </div>
              </div>

              {/* Effects Filter */}
              <div>
                <h4 className="font-medium mb-3">{tr("strains.effects")}</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {EFFECT_CATEGORIES.slice(0, 6).map((effect) => (
                    <Button
                      key={effect.value}
                      variant={filters.effects?.includes(effect.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMultiSelectChange('effects', effect.value)}
                      className="h-8 px-3"
                    >
                      <span>{effect.icon}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Flavors Filter */}
              <div>
                <h4 className="font-medium mb-3">{tr("strains.flavors")}</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {FLAVOR_CATEGORIES.slice(0, 6).map((flavor) => (
                    <Button
                      key={flavor.value}
                      variant={filters.flavors?.includes(flavor.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMultiSelectChange('flavors', flavor.value)}
                      className="h-8 px-3"
                    >
                      <span>{flavor.icon}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Medical Uses Filter */}
              <div>
                <h4 className="font-medium mb-3">{tr("strains.medicalUses")}</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {MEDICAL_CATEGORIES.slice(0, 6).map((use) => (
                    <Button
                      key={use.value}
                      variant={filters.medical_uses?.includes(use.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMultiSelectChange('medical_uses', use.value)}
                      className="h-8 px-3"
                    >
                      <span>{use.icon}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Growing Difficulty Filter */}
              <div>
                <h4 className="font-medium mb-3">{tr("strains.growingDifficulty")}</h4>
                <div className="flex flex-wrap gap-2">
                  {GROWING_DIFFICULTY.map((difficulty) => (
                    <Button
                      key={difficulty.value}
                      variant={filters.growing_difficulty?.includes(difficulty.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMultiSelectChange('growing_difficulty', difficulty.value)}
                      className="gap-2"
                    >
                      <span>{difficulty.icon}</span>
                      <span>{tr(`strains.${difficulty.value}`) || difficulty.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Climate Filter */}
              <div>
                <h4 className="font-medium mb-3">{tr("strains.climate")}</h4>
                <div className="flex flex-wrap gap-2">
                  {CLIMATE_OPTIONS.map((climate) => (
                    <Button
                      key={climate.value}
                      variant={filters.climate?.includes(climate.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMultiSelectChange('climate', climate.value)}
                      className="gap-2"
                    >
                      <span>{climate.icon}</span>
                      <span>{tr(`strains.${climate.value}`) || climate.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {tr("strains.showingResults", {
            count: paginatedStrains.length,
            total: totalStrains,
          })}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">{tr("strains.limit")}</span>
          <Select
            value={filters.limit?.toString()}
            onValueChange={(value) => handleFilterChange('limit', parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[12, 24, 48, 96].map((limit) => (
                <SelectItem key={limit} value={limit.toString()}>
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured Strains */}
      {filteredStrains.some(s => s.is_featured) && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            {tr("strains.featuredStrains")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStrains
              .filter(s => s.is_featured)
              .slice(0, 4)
              .map((strain) => (
                <StrainCard key={strain.id} strain={strain} />
              ))}
          </div>
        </section>
      )}

      {/* All Strains Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-500" />
          {tr("strains.allStrains")}
        </h2>
        
        {paginatedStrains.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedStrains.map((strain) => (
              <StrainCard key={strain.id} strain={strain} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Leaf className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{tr("strains.noResults")}</h3>
            <p className="text-muted text-sm mb-4">{tr("strains.noResultsDesc")}</p>
            <Button variant="outline" onClick={clearFilters}>
              {tr("strains.clearFilters")}
            </Button>
          </Card>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('page', Math.max(1, filters.page! - 1))}
              disabled={filters.page === 1}
            >
              {tr("common.previous")}
            </Button>
            <span className="text-sm">
              {tr("common.page")} {filters.page} {tr("common.of")} {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('page', Math.min(totalPages, filters.page! + 1))}
              disabled={filters.page === totalPages}
            >
              {tr("common.next")}
            </Button>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, filters.page! - 2) + i;
              if (page > totalPages) return null;
              return (
                <Button
                  key={page}
                  variant={filters.page === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('page', page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// Strain Card Component
function StrainCard({ strain }: { strain: Strain }) {
  const { locale } = useSettingsStore();
  const tr = (key: string, params?: Record<string, string | number>) => t(key, locale, params);

  return (
    <Card className="group hover:shadow-lg transition-all overflow-hidden">
      <div className="relative aspect-square bg-muted/20">
        {strain.images[0] ? (
          <img
            src={strain.images[0].image_url}
            alt={strain.images[0].alt_text || strain.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/strains/placeholder.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Leaf className="w-16 h-16 text-white" />
          </div>
        )}
        
        {/* Strain Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge className={`${getStrainTypeColor(strain.type)} text-white`}>
            <span className="mr-1">{getStrainTypeIcon(strain.type)}</span>
            {tr(`strains.${strain.type}`) || strain.type.charAt(0).toUpperCase() + strain.type.slice(1)}
          </Badge>
        </div>

        {/* Featured Badge */}
        {strain.is_featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-orange-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              {tr("strains.featured")}
            </Badge>
          </div>
        )}

        {/* THC/CBD Badges */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {strain.thc !== null && (
            <Badge className="bg-red-500 text-white">
              <Flame className="w-3 h-3 mr-1" />
              {strain.thc}% THC
            </Badge>
          )}
          {strain.cbd !== null && strain.cbd > 0 && (
            <Badge className="bg-green-500 text-white">
              <Heart className="w-3 h-3 mr-1" />
              {strain.cbd}% CBD
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-yellow-400" />
          <span className="text-sm text-white">{strain.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold group-hover:text-accent transition">{strain.name}</h3>
          <span className="text-sm text-muted">{strain.popularity}%</span>
        </div>
        
        {/* Effects */}
        <div className="flex flex-wrap gap-1 mb-2">
          {strain.effects.slice(0, 3).map((effect) => {
            const effectData = EFFECT_CATEGORIES.find(e => e.value === effect);
            return (
              <Badge key={effect} variant="outline" className="text-xs">
                {effectData?.icon} {tr(`strains.${effect}`) || effect}
              </Badge>
            );
          })}
          {strain.effects.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{strain.effects.length - 3}
            </Badge>
          )}
        </div>

        {/* Flavors */}
        <div className="flex flex-wrap gap-1 mb-3">
          {strain.flavors.slice(0, 3).map((flavor) => {
            const flavorData = FLAVOR_CATEGORIES.find(f => f.value === flavor);
            return (
              <Badge key={flavor} variant="secondary" className="text-xs">
                {flavorData?.icon} {tr(`strains.${flavor}`) || flavor}
              </Badge>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href={`/strains/${strain.slug || strain.id}`}>
              {tr("common.viewDetails")}
            </Link>
          </Button>
          <div className="text-right">
            <p className="text-sm font-semibold">{strain.thc}% THC</p>
            {strain.cbd && strain.cbd > 0 && (
              <p className="text-xs text-muted">{strain.cbd}% CBD</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
