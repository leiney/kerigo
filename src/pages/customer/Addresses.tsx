import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Phone,
  Ellipsis,
  Info,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';

// --- Mock Data ---
const savedAddresses = [
  {
    id: '1',
    label: 'Home',
    isDefault: true,
    street: '123 Riverside Drive',
    area: 'Westlands, Nairobi',
    county: 'Nairobi County, 00100',
    country: 'Kenya',
    phone: '+254 700 123 456',
  },
  {
    id: '2',
    label: 'Work',
    isDefault: false,
    street: 'Green Towers, 5th Floor',
    area: 'Chiromo Road',
    county: 'Westlands, Nairobi',
    country: 'Kenya',
    phone: '+254 700 123 456',
  },
  {
    id: '3',
    label: 'Parents Home',
    isDefault: false,
    street: '456 Karen Road',
    area: 'Karen',
    county: 'Nairobi County, 00502',
    country: 'Kenya',
    phone: '+254 700 123 456',
  },
];

export const Addresses: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Addresses"
        rightContent={
          <button
            onClick={() => navigate('/settings/addresses/add')}
            className="flex items-center gap-1.5 text-primary text-xs font-bold hover:bg-primary/5 px-3 py-2 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        }
      />

      <div className="px-4 space-y-6">
        {/* --- Saved Addresses List --- */}
        <div>
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 ml-1">
            Saved Addresses
          </h2>
          <div className="space-y-3">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm relative"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {addr.label}
                    </h3>
                    {addr.isDefault && (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <button className="p-1 rounded-full hover:bg-secondary transition-colors">
                    <MoreVertical className="w-4 h-4 text-foreground/50" />
                  </button>
                </div>

                {/* Address Details */}
                <div className="space-y-0.5 mb-3">
                  <p className="text-xs text-foreground leading-snug">{addr.street}</p>
                  <p className="text-xs text-foreground/60 leading-snug">{addr.area}</p>
                  <p className="text-xs text-foreground/60 leading-snug">{addr.county}</p>
                  <p className="text-xs text-foreground/60 leading-snug">{addr.country}</p>
                </div>

                {/* Phone Number */}
                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{addr.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Default Address Info Note --- */}
        <div className="bg-info/5 border border-info/10 rounded-xl p-3 flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-info/20">
            <Info className="w-4 h-4 text-info" />
          </div>
          <p className="text-xs text-foreground/60 leading-relaxed mt-1">
            Set a default address to make checkout faster.
          </p>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};