"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { t } from "@/lib/translations";
import {
  Leaf,
  Star,
  Flame,
  Heart,
  Clock,
  Ruler,
  Weight,
  Thermometer,
  Droplets,
  Award,
  Edit,
  Trash2,
  Share2,
  Bookmark,
  ArrowLeft,
  Plus,
} from "lucide-react";
import {
  Strain,
  STRAIN_TYPES,
  EFFECT_CATEGORIES,
  FLAVOR_CATEGORIES,
  MEDICAL_CATEGORIES,
  GROWING_DIFFICULTY,
  CLIMATE_OPTIONS,
  MOCK_STRAINS,
} from "@/types/strains";

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

export default function StrainDetailPage() {
  const params = useParams();
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  // Find the strain by ID or slug
  const strainId = params.id as string;
  const strain: Strain | undefined = MOCK_STRAINS.find(s =>
    s.id === strainId ||
    s.slug === strainId ||
    s.name.toLowerCase().replace(/\s+/g, '-') === strainId
  );

  if (!strain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <Leaf className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{tr("strains.notFound")}</h2>
          <p className="text-muted mb-4">{tr("strains.notFoundDesc")}</p>
          <Button asChild>
            <Link href="/strains/lists">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {tr("strains.backToList")}
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate average values for visualization
  const thcPercentage = strain.thc ? Math.min(strain.thc * 3.33, 100) : 0; // Scale to 0-100 for progress bar
  const cbdPercentage = strain.cbd ? Math.min(strain.cbd * 5, 100) : 0;

  // Get strain type info
  const strainTypeInfo = STRAIN_TYPES.find(t => t.value === strain.type);
  const growingDifficultyInfo = GROWING_DIFFICULTY.find(d => d.value === strain.growing_difficulty);
  const climateInfo = CLIMATE_OPTIONS.find(c => c.value === strain.climate);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Button asChild variant="ghost" size="sm">
          <Link href="/strains/lists" className="flex items-center gap-1">
            <Leaf className="w-4 h-4" />
            {tr("strains.strains")}
          </Link>
        </Button>
        <span>/</span>
        <span className="font-medium text-foreground">{strain.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Image */}
        <div className="lg:w-1/2">
          <Card className="p-4">
            <div className="relative aspect-video bg-muted/20 rounded-lg overflow-hidden mb-4">
              {strain.images[0] ? (
                <img
                  src={strain.images[0].image_url}
                  alt={strain.images[0].alt_text || strain.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/strains/placeholder.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Leaf className="w-24 h-24 text-white" />
                </div>
              )}

              {/* Strain Type Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`text-white text-lg px-4 py-2 ${strainTypeInfo?.value === 'indica' ? 'bg-purple-500' : strainTypeInfo?.value === 'sativa' ? 'bg-green-500' : 'bg-orange-500'}`}>
                  <span className="mr-2">{strainTypeInfo?.icon}</span>
                  {tr(`strains.${strain.type}`) || strain.type.charAt(0).toUpperCase() + strain.type.slice(1)}
                </Badge>
              </div>

              {/* Featured Badge */}
              {strain.is_featured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    {tr("strains.featured")}
                  </Badge>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {strain.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {strain.images.slice(1).map((image) => (
                  <div key={image.id} className="aspect-square bg-muted/20 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || strain.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/strains/placeholder.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Strain Info */}
        <div className="lg:w-1/2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {strain.name}
              <Button variant="ghost" size="icon">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </h1>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">{strain.rating.toFixed(1)}</span>
                <span className="text-muted">/5</span>
              </div>
              <span className="text-muted">|</span>
              <span className="text-muted">{strain.review_count} {tr("strains.reviews")}</span>
              <span className="text-muted">|</span>
              <span className="text-muted">{tr("strains.popularity")}: {strain.popularity}%</span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-hover-bg rounded-lg">
                <Flame className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <p className="font-semibold">{strain.thc}%</p>
                <p className="text-xs text-muted">{tr("strains.thc")}</p>
              </div>
              <div className="text-center p-3 bg-hover-bg rounded-lg">
                <Heart className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="font-semibold">{strain.cbd}%</p>
                <p className="text-xs text-muted">{tr("strains.cbd")}</p>
              </div>
              <div className="text-center p-3 bg-hover-bg rounded-lg">
                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <p className="font-semibold">{strain.flowering_time_weeks} {tr("strains.weeks")}</p>
                <p className="text-xs text-muted">{tr("strains.floweringTime")}</p>
              </div>
              <div className="text-center p-3 bg-hover-bg rounded-lg">
                <Ruler className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="font-semibold">{strain.height_indoor}</p>
                <p className="text-xs text-muted">{tr("strains.height")}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button asChild className="flex-1 gap-2">
              <Link href={`/strains/${strain.slug || strain.id}/edit`}>
                <Edit className="w-4 h-4" />
                {tr("common.edit")}
              </Link>
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Bookmark className="w-4 h-4" />
              {tr("strains.saveToWishlist")}
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              {tr("common.share")}
            </Button>
          </div>
        </div>
      </div>

      {/* THC/CBD Progress Bars */}
      <Card title={tr("strains.cannabinoidProfile")}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                {tr("strains.thc")}
              </span>
              <span className="font-semibold">{strain.thc}%</span>
            </div>
            <Progress value={thcPercentage} className="h-3" />
            <p className="text-xs text-muted mt-1">
              {tr("strains.thcLevel")}: {getPotencyLevel(strain.thc)}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-green-500" />
                {tr("strains.cbd")}
              </span>
              <span className="font-semibold">{strain.cbd}%</span>
            </div>
            <Progress value={cbdPercentage} className="h-3" />
            <p className="text-xs text-muted mt-1">
              {tr("strains.cbdLevel")}: {getPotencyLevel(strain.cbd)}
            </p>
          </div>

          {strain.thca !== null && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">THCA</span>
                <span className="font-semibold">{strain.thca}%</span>
              </div>
              <Progress value={strain.thca * 3.33} className="h-3" />
            </div>
          )}

          {strain.cbn !== null && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">CBN</span>
                <span className="font-semibold">{strain.cbn}%</span>
              </div>
              <Progress value={strain.cbn * 10} className="h-3" />
            </div>
          )}

          {strain.cbg !== null && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">CBG</span>
                <span className="font-semibold">{strain.cbg}%</span>
              </div>
              <Progress value={strain.cbg * 10} className="h-3" />
            </div>
          )}
        </div>
      </Card>

      {/* Strain Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* About Section */}
        <Card title={tr("strains.about")}>
          <p className="text-muted mb-4">{strain.description}</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{tr("strains.genetics")}</h4>
              <p className="text-muted">{strain.genetics || tr("strains.unknown")}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">{tr("strains.breeder")}</h4>
              <p className="text-muted">{strain.breeder || tr("strains.unknown")}</p>
            </div>

            {strain.awards?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{tr("strains.awards")}</h4>
                <div className="flex flex-wrap gap-2">
                  {strain.awards.map((award, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {award}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Characteristics */}
        <Card title={tr("strains.characteristics")}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{tr("strains.type")}</p>
                <p className="text-muted text-sm">{strainTypeInfo?.label || strain.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{tr("strains.climate")}</p>
                <p className="text-muted text-sm">{climateInfo?.label || strain.climate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{tr("strains.growingDifficulty")}</p>
                <p className="text-muted text-sm">{growingDifficultyInfo?.label || strain.growing_difficulty}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{tr("strains.floweringTime")}</p>
                <p className="text-muted text-sm">{strain.flowering_time_weeks} {tr("strains.weeks")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
                <Weight className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{tr("strains.yield")}</p>
                <p className="text-muted text-sm">{strain.yield_indoor} (Indoor)</p>
                {strain.yield_outdoor && (
                  <p className="text-muted text-sm">{strain.yield_outdoor} (Outdoor)</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{tr("strains.height")}</p>
                <p className="text-muted text-sm">{strain.height_indoor} (Indoor)</p>
                {strain.height_outdoor && (
                  <p className="text-muted text-sm">{strain.height_outdoor} (Outdoor)</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Effects */}
      <Card title={tr("strains.effects")}>
        <div className="flex flex-wrap gap-2">
          {strain.effects.map((effect) => {
            const effectData = EFFECT_CATEGORIES.find(e => e.value === effect);
            return (
              <Badge key={effect} variant="outline" className="px-3 py-1.5">
                <span className="mr-1">{effectData?.icon}</span>
                {tr(`strains.${effect}`) || effect}
              </Badge>
            );
          })}
        </div>
      </Card>

      {/* Flavors */}
      <Card title={tr("strains.flavors")}>
        <div className="flex flex-wrap gap-2">
          {strain.flavors.map((flavor) => {
            const flavorData = FLAVOR_CATEGORIES.find(f => f.value === flavor);
            return (
              <Badge key={flavor} variant="secondary" className="px-3 py-1.5">
                <span className="mr-1">{flavorData?.icon}</span>
                {tr(`strains.${flavor}`) || flavor}
              </Badge>
            );
          })}
        </div>
      </Card>

      {/* Medical Uses */}
      {strain.medical_uses.length > 0 && (
        <Card title={tr("strains.medicalUses")}>
          <div className="flex flex-wrap gap-2">
            {strain.medical_uses.map((use) => {
              const useData = MEDICAL_CATEGORIES.find(m => m.value === use);
              return (
                <Badge key={use} variant="outline" className="px-3 py-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                  <span className="mr-1">{useData?.icon}</span>
                  {tr(`strains.${use}`) || use}
                </Badge>
              );
            })}
          </div>
          <p className="text-sm text-muted mt-4">
            {tr("strains.medicalDisclaimer")}
          </p>
        </Card>
      )}

      {/* Growing Information */}
      <Card title={tr("strains.growingInfo")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">{tr("strains.growingTips")}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>• {tr("strains.maintainTemperature")}: 68-77°F (20-25°C)</li>
              <li>• {tr("strains.humidityLevel")}: 40-70%</li>
              <li>• {tr("strains.phLevel")}: 6.0-7.0</li>
              <li>• {tr("strains.lightSchedule")}: 18/6 (Veg), 12/12 (Flower)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">{tr("strains.nutrientNeeds")}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>• {tr("strains.nitrogen")}: Moderate</li>
              <li>• {tr("strains.phosphorus")}: High (Flowering)</li>
              <li>• {tr("strains.potassium")}: Moderate</li>
              <li>• {tr("strains.calciumMagnesium")}: As needed</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Similar Strains */}
      <Card title={tr("strains.similarStrains")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_STRAINS
            .filter(s => s.id !== strain.id)
            .slice(0, 4)
            .map((similarStrain) => (
              <div key={similarStrain.id} className="group cursor-pointer">
                <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden mb-2">
                  {similarStrain.images[0] ? (
                    <img
                      src={similarStrain.images[0].image_url}
                      alt={similarStrain.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/strains/placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <Leaf className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-sm">{similarStrain.name}</h4>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Badge variant="outline" className="px-1.5 py-0.5 text-[10px]">
                    {getStrainTypeIcon(similarStrain.type)} {similarStrain.type}
                  </Badge>
                  <span>{similarStrain.thc}% THC</span>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Back Button */}
      <div className="text-center pt-6">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/strains/lists">
            <ArrowLeft className="w-4 h-4" />
            {tr("strains.backToList")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Helper function for potency level
function getPotencyLevel(percentage: number | null): string {
  if (percentage === null) return 'Unknown';
  if (percentage >= 25) return 'Very High';
  if (percentage >= 20) return 'High';
  if (percentage >= 15) return 'Medium';
  if (percentage >= 10) return 'Low';
  return 'Very Low';
}
