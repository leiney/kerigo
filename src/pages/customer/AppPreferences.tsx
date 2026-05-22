import React, { useState } from 'react';
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

export const AppPreferences: React.FC = () => {
  const navigate = useNavigate();

  // State for Toggles
  const [preferences, setPreferences] = useState({
    saveData: true,
    locationServices: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Reusable Toggle Row Component
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

  // Reusable Link Row Component
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
        {/* --- App Preferences List --- */}
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
          
          {/* General Settings Group */}
          <LinkRow
            icon={Globe}
            label="Language"
            value="English"
            onClick={() => console.log('Language settings')}
          />
          <LinkRow
            icon={DollarSign}
            label="Currency"
            value="KES (Kenyan Shilling)"
            onClick={() => console.log('Currency settings')}
          />
          <LinkRow
            icon={Palette}
            label="Theme"
            value="System Default"
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

          {/* Integration Group */}
          <LinkRow
            icon={Map}
            label="Default Map App"
            value="Google Maps"
            onClick={() => console.log('Map settings')}
          />
          <LinkRow
            icon={MessageSquare}
            label="Chat Preferences"
            value="Manage chat settings"
            onClick={() => console.log('Chat settings')}
          />

        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};