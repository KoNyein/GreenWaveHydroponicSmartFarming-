"use client";

import { useState } from "react";
import { useAuthStore, useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { formatDateTime } from "@/lib/utils";
import { t } from "@/lib/translations";
import {
  UserCircle,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";

export default function UserProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile logic
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      avatar_url: user?.avatar_url || '',
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Password change logic
    console.log('Password changed');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tr("userProfile.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("userProfile.subtitle")}</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="w-4 h-4" />
            {tr("userProfile.editProfile")}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="w-4 h-4" />
              {tr("common.cancel")}
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Save className="w-4 h-4" />
              {tr("common.save")}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                <UserCircle className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                {tr("userProfile.uploadAvatar")}
              </Button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  {tr("userProfile.fullName")}
                </Label>
                {isEditing ? (
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2">{user?.full_name || '-'}</p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {tr("userProfile.email")}
                </Label>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2">{user?.email || '-'}</p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {tr("userProfile.phone")}
                </Label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2">{user?.phone || '-'}</p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {tr("userProfile.joinedDate")}
                </Label>
                <p className="mt-2">{user?.created_at ? formatDateTime(user.created_at) : '-'}</p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="pt-2">
              <Label>{tr("userProfile.role")}</Label>
              <div className="mt-2">
                <span className="px-3 py-1 bg-muted rounded-full text-sm">
                  {tr(`roles.${user?.role || 'member'}`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Password Change */}
      <Card title={tr("userProfile.changePassword")} subtitle={tr("userProfile.changePasswordSubtitle")}>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="currentPassword">{tr("userProfile.currentPassword")}</Label>
            <div className="relative mt-2">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword">{tr("userProfile.newPassword")}</Label>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">{tr("userProfile.confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" />
            {tr("userProfile.updatePassword")}
          </Button>
        </form>
      </Card>

      {/* Account Settings */}
      <Card title={tr("userProfile.accountSettings")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <h3 className="font-medium">{tr("userProfile.notifications")}</h3>
              <p className="text-sm text-muted">{tr("userProfile.notificationsDesc")}</p>
            </div>
            <Button variant="outline" size="sm">
              {tr("userProfile.manage")}
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <h3 className="font-medium">{tr("userProfile.privacy")}</h3>
              <p className="text-sm text-muted">{tr("userProfile.privacyDesc")}</p>
            </div>
            <Button variant="outline" size="sm">
              {tr("userProfile.manage")}
            </Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-red-500">{tr("userProfile.deleteAccount")}</h3>
              <p className="text-sm text-muted">{tr("userProfile.deleteAccountDesc")}</p>
            </div>
            <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-500/10">
              {tr("userProfile.delete")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
