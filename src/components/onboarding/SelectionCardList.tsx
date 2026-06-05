import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle } from 'lucide-react';

export interface SelectionOption<T> {
  value: T;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface SelectionCardListProps<T> {
  options: SelectionOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  type?: 'checkbox' | 'radio';
}

export function SelectionCardList<T>({
  options,
  selectedValue,
  onChange,
  type = 'radio',
}: SelectionCardListProps<T>) {
  return (
    <div className="w-full space-y-4 max-w-md">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <motion.div
            key={String(option.value)}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.value)}
            className={`
              relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4
              ${isSelected 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border hover:border-border-dark bg-white'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              {option.icon}
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-base ${isSelected ? 'text-foreground' : 'text-foreground/70'}`}>
                {option.label}
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">
                {option.description}
              </p>
            </div>

            <div className="shrink-0">
              {type === 'radio' ? (
                isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )
              ) : (
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}
                `}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
