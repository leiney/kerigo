import React, { useEffect, useState } from 'react';
import { Input, Select } from '@stackloop/ui';
import { Bike, FileText, Palette } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { requiredTextError, selectionError, yearError, alphanumericError } from '../../../lib/onboardingValidation';
import { alphanumericKeyDown } from '../../../lib/useAlphanumericInput';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';

type VehicleInformationStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const VehicleInformationStep: React.FC<VehicleInformationStepProps> = ({ onNext, onBack }) => {
  const draft = useRiderOnboardingStore((state) => state.draft);
  const setVehicleInfo = useRiderOnboardingStore((state) => state.setIndividualVehicleInfo);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleType: draft.individualVehicleInfo.vehicleType,
    registrationNumber: draft.individualVehicleInfo.registrationNo,
    make: draft.individualVehicleInfo.make,
    model: draft.individualVehicleInfo.model,
    year: draft.individualVehicleInfo.regYear ? String(draft.individualVehicleInfo.regYear) : '',
    color: draft.individualVehicleInfo.color
  });

  useEffect(() => {
    setVehicleInfo({
      vehicleType: formData.vehicleType,
      registrationNo: formData.registrationNumber,
      make: formData.make,
      model: formData.model,
      regYear: formData.year ? Number(formData.year) : new Date().getFullYear(),
      color: formData.color,
    });
  }, [formData, setVehicleInfo]);

  const vehicleTypeValidationError = selectionError(formData.vehicleType, 'vehicle type');
  const registrationNumberValidationError = alphanumericError(formData.registrationNumber, 'Registration number');
  const makeValidationError = requiredTextError(formData.make, 'Make');
  const modelValidationError = requiredTextError(formData.model, 'Model');
  const yearValidationError = yearError(formData.year, 'Registration year');
  const colorValidationError = requiredTextError(formData.color, 'Color');

  const vehicleTypeError = hasAttemptedContinue ? vehicleTypeValidationError : '';
  const registrationNumberError = hasAttemptedContinue ? registrationNumberValidationError : '';
  const makeError = hasAttemptedContinue ? makeValidationError : '';
  const modelError = hasAttemptedContinue ? modelValidationError : '';
  const yearFieldError = hasAttemptedContinue ? yearValidationError : '';
  const colorError = hasAttemptedContinue ? colorValidationError : '';

  const isFormValid = !vehicleTypeValidationError && !registrationNumberValidationError && !makeValidationError && !modelValidationError && !yearValidationError && !colorValidationError;

  const handleContinue = () => {
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={4}
      stepNumber={3}
      title="Vehicle Information"
      subtitle="Add details about your vehicle."
      icon={<Bike className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div className='pb-6'>
        <Select
          label="Vehicle Type"
          placeholder="Select vehicle type"
          options={[
            { value: 'motorbike', label: 'Motorbike' },
            { value: 'tricycle', label: 'Tricycle' },
            { value: 'bicycle', label: 'Bicycle' },
            { value: 'van', label: 'Van' }
          ]}
          value={formData.vehicleType}
          onChange={(value) => setFormData({ ...formData, vehicleType: String(value) })}
          error={vehicleTypeError}
          className="rounded-2xl h-14"
          required
        />
      </div>

      <div>
        <Input
          label="Registration Number"
          placeholder="Enter registration number"
          value={formData.registrationNumber}
          onChange={(value) => {
            const sanitized = String(value).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            setFormData({ ...formData, registrationNumber: sanitized });
          }}
          onKeyDown={alphanumericKeyDown}
          error={registrationNumberError}
          leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      <div>
        <Input
          label="Make"
          placeholder="e.g. Honda, TVS"
          value={formData.make}
          onChange={(value) => setFormData({ ...formData, make: String(value) })}
          error={makeError}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      <div>
        <Input
          label="Model"
          placeholder="e.g. CG 125"
          value={formData.model}
          onChange={(value) => setFormData({ ...formData, model: String(value) })}
          error={modelError}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Input
          label="Registration Year"
          type="number"
          placeholder="e.g. 2023"
          value={formData.year}
          onChange={(value) => setFormData({ ...formData, year: String(value) })}
          error={yearFieldError}
          className="h-14 rounded-2xl"
          required
        />

        <Input
          label="Color"
          placeholder="e.g. Black"
          value={formData.color}
          onChange={(value) => setFormData({ ...formData, color: String(value) })}
          error={colorError}
          leftIcon={<Palette className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
          required
        />
      </div>
    </OnboardingLayout>
  );
};
