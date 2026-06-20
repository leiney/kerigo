import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bike,
  FileText,
  Palette,
  Briefcase
} from 'lucide-react';
import { Input, Button, Select } from '@stackloop/ui';
import BottomNav from '../../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { authApi } from '../../../../lib/api';
import { UserProfile } from '../../../types';

const CACHE_KEY = 'rider_profile_cache';

export const RiderVehicleDetails: React.FC = () => {
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
    const parsed = cached ? JSON.parse(cached) : null;
    const otherInfo = parsed?.otherInfo || {};
    const vehicle = (otherInfo as any).vehicleInfo || {};
    return {
      vehicleType: vehicle.vehicleType || 'motorbike',
      registrationNo: vehicle.registrationNo || '',
      make: vehicle.make || '',
      model: vehicle.model || '',
      regYear: vehicle.regYear ? String(vehicle.regYear) : '',
      color: vehicle.color || '',
    };
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        const otherInfo = data.otherInfo || {};
        const vehicle = (otherInfo as any).vehicleInfo || {};
        setFormData({
          vehicleType: vehicle.vehicleType || 'motorbike',
          registrationNo: vehicle.registrationNo || '',
          make: vehicle.make || '',
          model: vehicle.model || '',
          regYear: vehicle.regYear ? String(vehicle.regYear) : '',
          color: vehicle.color || '',
        });
      } catch (error) {
        console.error('Failed to load vehicle details:', error);
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
        vehicleInfo: {
          ...formData,
          regYear: formData.regYear ? Number(formData.regYear) : new Date().getFullYear(),
        },
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

      navigate('/rider/profile');
    } catch (error) {
      console.error('Failed to update vehicle details:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/rider/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm font-semibold text-foreground/50 animate-pulse">Loading vehicle details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Vehicle Details"
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
          {/* Vehicle Type */}
          <div>
            <label className="text-xs font-semibold text-foreground/60 mb-2 block">
              Vehicle Type
            </label>
            <Select
              options={[
                { value: 'motorbike', label: 'Motorbike' },
                { value: 'tricycle', label: 'Tricycle' },
                { value: 'bicycle', label: 'Bicycle' },
                { value: 'van', label: 'Van' }
              ]}
              value={formData.vehicleType}
              onChange={(value) => setFormData({ ...formData, vehicleType: String(value) })}
            />
          </div>

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
            placeholder="e.g. KDL 123A"
            leftIcon={<FileText className="w-4 h-4 text-foreground/40" />}
          />

          {/* Make */}
          <Input
            label="Make"
            type="text"
            value={formData.make}
            onChange={(value) => setFormData({ ...formData, make: String(value) })}
            className="w-full"
            placeholder="e.g. Honda, TVS"
            leftIcon={<Briefcase className="w-4 h-4 text-foreground/40" />}
          />

          {/* Model */}
          <Input
            label="Model"
            type="text"
            value={formData.model}
            onChange={(value) => setFormData({ ...formData, model: String(value) })}
            className="w-full"
            placeholder="e.g. Boxer, CG 125"
            leftIcon={<Briefcase className="w-4 h-4 text-foreground/40" />}
          />

          {/* Registration Year & Color */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Registration Year"
              type="number"
              value={formData.regYear}
              onChange={(value) => setFormData({ ...formData, regYear: String(value) })}
              className="w-full"
              placeholder="e.g. 2023"
            />

            <Input
              label="Color"
              type="text"
              value={formData.color}
              onChange={(value) => setFormData({ ...formData, color: String(value) })}
              className="w-full"
              placeholder="e.g. Black"
              leftIcon={<Palette className="w-4 h-4 text-foreground/40" />}
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default RiderVehicleDetails;
