import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Toggle } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    orderConfirmations: true,
    orderShipped: true,
    orderDelivered: true,
    orderCancellations: true,
    dealsDiscounts: true,
    newArrivals: false,
    newsletter: false,
    appUpdates: true,
    reminders: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleRow = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-4 px-1">
      <div className="flex-1 pr-4">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-foreground/50 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <Toggle 
        checked={checked} 
        onChange={onChange} 
        aria-label={label}
        className="shrink-0"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader title="Notifications" />

      <div className="px-4 space-y-6 pt-2">
        {/* --- Order Updates --- */}
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3 ml-1">Order Updates</h2>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm divide-y divide-border/50">
            <ToggleRow
              label="Order Confirmations"
              description="Get notified when your order is confirmed"
              checked={settings.orderConfirmations}
              onChange={() => handleToggle('orderConfirmations')}
            />
            <ToggleRow
              label="Order Shipped"
              description="Get notified when your order is shipped"
              checked={settings.orderShipped}
              onChange={() => handleToggle('orderShipped')}
            />
            <ToggleRow
              label="Order Delivered"
              description="Get notified when your order is delivered"
              checked={settings.orderDelivered}
              onChange={() => handleToggle('orderDelivered')}
            />
            <ToggleRow
              label="Order Cancellations"
              description="Get notified about order cancellations"
              checked={settings.orderCancellations}
              onChange={() => handleToggle('orderCancellations')}
            />
          </div>
        </section>

        {/* --- Promotions & Offers --- */}
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3 ml-1">Promotions & Offers</h2>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm divide-y divide-border/50">
            <ToggleRow
              label="Deals & Discounts"
              description="Receive offers and discounts"
              checked={settings.dealsDiscounts}
              onChange={() => handleToggle('dealsDiscounts')}
            />
            <ToggleRow
              label="New Arrivals"
              description="Get notified about new products"
              checked={settings.newArrivals}
              onChange={() => handleToggle('newArrivals')}
            />
            <ToggleRow
              label="Newsletter"
              description="Receive our newsletter"
              checked={settings.newsletter}
              onChange={() => handleToggle('newsletter')}
            />
          </div>
        </section>

        {/* --- General --- */}
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3 ml-1">General</h2>
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm divide-y divide-border/50">
            <ToggleRow
              label="App Updates"
              description="Important updates and announcements"
              checked={settings.appUpdates}
              onChange={() => handleToggle('appUpdates')}
            />
            <ToggleRow
              label="Reminders"
              description="Personalized reminders"
              checked={settings.reminders}
              onChange={() => handleToggle('reminders')}
            />
          </div>
        </section>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};