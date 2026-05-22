import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  Monitor,
  Clock,
  LogOut,
} from 'lucide-react';
import { Button } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';

// --- Mock Data (Matches Wireframe Exactly) ---
const sessions = [
  {
    id: '1',
    location: 'Nairobi, Kenya',
    device: 'iPhone 14 Pro • iOS 17.4',
    timestamp: 'Current Session',
    isActive: true,
    icon: ShieldCheck,
  },
  {
    id: '2',
    location: 'Nairobi, Kenya',
    device: 'Chrome on Windows',
    timestamp: 'May 12, 2024 at 10:30 AM',
    isActive: false,
    icon: Monitor,
  },
  {
    id: '3',
    location: 'Mombasa, Kenya',
    device: 'Android Phone',
    timestamp: 'May 10, 2024 at 08:15 PM',
    isActive: false,
    icon: Smartphone,
  },
  {
    id: '4',
    location: 'Nakuru, Kenya',
    device: 'Safari on Mac',
    timestamp: 'May 8, 2024 at 06:40 PM',
    isActive: false,
    icon: Monitor,
  },
  {
    id: '5',
    location: 'Nairobi, Kenya',
    device: 'Android Phone',
    timestamp: 'May 6, 2024 at 09:20 AM',
    isActive: false,
    icon: Smartphone,
  },
];

export const LoginActivity: React.FC = () => {
  const navigate = useNavigate();

  const handleLogOutOthers = () => {
    console.log('Terminating all other sessions...');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Login Activity"
        breadcrumbs={[{ label: 'Privacy & Security' }, { label: 'Login Activity', emphasized: true }]}
      />

      <div className="px-4 space-y-3 pt-2">
        {sessions.map((session) => {
          const Icon = session.icon;
          return (
            <div
              key={session.id}
              className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm flex items-start gap-3"
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  session.isActive ? 'bg-primary/10' : 'bg-secondary'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    session.isActive ? 'text-primary' : 'text-foreground/50'
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {session.location}
                  </p>
                  {session.isActive && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                      Active now
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground/60 mt-0.5">
                  {session.device}
                </p>
                <p className="text-[11px] text-foreground/40 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {session.timestamp}
                </p>
              </div>
            </div>
          );
        })}

        {/* --- Danger Action --- */}
        <div className="pt-4 pb-2">
          <Button
            variant="outline"
            className="w-full border-error/30 text-error hover:bg-error/5 font-bold py-3 text-sm transition-colors"
            onClick={handleLogOutOthers}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out All Other Sessions
          </Button>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};