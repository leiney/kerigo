import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  MapPin,
  Wallet,
  ShoppingBag,
  Bell,
  Settings,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import CustomerSettingsHeader from '../../components/layout/CustomerSettingsHeader';

export const AccountSettings: React.FC = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomerSettingsHeader
        title="Account Settings"
        subtitle="Manage your account, addresses, payments and preferences"
      />

      <div className="px-4 space-y-5">
        {/* --- Profile Card --- */}
        <button className="w-full bg-white rounded-2xl p-4 border border-border/50 shadow-sm flex items-center gap-4 text-left hover:bg-secondary/30 transition-colors">
          <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden shrink-0 border border-border/50">
            <img
              src="/placeholder-avatar.webp"
              alt="Sarah Wanjiku"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-foreground">Sarah Wanjiku</h2>
            <p className="text-sm text-foreground/60 mt-0.5">+254 700 123 456</p>
            <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3 fill-current" /> Verified
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-foreground/30" />
        </button>

        {/* --- Account Section --- */}
        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 ml-1">
            Account
          </h3>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
            <MenuItem icon={User} title="Personal Information" subtitle="View and edit your personal details" onClick={() => navigate('/settings/personal')} />
            <MenuItem icon={MapPin} title="Addresses" subtitle="Manage your saved addresses" onClick={() => navigate('/settings/addresses')} />
            <MenuItem icon={Wallet} title="Payments & Wallet" subtitle="Manage payment methods and wallet" onClick={() => navigate('/settings/payments')} />
            <MenuItem icon={ShoppingBag} title="Orders & Activity" subtitle="View your order history and activity" onClick={() => navigate('/settings/orders')} />
          </div>
        </div>

        {/* --- Preferences Section --- */}
        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 ml-1">
            Preferences
          </h3>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
            <MenuItem icon={Bell} title="Notifications" subtitle="Manage your notification preferences" onClick={() => navigate('/settings/notifications')} />
            <MenuItem icon={Settings} title="App Preferences" subtitle="Customize your app experience" onClick={() => navigate('/settings/preferences')} />
            <MenuItem icon={Shield} title="Privacy & Security" subtitle="Manage privacy and security settings" onClick={() => navigate('/settings/privacy')} />
          </div>
        </div>

        {/* --- Support Section --- */}
        <div>
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2 ml-1">
            Support
          </h3>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
            <MenuItem icon={HelpCircle} title="Help & Support" subtitle="Get help and support" onClick={() => navigate('/settings/help')} />
            <MenuItem icon={Info} title="About" subtitle="App version and legal information" onClick={() => navigate('/settings/about')} />
          </div>
        </div>

        {/* --- Log Out --- */}
        <div className="pt-1 pb-2">
          <MenuItem
            icon={LogOut}
            title="Log Out"
            subtitle="Sign out of your account"
            isDestructive
            onClick={() => navigate('/auth/login')}
          />
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};