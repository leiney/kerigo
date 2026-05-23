import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Lock,
  Shield,
  Activity,
  Eye,
  UserX,
  FileText,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { settingsApi } from '../../../lib/api';
import type { PrivacySecurityValues } from '../../../lib/types';

export const PrivacySecurity: React.FC = () => {
  const navigate = useNavigate();
  const [security, setSecurity] = useState<PrivacySecurityValues | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSecurity = async () => {
      const data = await settingsApi.getPrivacySecurity();

      if (isMounted) {
        setSecurity(data);
      }
    };

    loadSecurity();

    return () => {
      isMounted = false;
    };
  }, []);

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    onClick,
    rightText,
  }: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    onClick?: () => void;
    rightText?: string;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 transition-colors hover:bg-secondary/50"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-foreground/60" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-foreground/50 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rightText && (
          <span className="text-xs font-medium text-foreground/40">{rightText}</span>
        )}
        <ChevronRight className="w-5 h-5 text-foreground/30" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader title="Privacy & Security" />

      <div className="px-4 space-y-6 pt-2">
        {/* --- Security Section --- */}
        <section>
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 ml-1">
            Security
          </h2>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
            <MenuItem
              icon={Lock}
              title="Change Password"
              subtitle="Update your password"
              onClick={() => navigate('/settings/privacy/change-password')}
            />
            <MenuItem
              icon={Shield}
              title="Two-Factor Authentication"
              subtitle="Add extra security to your account"
              rightText={security?.twoFactorEnabled ? 'On' : 'Off'}
              onClick={() => navigate('/settings/privacy/two-factor')}
            />
            <MenuItem
              icon={Activity}
              title="Login Activity"
              subtitle="View your recent login activity"
              onClick={() => navigate('/settings/privacy/login-activity')}
            />
          </div>
        </section>

        {/* --- Privacy Section --- */}
        <section>
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 ml-1">
            Privacy
          </h2>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
            <MenuItem
              icon={Eye}
              title="Profile Visibility"
              subtitle="Manage who can see your profile"
              rightText={security?.profileVisibility}
              onClick={() => navigate('/settings/privacy/profile-visibility')}
            />
            <MenuItem
              icon={UserX}
              title="Blocked Users"
              subtitle="Manage blocked users"
              rightText={security ? String(security.blockedUsers) : undefined}
              onClick={() => navigate('/settings/privacy/blocked-users')}
            />
            <MenuItem
              icon={FileText}
              title="Data & Privacy"
              subtitle="Manage your data and privacy"
              rightText={security?.dataPrivacy}
              onClick={() => navigate('/settings/privacy/data')}
            />
          </div>
        </section>

        {/* --- Info Banner --- */}
        <div className="bg-info/5 border border-info/10 rounded-xl p-3 flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-info/20">
            <ShieldCheck className="w-4 h-4 text-info" />
          </div>
          <p className="text-xs text-foreground/60 leading-relaxed mt-1">
            We take your privacy and security seriously. Learn more in our{' '}
            <span className="text-info font-medium underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};