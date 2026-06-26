import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input, Button } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { authApi } from '../../../lib/api';

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ confirm?: string }>({});

  const validateConfirm = (newPass: string, confirm: string) => {
    if (!confirm) {
      setErrors((s) => ({ ...s, confirm: undefined }));
      return;
    }

    if (newPass !== confirm) {
      setErrors((s) => ({ ...s, confirm: 'Passwords do not match' }));
    } else {
      setErrors((s) => ({ ...s, confirm: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // final validation
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors((s) => ({ ...s, confirm: 'Passwords do not match' }));
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      await authApi.changeLoggedInPassword(payload as any);
    } catch (error) {
      console.error('Failed to update password', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Change Password"
        breadcrumbs={[{ label: 'Privacy & Security' }, { label: 'Change Password', emphasized: true }]}
      />

      <form onSubmit={handleSubmit} className="px-4 pt-4 space-y-6">
        {/* Current Password */}
        <Input
          type="password"
          label="Current Password"
          value={formData.currentPassword}
          onChange={(val) => setFormData({ ...formData, currentPassword: String(val) })}
          placeholder="Enter current password"
          className="w-full"
        />

        {/* New Password */}
        <div>
          <Input
            type="password"
            label="New Password"
            value={formData.newPassword}
            onChange={(val) => {
              const newVal = String(val);
              setFormData({ ...formData, newPassword: newVal });
              validateConfirm(newVal, formData.confirmPassword);
            }}
            placeholder="Enter new password"
            className="w-full"
          />
          <p className="text-xs text-foreground/50 mt-2 ml-1 leading-relaxed">
            Password must be at least 8 characters with letters and numbers.
          </p>
        </div>

        {/* Confirm New Password */}
        <Input
          type="password"
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={(val) => {
            const newVal = String(val);
            setFormData({ ...formData, confirmPassword: newVal });
            validateConfirm(formData.newPassword, newVal);
          }}
          placeholder="Confirm new password"
          className="w-full"
        />
        {errors.confirm && (
          <p className="text-xs text-red-500 mt-2 ml-1">{errors.confirm}</p>
        )}

        {/* Submit Button */}
        <div className="pt-4 pb-6">
          <Button
            type="submit"
            loading={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 text-sm shadow-sm"
          >
            Update Password
          </Button>
        </div>
      </form>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};