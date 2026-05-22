import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

type BreadcrumbItem = {
  label: string;
  emphasized?: boolean;
};

type CustomerSettingsHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  rightContent?: React.ReactNode;
  onBack?: () => void;
};

export const CustomerSettingsHeader: React.FC<CustomerSettingsHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [{ label: 'Settings' }, { label: title, emphasized: true }],
  rightContent,
  onBack,
}) => {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="px-4 pt-4 pb-3">
        <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>

          <nav className="flex min-w-0 items-center gap-1 overflow-hidden text-[11px] leading-none text-foreground/40">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={`${item.label}-${index}`}>
                <span className={item.emphasized ? 'text-foreground/70 font-medium' : 'truncate'}>
                  {item.label}
                </span>
                {index < breadcrumbs.length - 1 && <span className="shrink-0 text-foreground/25">/</span>}
              </React.Fragment>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2">
            {rightContent ?? <div className="w-10" />}
          </div>
        </div>

        <div className="min-w-0 pr-1 pt-3">
          <h1 className="text-[1.45rem] font-bold tracking-[-0.02em] text-foreground leading-[1.1]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 max-w-136 text-xs leading-5 text-foreground/60">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomerSettingsHeader;
