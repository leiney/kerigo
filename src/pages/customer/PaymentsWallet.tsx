import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  Smartphone,
  Plus,
  ChevronRight,
  Shield,
  Lock,
  Settings,
  RotateCcw,
} from 'lucide-react';
import { Button, Badge } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';

const walletData = {
  balance: 1250.0,
  name: 'KeriGo Wallet',
};

const paymentMethods = [
  {
    id: '1',
    type: 'visa',
    label: 'Visa',
    lastFour: '4242',
    expiry: '12/26',
    isDefault: true,
    icon: CreditCard,
  },
  {
    id: '2',
    type: 'mastercard',
    label: 'Mastercard',
    lastFour: '5555',
    expiry: '08/27',
    isDefault: false,
    icon: CreditCard,
  },
  {
    id: '3',
    type: 'mpesa',
    label: 'M-Pesa',
    lastFour: '456',
    expiry: '',
    isDefault: false,
    icon: Smartphone,
    phoneNumber: '+254 700 123',
  },
];

export const PaymentsWallet: React.FC = () => {
  const navigate = useNavigate();

  const getCardColor = (type: string) => {
    switch (type) {
      case 'visa':
        return 'text-blue-600';
      case 'mastercard':
        return 'text-orange-600';
      case 'mpesa':
        return 'text-green-600';
      default:
        return 'text-foreground';
    }
  };

  const logoFor = (type: string) => {
    const allowed = ['visa', 'mastercard', 'mpesa'];
    if (allowed.includes(type)) return `/payment-logos/${type}.png`;
    return null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader title="Payments & Wallet" />

      <div className="px-4 space-y-6">
        {/* --- Wallet Section --- */}
        <section>
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 ml-1">
            Wallet
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{walletData.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">
                    KSH {walletData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/30" />
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 text-sm"
              onClick={() => navigate('/settings/payments/topup')}
            >
              Top Up Wallet
            </Button>
          </div>
        </section>

        {/* --- Payment Methods Section --- */}
        <section>
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 ml-1">
            Payment Methods
          </h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-secondary overflow-hidden`}> 
                      {logoFor(method.type) ? (
                        <img src={logoFor(method.type)!} alt={`${method.label} logo`} className="w-9 h-9 object-contain" />
                      ) : (
                        <method.icon className={`w-5 h-5 ${getCardColor(method.type)}`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">
                          {method.label} •••• {method.lastFour}
                        </p>
                        {method.isDefault && (
                          <Badge
                            variant="success"
                            className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full"
                          >
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-foreground/50 mt-0.5">
                        {method.expiry ? `Expires ${method.expiry}` : method.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-foreground/30" />
                </div>
              </div>
            ))}

            {/* Add Payment Method Button */}
            <button
              onClick={() => navigate('/settings/payments/add')}
              className="w-full bg-white rounded-2xl p-4 border border-border/50 shadow-sm flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-bold">Add Payment Method</span>
            </button>
          </div>
        </section>

        {/* --- Payment Settings Section --- */}
        <section>
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 ml-1">
            Payment Settings
          </h2>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
            <button
              onClick={() => navigate('/settings/payments/default')}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-foreground/60" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Set Default Payment Method</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/30" />
            </button>

            <button
              onClick={() => navigate('/settings/payments/autopay')}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-foreground/60" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Manage Autopay</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/30" />
            </button>
          </div>
        </section>

        {/* --- Security Note --- */}
        <div className="bg-info/5 border border-info/10 rounded-xl p-3 flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-info/20">
            <Lock className="w-4 h-4 text-info" />
          </div>
          <p className="text-xs text-foreground/60 leading-relaxed mt-1">
            Your payment information is secure and encrypted.
          </p>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};