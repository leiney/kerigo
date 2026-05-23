import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Bell,
  Star,
  Headphones,
} from 'lucide-react';
import { Button } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { supportApi } from '../../../lib/api';
import type { SupportOption, SupportTopic } from '../../../lib/types';

export const HelpSupport: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<SupportTopic[]>([]);
  const [options, setOptions] = useState<SupportOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadSupportData = async () => {
      const [topicsData, optionsData] = await Promise.all([
        supportApi.getTopics(),
        supportApi.getOptions(),
      ]);

      if (isMounted) {
        setTopics(topicsData);
        setOptions(optionsData);
      }
    };

    loadSupportData();

    return () => {
      isMounted = false;
    };
  }, []);

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    onClick,
  }: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    onClick?: () => void;
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
      <ChevronRight className="w-5 h-5 text-foreground/30" />
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader title="Help & Support" />

      <div className="px-4 space-y-6 pt-2">
        {/* --- Intro Text --- */}
        <p className="text-sm text-foreground/50 ml-1">How can we help you?</p>

        {/* --- Support Menu --- */}
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
          {topics.map((topic, index) => (
            <MenuItem
              key={topic.id}
              icon={[HelpCircle, MessageSquare, Bell, Star][index] ?? HelpCircle}
              title={topic.title}
              subtitle={topic.subtitle}
              onClick={() => navigate(`/settings/help/${topic.id}`)}
            />
          ))}
        </div>

        {/* --- Immediate Help Card --- */}
        <div className="bg-primary/5 rounded-2xl p-5 relative overflow-hidden border border-primary/10">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-primary mb-1">
              Need immediate help?
            </h3>
            <p className="text-xs text-foreground/60 mb-4">
              {options[0]?.subtitle ?? 'Chat with our support team'}
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2.5 px-6 shadow-sm">
              Start Chat
            </Button>
          </div>

          {/* Decorative Icon mimicking the illustration */}
          <div className="absolute -bottom-2 -right-2 opacity-20">
            <Headphones className="w-24 h-24 text-primary rotate-12" />
          </div>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};