import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  DollarSign,
  Palette,
  Database,
  MapPin,
  Map,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { Toggle } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { settingsApi } from '../../../lib/api';
import type { AppPreferenceValues } from '../../../lib/types';

export const AppPreferences: React.FC = () => {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState<AppPreferenceValues>({
    saveData: true,
    locationServices: true,
    language: 'English',
    currency: 'KES (Kenyan Shilling)',
    theme: 'System Default',
  });

  useEffect(() => {
    let isMounted = true;

    const loadPreferences = async () => {
      const data = await settingsApi.getAppPreferences();

      if (isMounted) {
        setPreferences(data);
      }
    };

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = (key: 'saveData' | 'locationServices') => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleRow = ({
    icon: Icon,
    label,
    description,
    checked,
    onChange,
  }: {
    icon: React.ElementType;
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/50">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-foreground/60" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-foreground/50 mt-0.5">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );

  const LinkRow = ({
    icon: Icon,
    label,
    value,
    onClick,
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 transition-colors hover:bg-secondary/50"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-foreground/60" />
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-foreground/50 mt-0.5">{value}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-foreground/30" />
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader title="App Preferences" />

      <div className="px-4 space-y-6 pt-2">
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
          
          <LinkRow
            icon={Globe}
            label="Language"
            value={preferences.language}
            onClick={() => console.log('Language settings')}
          />
          <LinkRow
            icon={DollarSign}
            label="Currency"
            value={preferences.currency}
            onClick={() => console.log('Currency settings')}
          />
          <LinkRow
            icon={Palette}
            label="Theme"
            value={preferences.theme}
            onClick={() => console.log('Theme settings')}
          />

          {/* Toggles Group */}
          <ToggleRow
            icon={Database}
            label="Save Data"
            description="Reduce data usage"
            checked={preferences.saveData}
            onChange={() => handleToggle('saveData')}
          />
          <ToggleRow
            icon={MapPin}
            label="Location Services"
            description="Improve delivery experience"
            checked={preferences.locationServices}
            onChange={() => handleToggle('locationServices')}
          />

          

        </div>
      </div>

      <BottomNav />
    </div>
  );
};