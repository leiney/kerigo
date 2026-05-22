import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';

export const TwoFactorAuth: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    { id: 1, text: 'Enable 2FA on your account' },
    { id: 2, text: 'Scan the QR code with your authenticator app' },
    { id: 3, text: 'Enter the 6-digit code to verify' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Two-Factor Authentication"
        breadcrumbs={[{ label: 'Privacy & Security' }, { label: 'Two-Factor Authentication', emphasized: true }]}
      />

      <div className="px-4 pt-6 flex flex-col items-center text-center">
        {/* --- Icon --- */}
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>

        {/* --- Title & Description --- */}
        <h2 className="text-lg font-bold text-foreground mb-2">
          Add an extra layer of security to your account
        </h2>
        <p className="text-sm text-foreground/50 max-w-xs leading-relaxed mb-8">
          When enabled, you'll need to enter a code from your phone in addition to your password.
        </p>

        {/* --- CTA Button --- */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 text-sm shadow-sm mb-10"
          onClick={() => console.log('Navigate to 2FA setup flow')}
        >
          Enable 2FA
        </Button>

        {/* --- How it Works --- */}
        <div className="w-full text-left">
          <h3 className="text-sm font-bold text-foreground mb-4 ml-1">How it works</h3>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{step.id}</span>
                </div>
                <p className="text-sm text-foreground/70 leading-snug pt-0.5">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};