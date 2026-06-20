import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  FileSpreadsheet,
  Globe,
  Briefcase
} from 'lucide-react';
import { Input, Button, Select } from '@stackloop/ui';
import BottomNav from '../../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { authApi } from '../../../../lib/api';
import { UserProfile } from '../../../types';
import { OrganizationInfo } from '../../../../lib/types';
import { businessTypeOptions } from '../../../lib/vendorOnboarding';

const CACHE_KEY = 'vendor_profile_cache';

export const VendorOrganizationDetails: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem(CACHE_KEY);
  });
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<OrganizationInfo>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const otherInfo = parsed.otherInfo || {};
      const orgInfo = (otherInfo as any).organizationInfo || {};
      return {
        name: orgInfo.name || '',
        businessType: orgInfo.businessType || 'other',
        registrationNo: orgInfo.registrationNo || '',
        taxIDNumber: orgInfo.taxIDNumber || '',
      };
    }
    return {
      name: '',
      businessType: 'other',
      registrationNo: '',
      taxIDNumber: '',
    };
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        const otherInfo = data.otherInfo || {};
        const orgInfo = (otherInfo as any).organizationInfo || {};
        setFormData({
          name: orgInfo.name || '',
          businessType: orgInfo.businessType || 'other',
          registrationNo: orgInfo.registrationNo || '',
          taxIDNumber: orgInfo.taxIDNumber || '',
        });
      } catch (error) {
        console.error('Failed to load organization details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      const otherInfo = profile.otherInfo || {};
      const updatedOtherInfo = {
        ...otherInfo as Record<string, any>,
        organizationInfo: formData,
      };

      const updatedProfile = {
        ...profile,
        otherInfo: updatedOtherInfo,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(updatedProfile));

      await authApi.updateProfile({
        otherInfo: updatedOtherInfo,
      });

      const freshData = await authApi.getProfile();
      localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));

      navigate('/vendor/profile');
    } catch (error) {
      console.error('Failed to update organization details:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/vendor/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm font-semibold text-foreground/50 animate-pulse">Loading organization details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Organization Details"
        rightContent={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-foreground/60 border-border hover:bg-secondary text-xs font-semibold h-8 px-4"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
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
        {/* --- Form Fields --- */}
        <div className="space-y-4 bg-white rounded-2xl p-4 border border-border/50 shadow-sm">
          {/* Company/Organization Name */}
          <Input
            label="Company Name"
            type="text"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: String(value) })}
            className="w-full"
            placeholder="Enter company name"
            leftIcon={<Building2 className="w-4 h-4 text-foreground/40" />}
          />

          {/* Registration Number */}
          <Input
            label="Registration Number"
            type="text"
            value={formData.registrationNo}
            onChange={(value) => {
              const sanitized = String(value).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
              setFormData({ ...formData, registrationNo: sanitized });
            }}
            className="w-full"
            placeholder="Enter company registration number"
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-foreground/40" />}
          />

          {/* Tax ID Number (KRA PIN) */}
          <Input
            label="Tax ID Number / KRA PIN"
            type="text"
            value={formData.taxIDNumber}
            onChange={(value) => {
              const sanitized = String(value).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
              setFormData({ ...formData, taxIDNumber: sanitized });
            }}
            className="w-full"
            placeholder="Enter tax/KRA PIN"
            leftIcon={<Globe className="w-4 h-4 text-foreground/40" />}
          />

          {/* Business Type */}
          <div>
            <label className="text-xs font-semibold text-foreground/60 mb-2 block">
              Business Type
            </label>
            <Select
              options={businessTypeOptions}
              value={formData.businessType}
              onChange={(value) => setFormData({ ...formData, businessType: String(value) as any })}
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default VendorOrganizationDetails;
