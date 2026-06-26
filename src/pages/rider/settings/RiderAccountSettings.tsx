import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bike,
  FileText,
  Wallet,
  Shield,
  LogOut,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import BottomNav from '../../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { useAuth } from '../../../context/AuthContext';
import { authApi } from '../../../../lib/api';
import { UserProfile } from '../../../types';
import { BASE_URL, TENANT_ID } from '@/config';

const CACHE_KEY = 'rider_profile_cache';

export const RiderAccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem(CACHE_KEY);
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to load rider profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const profileAny = profile as any;
  const displayName = profileAny?.fullName ?? profileAny?.username ?? 'Rider Partner';
  const phoneNumber = profileAny?.phoneNo ?? profileAny?.phone ?? '';

  const avatarId = profileAny?.avatarUrl ?? profileAny?.avatar ?? '';
  const avatarUrl = avatarId
    ? (String(avatarId).startsWith('http') || String(avatarId).startsWith('/')
      ? String(avatarId)
      : `${BASE_URL}/resources/download/${avatarId}?tenant-id=${TENANT_ID}`)
    : '';

  const getAvatarInitials = (name: string) => name.trim().slice(0, 2).toUpperCase();
  const initials = getAvatarInitials(displayName);

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    onClick,
    isDestructive = false,
  }: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    onClick?: () => void;
    isDestructive?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 transition-colors ${
        isDestructive ? 'hover:bg-error/5' : 'hover:bg-secondary/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isDestructive ? 'bg-error/10' : 'bg-secondary'
          }`}
        >
          <Icon className={`w-5 h-5 ${isDestructive ? 'text-error' : 'text-foreground/60'}`} />
        </div>
        <div className="text-left">
          <p className={`text-sm font-semibold ${isDestructive ? 'text-error' : 'text-foreground'}`}>
            {title}
          </p>
          <p className="text-xs text-foreground/50 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-foreground/30" />
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24 animate-pulse">
        {/* CustomSettingsHeader Skeleton */}
        <div className="px-4 pt-6 pb-5 bg-white border-b border-border/50">
          <div className="h-6 w-36 bg-secondary rounded-lg mb-2" />
          <div className="h-4 w-64 bg-secondary rounded-lg" />
        </div>

        <div className="px-4 mt-5 space-y-5">
          {/* Profile Card Skeleton */}
          <div className="w-full bg-white rounded-2xl p-4 border border-border/50 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-secondary rounded-lg" />
              <div className="h-3.5 w-40 bg-secondary rounded-lg" />
              <div className="h-5 w-24 bg-secondary rounded-full" />
            </div>
            <div className="w-5 h-5 bg-secondary rounded-full" />
          </div>

          {/* Section 1 Skeleton */}
          <div>
            <div className="h-3.5 w-28 bg-secondary rounded mb-3 ml-1" />
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-secondary rounded-lg" />
                      <div className="h-3 w-48 bg-secondary rounded-lg" />
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-secondary rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 Skeleton */}
          <div>
            <div className="h-3.5 w-28 bg-secondary rounded mb-3 ml-1" />
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
              {[1].map((i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-secondary rounded-lg" />
                      <div className="h-3 w-48 bg-secondary rounded-lg" />
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-secondary rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Rider Settings"
        subtitle="Manage your rider profile, vehicle, payout and preferences"
      />

      <div className="px-4 space-y-5">
        {/* --- Profile Card --- */}
        <div className="w-full bg-white rounded-2xl p-4 border border-border/50 shadow-sm flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden shrink-0 border border-border/50">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-sm font-bold">
                {initials}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-foreground">{displayName}</h2>
            <p className="text-sm text-foreground/60 mt-0.5">{phoneNumber || profileAny?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
              <CheckCircle className="w-3 h-3 fill-current" /> Verified Rider
            </span>
          </div>
        </div>

        {/* --- Profile Options --- */}
        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 ml-1">
            Account Details
          </h3>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
            <MenuItem
              icon={User}
              title="Personal Information"
              subtitle="View and edit your personal details"
              onClick={() => navigate('/rider/settings/personal')}
            />
            <MenuItem
              icon={Bike}
              title="Vehicle Details"
              subtitle="Manage vehicle plate, type and model"
              onClick={() => navigate('/rider/settings/vehicle')}
            />
            <MenuItem
              icon={FileText}
              title="KYC & Documents"
              subtitle="View driving permit and compliance certificates"
              onClick={() => navigate('/rider/settings/documents')}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 ml-1">
            Payout Settings
          </h3>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
            <MenuItem
              icon={Wallet}
              title="Payout Details"
              subtitle="Manage M-Pesa or bank payout instructions"
              onClick={() => navigate('/rider/settings/payout')}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 ml-1">
            Preferences & Security
          </h3>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
            <MenuItem
              icon={Shield}
              title="Privacy & Security"
              subtitle="Change password and security options"
              onClick={() => navigate('/rider/settings/privacy')}
            />
          </div>
        </div>

        <div className="pt-1 pb-2">
          <MenuItem
            icon={LogOut}
            title="Log Out"
            subtitle="Sign out of your rider account"
            isDestructive
            onClick={() => {
              try {
                logout();
              } catch {
                // ignore
              }
              localStorage.removeItem(CACHE_KEY);
              navigate('/');
            }}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default RiderAccountSettings;
