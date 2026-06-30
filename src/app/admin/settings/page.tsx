"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { t } from "@/lib/translations";
import {
  Settings,
  ShieldCheck,
  Bell,
  Mail,
  Globe,
  CreditCard,
  Truck,
  Percent,
  Save,
  X,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  
  const [formData, setFormData] = useState({
    siteName: 'GreenWave Hydroponic',
    siteDescription: 'Complete hydroponic cannabis smart farming management system',
    defaultCurrency: 'USD',
    commissionRate: 5,
    taxRate: 8.5,
    shippingMethod: 'standard',
    maintenanceMode: false,
    registrationOpen: true,
    emailVerification: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({ ...prev, [name]: checked ?? value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const settingsSections = [
    {
      title: tr("adminSettings.general"),
      icon: Settings,
      fields: [
        {
          label: tr("adminSettings.siteName"),
          type: 'text',
          name: 'siteName',
          placeholder: tr("adminSettings.siteNamePlaceholder"),
        },
        {
          label: tr("adminSettings.siteDescription"),
          type: 'text',
          name: 'siteDescription',
          placeholder: tr("adminSettings.siteDescriptionPlaceholder"),
        },
        {
          label: tr("adminSettings.defaultCurrency"),
          type: 'select',
          name: 'defaultCurrency',
          options: ['USD', 'EUR', 'GBP', 'MMK'],
        },
      ],
    },
    {
      title: tr("adminSettings.financial"),
      icon: CreditCard,
      fields: [
        {
          label: tr("adminSettings.commissionRate"),
          type: 'number',
          name: 'commissionRate',
          suffix: '%',
          placeholder: '5',
        },
        {
          label: tr("adminSettings.taxRate"),
          type: 'number',
          name: 'taxRate',
          suffix: '%',
          placeholder: '8.5',
        },
      ],
    },
    {
      title: tr("adminSettings.shipping"),
      icon: Truck,
      fields: [
        {
          label: tr("adminSettings.defaultShipping"),
          type: 'select',
          name: 'shippingMethod',
          options: ['standard', 'express', 'free'],
        },
      ],
    },
    {
      title: tr("adminSettings.notifications"),
      icon: Bell,
      fields: [
        {
          label: tr("adminSettings.emailNotifications"),
          type: 'switch',
          name: 'emailNotifications',
          description: tr("adminSettings.emailNotificationsDesc"),
        },
        {
          label: tr("adminSettings.pushNotifications"),
          type: 'switch',
          name: 'pushNotifications',
          description: tr("adminSettings.pushNotificationsDesc"),
        },
      ],
    },
    {
      title: tr("adminSettings.security"),
      icon: ShieldCheck,
      fields: [
        {
          label: tr("adminSettings.maintenanceMode"),
          type: 'switch',
          name: 'maintenanceMode',
          description: tr("adminSettings.maintenanceModeDesc"),
        },
        {
          label: tr("adminSettings.registrationOpen"),
          type: 'switch',
          name: 'registrationOpen',
          description: tr("adminSettings.registrationOpenDesc"),
        },
        {
          label: tr("adminSettings.emailVerification"),
          type: 'switch',
          name: 'emailVerification',
          description: tr("adminSettings.emailVerificationDesc"),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tr("adminSettings.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("adminSettings.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setFormData({
            siteName: 'GreenWave Hydroponic',
            siteDescription: 'Complete hydroponic cannabis smart farming management system',
            defaultCurrency: 'USD',
            commissionRate: 5,
            taxRate: 8.5,
            shippingMethod: 'standard',
            maintenanceMode: false,
            registrationOpen: true,
            emailVerification: true,
          })}>
            {tr("common.cancel")}
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {tr("common.save")}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {settingsSections.map((section) => (
          <Card key={section.title} title={section.title} icon={section.icon}>
            <div className="space-y-4">
              {section.fields.map((field) => {
                switch (field.type) {
                  case 'text':
                  case 'number':
                    return (
                      <div key={field.name}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <div className="relative mt-2">
                          <Input
                            id={field.name}
                            type={field.type}
                            name={field.name}
                            value={formData[field.name as keyof typeof formData] as string}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                          />
                          {field.suffix && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">
                              {field.suffix}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  case 'select':
                    return (
                      <div key={field.name}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Select
                          value={formData[field.name as keyof typeof formData] as string}
                          onValueChange={(value) => handleSelectChange(field.name, value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder={tr("common.select")} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  case 'switch':
                    return (
                      <div key={field.name} className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={field.name}>{field.label}</Label>
                          {field.description && (
                            <p className="text-sm text-muted mt-1">{field.description}</p>
                          )}
                        </div>
                        <Switch
                          id={field.name}
                          checked={formData[field.name as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => handleSwitchChange(field.name, checked)}
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </Card>
        ))}

        {/* Additional Settings Links */}
        <Card title={tr("adminSettings.additionalSettings")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="justify-start gap-3">
              <Link href="/admin/settings/security">
                <ShieldCheck className="w-4 h-4" />
                {tr("nav.securitySettings")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-3">
              <Link href="/admin/settings/payments">
                <CreditCard className="w-4 h-4" />
                {tr("nav.paymentSettings")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-3">
              <Link href="/admin/settings/shipping">
                <Truck className="w-4 h-4" />
                {tr("nav.shippingSettings")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-3">
              <Link href="/admin/settings/taxes">
                <Percent className="w-4 h-4" />
                {tr("nav.taxSettings")}
              </Link>
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
