import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input } from '@stackloop/ui';
import { 
  User, 
  Mail, 
  ArrowRight, 
  ChevronLeft,
  Camera,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { emailError, phoneError, requiredTextError } from '../../lib/onboardingValidation';
import { useVendorOnboardingStore } from '../../store/vendorOnboardingStore';

export const BasicDetails: React.FC = () => {
  const navigate = useNavigate();
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setIdentityDetails = useVendorOnboardingStore((state) => state.setIdentityDetails);
  const avatarFile = useVendorOnboardingStore((state) => state.attachments.avatar);
  const setAvatarFile = useVendorOnboardingStore((state) => state.setAvatarFile);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: draft.fullName,
    phoneNumber: draft.phoneNo,
    email: draft.email
  });

  useEffect(() => {
    setIdentityDetails({
      fullName: formData.fullName,
      phoneNo: formData.phoneNumber,
      email: formData.email,
    });
  }, [formData, setIdentityDetails]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  const fullNameValidationError = requiredTextError(formData.fullName, 'Full name');
  const phoneNumberValidationError = phoneError(formData.phoneNumber, 'Phone number');
  const emailAddressValidationError = emailError(formData.email);
  const avatarValidationError = avatarFile ? '' : 'Avatar is required.';
  const fullNameError = hasAttemptedContinue ? fullNameValidationError : '';
  const phoneNumberError = hasAttemptedContinue ? phoneNumberValidationError : '';
  const emailAddressError = hasAttemptedContinue ? emailAddressValidationError : '';
  const avatarError = hasAttemptedContinue ? avatarValidationError : '';
  const isFormValid = !fullNameValidationError && !phoneNumberValidationError && !emailAddressValidationError && !avatarValidationError;

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setAvatarFile(file);
    }
    event.target.value = '';
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }

    navigate('/vendor/kyc-documents');
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
      
      {/* Top Header / Navigation */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        <StepDots currentStep={2} />

        {/* Spacer to balance the header */}
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">2</Badge>
            </span>
            Basic Details
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Let's start with some basic information about you.
          </p>
        </motion.div>

        {/* Form Fields */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleContinue}
          className="w-full max-w-md space-y-4"
        >
          
          {/* Full Name */}
          <div>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(value) => setFormData({ ...formData, fullName: String(value) })}
              error={fullNameError}
              leftIcon={<User className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
              required
            />
          </div>

          {/* Phone Number */}
          <div className='pb-4'>
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(value) => setFormData({ ...formData, phoneNumber: String(value) })}
              defaultCountry="KE"
              autoDetect={false}
              error={phoneNumberError}
              className="h-14 rounded-2xl"
              type='tel'
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: String(value) })}
              error={emailAddressError}
              leftIcon={<Mail className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
              required
            />
          </div>


          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-[15px] font-bold text-foreground">
                Avatar <span className="text-error">*</span>
              </label>
              <p className="mt-2 text-sm text-foreground/55">This will represent your logo at store front.</p>
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => avatarInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  avatarInputRef.current?.click();
                }
              }}
              className={`w-full rounded-3xl border-2 border-dashed px-4 py-4 text-left transition-colors cursor-pointer ${
                avatarError ? 'border-error/60 bg-error/5' : 'border-border/70 bg-white hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden border border-border/50">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Selected avatar preview" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <Camera className="h-7 w-7" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-foreground">Upload avatar</p>
                  <p className="mt-1 text-sm text-foreground/55">PNG, JPG or WEBP. Max 2MB.</p>
                  <p className="mt-1 truncate text-xs text-foreground/40">
                    {avatarFile ? avatarFile.name : 'Tap to choose a clear Logo image.'}
                  </p>
                </div>

                {avatarFile ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setAvatarFile(null);
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

            {avatarError ? <p className="text-xs text-error">{avatarError}</p> : null}
          </div>


        </motion.form>

      </div>

      <div className="p-6 pb-8 bg-white">
        <Button 
          onClick={handleContinue}
          type="button"
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
};