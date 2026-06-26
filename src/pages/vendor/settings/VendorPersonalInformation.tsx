import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  CheckCircle,
  Camera
} from 'lucide-react';
import { Input, Button, Badge } from '@stackloop/ui';
import BottomNav from '../../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { authApi } from '../../../../lib/api';
import { UserProfile } from '../../../types';
import { BASE_URL, TENANT_ID } from '@/config';

const CACHE_KEY = 'vendor_profile_cache';

export const VendorPersonalInformation: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem(CACHE_KEY);
  });
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as any;
      return {
        fullName: parsed.fullName ?? parsed.username ?? '',
        phoneNo: parsed.phoneNo ?? parsed.phone ?? '',
        email: parsed.email ?? '',
      };
    }
    return {
      fullName: '',
      phoneNo: '',
      email: '',
    };
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        const dataAny = data as any;
        setFormData({
          fullName: dataAny.fullName ?? dataAny.username ?? '',
          phoneNo: dataAny.phoneNo ?? dataAny.phone ?? '',
          email: dataAny.email ?? '',
        });
      } catch (error) {
        console.error('Failed to load profile details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      if (profile) {
        const updatedProfile = {
          ...profile,
          fullName: formData.fullName,
          phoneNo: formData.phoneNo,
          email: formData.email,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedProfile));
      }

      await authApi.updateProfile({
        fullName: formData.fullName,
        phoneNo: formData.phoneNo,
        email: formData.email,
      });

      const freshData = await authApi.getProfile();
      localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));

      navigate('/vendor/profile');
    } catch (error) {
      console.error('Failed to update personal details:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/vendor/profile');
  };

  const avatarId = profile?.avatarUrl ?? profile?.avatar ?? '';
  const avatarUrl = avatarId
    ? (String(avatarId).startsWith('http') || String(avatarId).startsWith('/')
      ? String(avatarId)
      : `${BASE_URL}/resources/download/${avatarId}?tenant-id=${TENANT_ID}`)
    : '';

  const displayName = formData.fullName || profile?.username || 'Vendor Owner';
  const getAvatarInitials = (name: string) => name.trim().slice(0, 2).toUpperCase();
  const initials = getAvatarInitials(displayName);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm font-semibold text-foreground/50 animate-pulse">Loading personal details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Personal Information"
        rightContent={
          <div className="flex items-center gap-2">
           
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold h-8 px-5"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      />

      <div className="px-4 space-y-6">
        {/* --- Profile Photo Section --- */}
        <div className="flex flex-col items-center pt-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-secondary overflow-hidden border-2 border-border flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">{initials}</span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-xs font-semibold text-primary mt-3">Profile Photo</p>
        </div>

        {/* --- Form Fields --- */}
        <div className="space-y-4 bg-white rounded-2xl p-4 border border-border/50 shadow-sm">
          {/* Full Name */}
          <Input
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(value) => setFormData({ ...formData, fullName: String(value) })}
            className="w-full"
            placeholder="Enter your full name"
            leftIcon={<User className="w-4 h-4 text-foreground/40" />}
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phoneNo}
            onChange={(value) => setFormData({ ...formData, phoneNo: String(value) })}
            className="w-full"
            placeholder="Enter phone number"
            leftIcon={<Phone className="w-4 h-4 text-foreground/40" />}
          />

          {/* Email Address */}
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: String(value) })}
            className="w-full"
            placeholder="Enter email address"
            leftIcon={<Mail className="w-4 h-4 text-foreground/40" />}
          />
        </div>

        {/* --- Verification Section --- */}
        <div className="pt-4 border-t border-border/50">
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 ml-1">
            Verification Status
          </h3>
          <div className="space-y-3">
            {/* Phone Verification */}
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Phone</p>
                  <p className="text-[11px] text-foreground/50">{formData.phoneNo || 'Not specified'}</p>
                </div>
              </div>
              <Badge
                variant="success"
                className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full"
              >
                <CheckCircle className="w-3 h-3 mr-1 fill-current" />
                Verified
              </Badge>
            </div>

            {/* Email Verification */}
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <p className="text-[11px] text-foreground/50">{formData.email || 'Not specified'}</p>
                </div>
              </div>
              <Badge
                variant="success"
                className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full"
              >
                <CheckCircle className="w-3 h-3 mr-1 fill-current" />
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default VendorPersonalInformation;
