import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Checkbox } from '@stackloop/ui';
import { 
  CheckCircle2, 
  ChevronLeft, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { authApi } from '../../../lib/api';
import { buildRiderSignupPayload } from '../../lib/riderOnboarding';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile } from '../../types';

export const ReviewAndConfirm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const draft = useRiderOnboardingStore((state) => state.draft);
  const reset = useRiderOnboardingStore((state) => state.reset);
  const isIndividual = draft.accountType !== 'organisation';

  const summaryData = useMemo(() => {
    const payoutLabel = draft.payoutInfo
      ? draft.payoutInfo.mode === 'mpesa'
        ? `M-Pesa (${(draft.payoutInfo.details as { phoneNo?: string }).phoneNo || draft.phoneNo})`
        : `Bank (${(draft.payoutInfo.details as { bank?: string }).bank || 'Bank account'})`
      : 'Not provided';

    return {
      accountType: draft.accountType,
      applicantName: draft.fullName || '—',
      email: draft.email || '—',
      phone: draft.phoneNo || '—',
      individualVehicle: draft.individualVehicleInfo.registrationNo
        ? {
            vehicleType: draft.individualVehicleInfo.vehicleType,
            registrationNo: draft.individualVehicleInfo.registrationNo,
            make: draft.individualVehicleInfo.make,
            model: draft.individualVehicleInfo.model,
            regYear: String(draft.individualVehicleInfo.regYear),
            color: draft.individualVehicleInfo.color,
          }
        : null,
      individualDocuments: draft.individualDocuments,
      organizationInfo: draft.organizationInfo,
      organizationVehicles: draft.organizationVehicles,
      riders: draft.riders,
      payoutMethod: payoutLabel,
    };
  }, [draft]);

  const handleContinue = async () => {
    if (!agreed) return;

    try {
      const payload = buildRiderSignupPayload(draft);
      const response = await authApi.signupRider(payload);
      const user: UserProfile = {
        id: response.id,
        name: response.fullName,
        email: response.email,
        phone: response.phoneNo,
        userType: 'rider',
      };

      login({ token: response.token, user });
      reset();
      navigate('/rider/success');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not submit rider signup.');
    }
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

        <StepDots currentStep={7} />

        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 flex flex-col items-center overflow-y-auto pb-32">
        
        {/* Step Icon & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">7</Badge>
            </span>
            Review & Confirm
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Review your information before completing setup.
          </p>
        </motion.div>

        {/* Summary Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-6"
        >
          
          {isIndividual ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Full Name</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.applicantName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Phone Number</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.phone}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Email Address</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%] break-all">{summaryData.email}</span>
                </div>
              </div>

              {summaryData.individualVehicle && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">Vehicle</h3>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-foreground/40 w-4">1.</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{summaryData.individualVehicle.registrationNo}</p>
                        <p className="text-xs text-foreground/50">
                          {summaryData.individualVehicle.vehicleType}, {summaryData.individualVehicle.make}, {summaryData.individualVehicle.model}, {summaryData.individualVehicle.regYear}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">KYC Documents ({summaryData.individualDocuments.length})</h3>
                <div className="space-y-2 pl-2">
                  {summaryData.individualDocuments.map((document, idx) => (
                    <div key={`${document.documentType}-${idx}`} className="flex items-start gap-3">
                      <span className="text-xs text-foreground/40 w-4">{idx + 1}.</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{document.documentType}</p>
                        <p className="text-xs text-foreground/50">{document.serialNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Organisation Name</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.organizationInfo.name || '—'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Business Type</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.organizationInfo.businessType || 'other'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Registration No.</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.organizationInfo.registrationNo || '—'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Tax ID</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.organizationInfo.taxIDNumber || '—'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Administrator</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.applicantName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Phone Number</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.phone}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-foreground/60">Email Address</span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%] break-all">{summaryData.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Riders ({summaryData.riders.length})</h3>
                <div className="space-y-2 pl-2">
                  {summaryData.riders.map((rider, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-xs text-foreground/40 w-4">{idx + 1}.</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{rider.fullName}</p>
                        <p className="text-xs text-foreground/50">{rider.phoneNo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Vehicles ({summaryData.organizationVehicles.length})</h3>
                <div className="space-y-2 pl-2">
                  {summaryData.organizationVehicles.map((vehicle, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-xs text-foreground/40 w-4">{idx + 1}.</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{vehicle.registrationNo}</p>
                        <p className="text-xs text-foreground/50">
                          {vehicle.vehicleType}, {vehicle.make}, {vehicle.model}, {vehicle.regYear}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Payout Method */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Payout Method</h3>
            <p className="text-sm text-foreground/70 pl-2">{summaryData.payoutMethod}</p>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-4">
            <Checkbox 
              label="I confirm that the information provided is accurate." 
              checked={agreed} 
              onChange={setAgreed}
              className="text-sm"
            />
          </div>

        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="absolute bottom-0 w-full p-6 pb-8 bg-white border-t border-border/50">
        <Button 
          onClick={handleContinue}
          disabled={!agreed}
          className={`w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all
            ${agreed ? 'shadow-primary/20' : 'opacity-50 cursor-not-allowed shadow-none'}`}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};