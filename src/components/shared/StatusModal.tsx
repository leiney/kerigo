import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { Button } from '@stackloop/ui';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  // Determine styles and icon based on type
  let iconColor = 'text-primary';
  let bgColor = 'bg-primary/10';
  let Icon = CheckCircle2;

  if (type === 'error') {
    iconColor = 'text-error';
    bgColor = 'bg-error/10';
    Icon = XCircle;
  } else if (type === 'info') {
    iconColor = 'text-blue-600';
    bgColor = 'bg-blue-50';
    Icon = Info;
  }

  const handlePrimaryClick = () => {
    if (onAction) {
      onAction();
    } else {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm overflow-hidden z-10 border border-border/50 text-center animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Centered Icon */}
            <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4 mt-2`}>
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-bold text-foreground leading-tight px-2 mb-2">
              {title}
            </h3>
            <p className="text-sm text-foreground/60 px-2 leading-relaxed mb-6">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <Button
                className={`w-full font-bold py-3 rounded-2xl shadow-lg transition-all ${
                  type === 'error'
                    ? 'bg-error text-white shadow-error/20 hover:bg-error/90'
                    : type === 'info'
                    ? 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700'
                    : 'bg-primary text-white shadow-primary/20 hover:bg-primary/90'
                }`}
                onClick={handlePrimaryClick}
              >
                {actionLabel || (type === 'error' ? 'Retry' : 'OK')}
              </Button>

              {secondaryActionLabel && (
                <Button
                  variant="outline"
                  className={`w-full font-semibold py-3 rounded-2xl transition-all ${
                    type === 'error'
                      ? 'border-error/20 text-error hover:bg-error/5'
                      : type === 'info'
                      ? 'border-blue-600/20 text-blue-600 hover:bg-blue-50'
                      : 'border-primary/20 text-primary hover:bg-primary/5'
                  }`}
                  onClick={handleSecondaryClick}
                >
                  {secondaryActionLabel}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
