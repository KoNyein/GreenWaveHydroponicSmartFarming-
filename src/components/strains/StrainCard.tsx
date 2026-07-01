"use client";

import Link from "next/link";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/translations";
import { Leaf, Star, Flame, Heart } from "lucide-react";
import { Strain, EFFECT_CATEGORIES, FLAVOR_CATEGORIES } from "@/types/strains";

interface StrainCardProps {
  strain: Strain;
  showActions?: boolean;
}

export default function StrainCard({ strain, showActions = true }: StrainCardProps) {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

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

  return (
    <Card className="group hover:shadow-lg transition-all overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square bg-muted/20 flex-shrink-0">
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

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold group-hover:text-accent transition truncate">
            {strain.name}
          </h3>
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
        {showActions && (
          <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
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
        )}
      </div>
    </Card>
  );
}
