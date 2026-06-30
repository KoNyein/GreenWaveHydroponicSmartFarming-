"use client";

import { useState } from "react";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/translations";
import { Search, Filter, X, ArrowUp, ArrowDown } from "lucide-react";
import {
  StrainFilter,
  STRAIN_TYPES,
  EFFECT_CATEGORIES,
  FLAVOR_CATEGORIES,
  MEDICAL_CATEGORIES,
  GROWING_DIFFICULTY,
  CLIMATE_OPTIONS,
  SORT_OPTIONS,
} from "@/types/strains";

interface StrainSearchFormProps {
  filters: StrainFilter;
  onFilterChange: (key: keyof StrainFilter, value: any) => void;
  onMultiSelectChange: (key: keyof StrainFilter, value: string) => void;
  onClearFilters: () => void;
  resultCount?: number;
  totalCount?: number;
}

export default function StrainSearchForm({
  filters,
  onFilterChange,
  onMultiSelectChange,
  onClearFilters,
  resultCount,
  totalCount,
}: StrainSearchFormProps) {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const [showFilters, setShowFilters] = useState(false);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(val => {
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'string') return val !== '';
    if (Array.isArray(val) && val.length === 2) {
      // For range sliders, check if not default
      if (filters.thc_range && val[0] !== 0 && val[1] !== 30) return true;
      if (filters.cbd_range && val[0] !== 0 && val[1] !== 20) return true;
    }
    return false;
  });

  return (
    <Card>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <Input
            type="text"
            placeholder={tr("strains.searchPlaceholder")}
            value={filters.search_query || ''}
            onChange={(e) => onFilterChange('search_query', e.target.value)}
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
          {hasActiveFilters && (
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
            onFilterChange('sort_by', sortBy as 'name' | 'thc' | 'cbd' | 'rating' | 'popularity' | 'newest');
            onFilterChange('sort_order', sortOrder as 'asc' | 'desc');
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

      {/* Results Count */}
      {resultCount !== undefined && totalCount !== undefined && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted">
            {tr("strains.showingResults", {
              count: resultCount,
              total: totalCount,
            })}
          </p>
        </div>
      )}

      {/* Advanced Filters (Collapsible) */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{tr("strains.advancedFilters")}</h3>
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-2">
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
                    onClick={() => onMultiSelectChange('type', type.value)}
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
              <h4 className="font-medium mb-3">{tr("strains.thcContent")}</h4>
              <div className="space-y-2">
                <Slider
                  value={filters.thc_range || [0, 30]}
                  onValueChange={(value) => onFilterChange('thc_range', value)}
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
              <h4 className="font-medium mb-3">{tr("strains.cbdContent")}</h4>
              <div className="space-y-2">
                <Slider
                  value={filters.cbd_range || [0, 20]}
                  onValueChange={(value) => onFilterChange('cbd_range', value)}
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
                {EFFECT_CATEGORIES.slice(0, 8).map((effect) => (
                  <Button
                    key={effect.value}
                    variant={filters.effects?.includes(effect.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onMultiSelectChange('effects', effect.value)}
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
                {FLAVOR_CATEGORIES.slice(0, 8).map((flavor) => (
                  <Button
                    key={flavor.value}
                    variant={filters.flavors?.includes(flavor.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onMultiSelectChange('flavors', flavor.value)}
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
                {MEDICAL_CATEGORIES.slice(0, 8).map((use) => (
                  <Button
                    key={use.value}
                    variant={filters.medical_uses?.includes(use.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onMultiSelectChange('medical_uses', use.value)}
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
                    onClick={() => onMultiSelectChange('growing_difficulty', difficulty.value)}
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
                    onClick={() => onMultiSelectChange('climate', climate.value)}
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
  );
}
