import React from 'react';

type StepDotsProps = {
  currentStep: number;
  totalSteps?: number;
  className?: string;
};

export const StepDots: React.FC<StepDotsProps> = ({
  currentStep,
  totalSteps = 9,
  className = '',
}) => {
  const activeCount = Math.max(0, Math.min(currentStep, totalSteps));

  return (
    <div className={`flex gap-2 ${className}`.trim()}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-1 w-5 md:w-8 rounded-full ${index < activeCount ? 'bg-primary' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );
};