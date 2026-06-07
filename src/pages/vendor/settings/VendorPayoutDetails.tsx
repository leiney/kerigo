import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  Phone,
  Building,
  Info,
  CreditCard,
  Hash,
  Globe
} from 'lucide-react';
import { Input, Button, Select } from '@stackloop/ui';
import BottomNav from '../../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { authApi } from '../../../../lib/api';
import { UserProfile } from '../../../types';
import { PayoutInfo, PayoutMode } from '../../../../lib/types';

const CACHE_KEY = 'vendor_profile_cache';

export const VendorPayoutDetails: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem(CACHE_KEY);
  });
  const [saving, setSaving] = useState(false);
  const [payoutMode, setPayoutMode] = useState<PayoutMode>('mpesa');

  const [mpesaPhone, setMpesaPhone] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bank: '',
    branch: '',
    accountNumber: '',
    swiftCode: '',
    accountName: '',
  });

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const payout = parsed.payoutInfo || {};
      const mode = payout.mode || 'mpesa';
      setPayoutMode(mode);
      if (mode === 'mpesa') {
        setMpesaPhone((payout.details as any)?.phoneNo || (payout.details as any)?.phone || '');
      } else if (mode === 'bank') {
        const details = payout.details as any || {};
        setBankDetails({
          bank: details.bank || '',
          branch: details.branch || '',
          accountNumber: details.accountNumber || '',
          swiftCode: details.swiftCode || '',
          accountName: details.accountName || '',
        });
      }
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        const payout = ((data as any).payoutInfo || {}) as any;
        const mode = payout.mode || 'mpesa';
        setPayoutMode(mode);

        if (mode === 'mpesa') {
          setMpesaPhone((payout.details as any)?.phoneNo || (payout.details as any)?.phone || '');
        } else if (mode === 'bank') {
          const details = payout.details as any || {};
          setBankDetails({
            bank: details.bank || '',
            branch: details.branch || '',
            accountNumber: details.accountNumber || '',
            swiftCode: details.swiftCode || '',
            accountName: details.accountName || '',
          });
        }
      } catch (error) {
        console.error('Failed to load payout details:', error);
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
      const updatedPayoutInfo: PayoutInfo = {
        mode: payoutMode,
        details: payoutMode === 'mpesa'
          ? { phoneNo: mpesaPhone }
          : { ...bankDetails },
      };

      const updatedProfile = {
        ...profile,
        payoutInfo: updatedPayoutInfo,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(updatedProfile));

      await authApi.updateProfile({
        payoutInfo: updatedPayoutInfo,
      });

      const freshData = await authApi.getProfile();
      localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));

      navigate('/vendor/profile');
    } catch (error) {
      console.error('Failed to update payout details:', error);
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
        <p className="text-sm font-semibold text-foreground/50 animate-pulse">Loading payout details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Payout Instructions"
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
        {/* --- Payout Mode Select --- */}
        <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground/60 mb-2 block">
              Preferred Payout Mode
            </label>
            <Select
              options={[
                { value: 'mpesa', label: 'M-Pesa Mobile Wallet' },
                { value: 'bank', label: 'Bank Account Deposit' }
              ]}
              value={payoutMode}
              onChange={(value) => setPayoutMode(value as PayoutMode)}
            />
          </div>
        </div>

        {/* --- Dynamic Payout Details Form --- */}
        <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm space-y-4">
          {payoutMode === 'mpesa' ? (
            <div className="space-y-4">
              <Input
                label="M-Pesa Registered Phone Number"
                type="tel"
                value={mpesaPhone}
                onChange={(value) => setMpesaPhone(String(value))}
                className="w-full"
                placeholder="Enter M-Pesa phone number"
                leftIcon={<Phone className="w-4 h-4 text-foreground/40" />}
              />

              <div className="flex items-start gap-2 bg-primary/5 p-3 rounded-xl border border-primary/10">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] text-foreground/60 leading-relaxed">
                  Payouts will be sent directly to this M-Pesa number. Please ensure the number is registered and active.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bank Name */}
              <Input
                label="Bank Name"
                type="text"
                value={bankDetails.bank}
                onChange={(value) => setBankDetails({ ...bankDetails, bank: String(value) })}
                className="w-full"
                placeholder="e.g. Equity Bank"
                leftIcon={<Building className="w-4 h-4 text-foreground/40" />}
              />

              {/* Branch */}
              <Input
                label="Bank Branch"
                type="text"
                value={bankDetails.branch}
                onChange={(value) => setBankDetails({ ...bankDetails, branch: String(value) })}
                className="w-full"
                placeholder="e.g. Westlands"
                leftIcon={<Building className="w-4 h-4 text-foreground/40" />}
              />

              {/* Account Number */}
              <Input
                label="Account Number"
                type="text"
                value={bankDetails.accountNumber}
                onChange={(value) => setBankDetails({ ...bankDetails, accountNumber: String(value) })}
                className="w-full"
                placeholder="Enter account number"
                leftIcon={<Hash className="w-4 h-4 text-foreground/40" />}
              />

              {/* Account Name */}
              <Input
                label="Account Holder Name"
                type="text"
                value={bankDetails.accountName}
                onChange={(value) => setBankDetails({ ...bankDetails, accountName: String(value) })}
                className="w-full"
                placeholder="Enter account holder name"
                leftIcon={<CreditCard className="w-4 h-4 text-foreground/40" />}
              />

              {/* SWIFT / BIC Code */}
              <Input
                label="SWIFT / BIC Code (Optional)"
                type="text"
                value={bankDetails.swiftCode}
                onChange={(value) => setBankDetails({ ...bankDetails, swiftCode: String(value) })}
                className="w-full"
                placeholder="Enter SWIFT code"
                leftIcon={<Globe className="w-4 h-4 text-foreground/40" />}
              />
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default VendorPayoutDetails;
