import React, { useEffect, useRef, useState } from 'react';
import { Badge, Input, Select } from '@stackloop/ui';
import { Building2, Camera, Image as ImageIcon, X, FileText } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { businessTypeOptions } from '../../../lib/vendorOnboarding';
import { requiredTextError, selectionError, alphanumericError } from '../../../lib/onboardingValidation';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';
import { BusinessType } from '../../../../lib/types';

type CompanyDetailsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const CompanyDetailsStep: React.FC<CompanyDetailsStepProps> = ({ onNext, onBack }) => {
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setOrganizationInfo = useVendorOnboardingStore((state) => state.setOrganizationInfo);
  const logoFile = useVendorOnboardingStore((state) => state.attachments.organizationLogo);
  const setOrganizationLogoFile = useVendorOnboardingStore((state) => state.setOrganizationLogoFile);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: draft.organizationInfo.name,
    businessRegistrationNumber: draft.organizationInfo.registrationNo,
    kraPIN: draft.organizationInfo.taxIDNumber,
    businessType: draft.organizationInfo.businessType,
  });

  useEffect(() => {
    setOrganizationInfo({
      name: formData.companyName,
      registrationNo: formData.businessRegistrationNumber,
      taxIDNumber: formData.kraPIN,
      businessType: formData.businessType || BusinessType.Other,
    });
  }, [formData, setOrganizationInfo]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(logoFile);
    setLogoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [logoFile]);

  const companyNameValidationError = requiredTextError(formData.companyName, 'Company name');
  const registrationNumberValidationError = alphanumericError(formData.businessRegistrationNumber, 'Business registration number');
  const kraPinValidationError = alphanumericError(formData.kraPIN, 'KRA PIN');
  const businessTypeValidationError = selectionError(formData.businessType, 'business type');
  const logoValidationError = logoFile ? '' : 'Logo is required.';
  
  const companyNameError = hasAttemptedContinue ? companyNameValidationError : '';
  const registrationNumberError = hasAttemptedContinue ? registrationNumberValidationError : '';
  const kraPinError = hasAttemptedContinue ? kraPinValidationError : '';
  const businessTypeError = hasAttemptedContinue ? businessTypeValidationError : '';
  const logoError = hasAttemptedContinue ? logoValidationError : '';
  const isFormValid = !companyNameValidationError && !registrationNumberValidationError && !kraPinValidationError && !businessTypeValidationError && !logoValidationError;

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setOrganizationLogoFile(file);
    }
    event.target.value = '';
  };

  const handleContinue = () => {
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={2}
      stepNumber={2}
      title="Company Details"
      subtitle="Tell us about your business."
      icon={<Building2 className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      {/* Company Name */}
      <div>
        <Input
          label="Company Name"
          placeholder="Enter your company name"
          value={formData.companyName}
          onChange={(value) => setFormData({ ...formData, companyName: String(value) })}
          error={companyNameError}
          leftIcon={<Building2 className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      {/* Business Registration Number */}
      <div>
        <Input
          label="Business Registration Number"
          placeholder="Enter registration number"
          value={formData.businessRegistrationNumber}
          onChange={(value) => {
            const sanitized = String(value).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            setFormData({ ...formData, businessRegistrationNumber: sanitized });
          }}
          error={registrationNumberError}
          leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      {/* KRA PIN */}
      <div>
        <Input
          label="KRA PIN"
          placeholder="Enter KRA PIN"
          value={formData.kraPIN}
          onChange={(value) => {
            const sanitized = String(value).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            setFormData({ ...formData, kraPIN: sanitized });
          }}
          error={kraPinError}
          leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      {/* Business Type */}
      <div className='pb-5'>
        <Select
          label="Business Type"
          placeholder="Select business type"
          options={businessTypeOptions.map((type) => ({ value: type.value, label: type.label }))}
          value={formData.businessType}
          onChange={(value) => setFormData({ ...formData, businessType: String(value) as any })}
          error={businessTypeError}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      {/* Logo Upload */}
      <div className="space-y-3 pt-1">
        <div>
          <label className="block text-[15px] font-bold text-foreground">
            Logo <span className="text-error">*</span>
          </label>
          <p className="mt-2 text-sm text-foreground/55">Upload a square logo for the best display quality.</p>
        </div>

        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />

        <div
          role="button"
          tabIndex={0}
          onClick={() => logoInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              logoInputRef.current?.click();
            }
          }}
          className={`w-full rounded-3xl border-2 border-dashed px-4 py-4 text-left transition-colors cursor-pointer ${
            logoError ? 'border-error/60 bg-error/5' : 'border-border/70 bg-white hover:border-primary/40 hover:bg-primary/5'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 overflow-hidden border border-border/50">
              {logoPreview ? (
                <img src={logoPreview} alt="Selected logo preview" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <Camera className="h-7 w-7" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-foreground">Upload logo</p>
              <p className="mt-1 text-sm text-foreground/55">PNG, JPG or WEBP. Max 2MB.</p>
              <p className="mt-1 truncate text-xs text-foreground/40">
                {logoFile ? logoFile.name : 'Tap to choose your organisation logo.'}
              </p>
            </div>

            {logoFile ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setOrganizationLogoFile(null);
                }}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4 text-foreground/45" />
              </button>
            ) : (
              <ImageIcon className="h-5 w-5 shrink-0 text-foreground/35" />
            )}
          </div>
        </div>

        {logoError ? <p className="text-xs text-error">{logoError}</p> : null}
      </div>
    </OnboardingLayout>
  );
};
