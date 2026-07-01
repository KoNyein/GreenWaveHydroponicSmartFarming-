"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Slider } from "@/components/ui/Slider";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/translations";
import {
  Leaf,
  Save,
  X,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import {
  Strain,
  StrainType,
  EffectType,
  FlavorType,
  MedicalUseType,
  STRAIN_TYPES,
  EFFECT_CATEGORIES,
  FLAVOR_CATEGORIES,
  MEDICAL_CATEGORIES,
  GROWING_DIFFICULTY,
  CLIMATE_OPTIONS,
} from "@/types/strains";

export default function NewStrainPage() {
  const router = useRouter();
  const { locale } = useSettingsStore();
  const tr = (key: string, params?: Record<string, string | number>) => t(key, locale, params);

  // Form state
  const [formData, setFormData] = useState<Partial<Strain>>({
    name: '',
    slug: '',
    type: 'hybrid',
    description: '',
    thc: null,
    cbd: null,
    thca: null,
    cbn: null,
    cbg: null,
    effects: [],
    flavors: [],
    medical_uses: [],
    growing_difficulty: 'moderate',
    flowering_time_weeks: 8,
    yield_indoor: '',
    yield_outdoor: '',
    height_indoor: '',
    height_outdoor: '',
    climate: 'both',
    genetics: '',
    breeder: '',
    awards: [],
    is_featured: false,
    is_active: true,
  });

  const [newAward, setNewAward] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle multi-select changes (effects, flavors, medical uses)
  const handleMultiSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentValues = (prev[name] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value === '' ? null : parseFloat(value) }));
  };

  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }));
  };

  // Handle award changes
  const handleAwardChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newAward.trim()) {
      setFormData(prev => ({
        ...prev,
        awards: [...(prev.awards || []), newAward.trim()]
      }));
      setNewAward('');
    }
  };

  // Remove award
  const removeAward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      awards: (prev.awards || []).filter((_, i) => i !== index)
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files].slice(0, 5)); // Limit to 5 images
      
      // Create previews
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews].slice(0, 5));
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = tr("strains.nameRequired");
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = tr("strains.descriptionRequired");
    }
    
    if (formData.effects?.length === 0) {
      newErrors.effects = tr("strains.effectsRequired");
    }
    
    if (formData.flavors?.length === 0) {
      newErrors.flavors = tr("strains.flavorsRequired");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In production, this would be an API call to your backend
      console.log('Creating new strain:', {
        ...formData,
        images: images.length
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to strain list on success
      router.push('/strains/lists');
    } catch (error) {
      console.error('Error creating strain:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/strains/lists');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plus className="w-6 h-6 text-green-500" />
            {tr("strains.addNewStrain")}
          </h1>
          <p className="text-muted text-sm mt-1">{tr("strains.addNewStrainDesc")}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/strains/lists">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tr("common.back")}
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card title={tr("strains.basicInformation")}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{tr("strains.name")} *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder={tr("strains.namePlaceholder")}
                  className="mt-2"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="slug">{tr("strains.slug")}</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleInputChange}
                  placeholder={tr("strains.slugPlaceholder")}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">{tr("strains.description")} *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder={tr("strains.descriptionPlaceholder")}
                rows={4}
                className="mt-2"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">{tr("strains.strainType")} *</Label>
                <Select
                  value={formData.type || ''}
                  onValueChange={(value) => handleSelectChange('type', value as StrainType)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={tr("strains.selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {STRAIN_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{tr(`strains.${type.value}`) || type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="breeder">{tr("strains.breeder")}</Label>
                <Input
                  id="breeder"
                  name="breeder"
                  value={formData.breeder || ''}
                  onChange={handleInputChange}
                  placeholder={tr("strains.breederPlaceholder")}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="genetics">{tr("strains.genetics")}</Label>
              <Input
                id="genetics"
                name="genetics"
                value={formData.genetics || ''}
                onChange={handleInputChange}
                placeholder={tr("strains.geneticsPlaceholder")}
                className="mt-2"
              />
            </div>
          </div>
        </Card>

        {/* Cannabinoid Profile */}
        <Card title={tr("strains.cannabinoidProfile")}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="thc">THC (%)</Label>
                  <span className="text-sm text-muted">{formData.thc || 0}%</span>
                </div>
                <Slider
                  value={[formData.thc || 0]}
                  onValueChange={(value) => handleSliderChange('thc', value)}
                  min={0}
                  max={30}
                  step={0.1}
                />
                <Input
                  type="number"
                  min={0}
                  max={30}
                  step={0.1}
                  value={formData.thc || ''}
                  onChange={(e) => handleNumberChange('thc', e.target.value)}
                  className="mt-2 text-center"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="cbd">CBD (%)</Label>
                  <span className="text-sm text-muted">{formData.cbd || 0}%</span>
                </div>
                <Slider
                  value={[formData.cbd || 0]}
                  onValueChange={(value) => handleSliderChange('cbd', value)}
                  min={0}
                  max={20}
                  step={0.1}
                />
                <Input
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  value={formData.cbd || ''}
                  onChange={(e) => handleNumberChange('cbd', e.target.value)}
                  className="mt-2 text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="thca">THCA (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={30}
                  step={0.1}
                  value={formData.thca || ''}
                  onChange={(e) => handleNumberChange('thca', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="cbn">CBN (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  step={0.01}
                  value={formData.cbn || ''}
                  onChange={(e) => handleNumberChange('cbn', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="cbg">CBG (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  step={0.01}
                  value={formData.cbg || ''}
                  onChange={(e) => handleNumberChange('cbg', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Effects */}
        <Card title={tr("strains.effects")}>
          <p className="text-sm text-muted mb-4">{tr("strains.selectEffectsDesc")}</p>
          {errors.effects && <p className="text-red-500 text-sm mb-4">{errors.effects}</p>}
          <div className="flex flex-wrap gap-2">
            {EFFECT_CATEGORIES.map((effect) => (
              <Button
                key={effect.value}
                type="button"
                variant={(formData.effects || []).includes(effect.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMultiSelectChange('effects', effect.value)}
                className="gap-2"
              >
                <span>{effect.icon}</span>
                <span>{tr(`strains.${effect.value}`) || effect.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Flavors */}
        <Card title={tr("strains.flavors")}>
          <p className="text-sm text-muted mb-4">{tr("strains.selectFlavorsDesc")}</p>
          {errors.flavors && <p className="text-red-500 text-sm mb-4">{errors.flavors}</p>}
          <div className="flex flex-wrap gap-2">
            {FLAVOR_CATEGORIES.map((flavor) => (
              <Button
                key={flavor.value}
                type="button"
                variant={(formData.flavors || []).includes(flavor.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMultiSelectChange('flavors', flavor.value)}
                className="gap-2"
              >
                <span>{flavor.icon}</span>
                <span>{tr(`strains.${flavor.value}`) || flavor.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Medical Uses */}
        <Card title={tr("strains.medicalUses")}>
          <p className="text-sm text-muted mb-4">{tr("strains.selectMedicalUsesDesc")}</p>
          <div className="flex flex-wrap gap-2">
            {MEDICAL_CATEGORIES.map((use) => (
              <Button
                key={use.value}
                type="button"
                variant={(formData.medical_uses || []).includes(use.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMultiSelectChange('medical_uses', use.value)}
                className="gap-2"
              >
                <span>{use.icon}</span>
                <span>{tr(`strains.${use.value}`) || use.label}</span>
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">{tr("strains.medicalDisclaimer")}</p>
        </Card>

        {/* Growing Information */}
        <Card title={tr("strains.growingInformation")}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="growing_difficulty">{tr("strains.growingDifficulty")}</Label>
                <Select
                  value={formData.growing_difficulty || ''}
                  onValueChange={(value) => handleSelectChange('growing_difficulty', value as 'easy' | 'moderate' | 'difficult')}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={tr("strains.selectDifficulty")} />
                  </SelectTrigger>
                  <SelectContent>
                    {GROWING_DIFFICULTY.map((difficulty) => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        <div className="flex items-center gap-2">
                          <span>{difficulty.icon}</span>
                          <span>{tr(`strains.${difficulty.value}`) || difficulty.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="climate">{tr("strains.climate")}</Label>
                <Select
                  value={formData.climate || ''}
                  onValueChange={(value) => handleSelectChange('climate', value as 'indoor' | 'outdoor' | 'greenhouse' | 'both')}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={tr("strains.selectClimate")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIMATE_OPTIONS.map((climate) => (
                      <SelectItem key={climate.value} value={climate.value}>
                        <div className="flex items-center gap-2">
                          <span>{climate.icon}</span>
                          <span>{tr(`strains.${climate.value}`) || climate.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="flowering_time_weeks">{tr("strains.floweringTime")} (weeks)</Label>
                <Input
                  type="number"
                  id="flowering_time_weeks"
                  name="flowering_time_weeks"
                  value={formData.flowering_time_weeks || ''}
                  onChange={handleInputChange}
                  min={4}
                  max={16}
                  placeholder="8"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="yield_indoor">{tr("strains.yieldIndoor")}</Label>
                <Input
                  type="text"
                  id="yield_indoor"
                  name="yield_indoor"
                  value={formData.yield_indoor || ''}
                  onChange={handleInputChange}
                  placeholder="1-2 oz/ft²"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yield_outdoor">{tr("strains.yieldOutdoor")}</Label>
                <Input
                  type="text"
                  id="yield_outdoor"
                  name="yield_outdoor"
                  value={formData.yield_outdoor || ''}
                  onChange={handleInputChange}
                  placeholder="10-15 oz/plant"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="height_indoor">{tr("strains.heightIndoor")}</Label>
                <Input
                  type="text"
                  id="height_indoor"
                  name="height_indoor"
                  value={formData.height_indoor || ''}
                  onChange={handleInputChange}
                  placeholder="30-60 in"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="height_outdoor">{tr("strains.heightOutdoor")}</Label>
              <Input
                type="text"
                id="height_outdoor"
                name="height_outdoor"
                value={formData.height_outdoor || ''}
                onChange={handleInputChange}
                placeholder="60-80 in"
                className="mt-2"
              />
            </div>
          </div>
        </Card>

        {/* Awards */}
        <Card title={tr("strains.awards")}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newAward}
                onChange={(e) => setNewAward(e.target.value)}
                onKeyDown={handleAwardChange}
                placeholder={tr("strains.addAwardPlaceholder")}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newAward.trim()) {
                    setFormData(prev => ({
                      ...prev,
                      awards: [...(prev.awards || []), newAward.trim()]
                    }));
                    setNewAward('');
                  }
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {tr("common.add")}
              </Button>
            </div>

            {formData.awards?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.awards.map((award, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5">
                    {award}
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Images */}
        <Card title={tr("strains.images")}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
                className="gap-2 flex-1"
              >
                <ImageIcon className="w-4 h-4" />
                {tr("strains.uploadImages")}
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square bg-muted/20 rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {tr("strains.primary")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-muted">
              {tr("strains.imageLimit", { count: 5 - images.length })}
            </p>
          </div>
        </Card>

        {/* Settings */}
        <Card title={tr("strains.settings")}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                {tr("strains.featuredStrain")}
              </Label>
            </div>

            <div className="flex items-center gap-4">
              <Checkbox
                id="is_active"
                checked={formData.is_active || true}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                {tr("strains.activeStrain")}
              </Label>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? tr("common.saving") : tr("common.save")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="gap-2 min-w-[120px]"
          >
            <X className="w-4 h-4" />
            {tr("common.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
