import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { 
  Bike, 
  FileText, 
  Palette,
  ArrowRight, 
  ChevronLeft, 
  Plus, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { requiredTextError, selectionError, yearError } from '../../lib/onboardingValidation';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';

interface Vehicle {
  id: string;
  riderIndex: number | null;
  riderName: string;
  type: string;
  regNumber: string;
  make: string;
  model: string;
  year: string;
  color: string;
}

const vehicleTypes = [
  { value: 'motorbike', label: 'Motorbike' },
  { value: 'tricycle', label: 'Tricycle' },
  { value: 'van', label: 'Van' }
];

const yearOptions = Array.from({ length: 15 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { value: String(y), label: String(y) };
});

export const VehicleInformation3A: React.FC = () => {
  const navigate = useNavigate();
  const setOrganizationVehicles = useRiderOnboardingStore((state) => state.setOrganizationVehicles);
  const draft = useRiderOnboardingStore((state) => state.draft);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);

  const riderOptions = (draft.riders || []).map((r, i) => ({ value: String(i), label: r.fullName || `Rider ${i + 1}` }));

  const [selectedRider, setSelectedRider] = useState<string>(riderOptions.length ? riderOptions[0].value : '');

  const mapStoreVehicleToLocal = (v: any, idx: number): Vehicle => ({
    id: v.id || `v-${idx}-${Date.now()}`,
    riderIndex: typeof v.rider === 'object' ? (draft.riders || []).findIndex((rr) => rr.fullName === v.rider.fullName) : null,
    riderName: v.rider?.fullName || '',
    type: v.vehicleType || '',
    regNumber: v.registrationNo || '',
    make: v.make || '',
    model: v.model || '',
    year: v.regYear ? String(v.regYear) : '',
    color: v.color || '',
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => (draft.organizationVehicles && draft.organizationVehicles.length ? draft.organizationVehicles.map(mapStoreVehicleToLocal) : []));
  const [formData, setFormData] = useState({
    type: '',
    regNumber: '',
    make: '',
    model: '',
    year: '',
    color: ''
  });

  const riderSelectionValidationError = riderOptions.length > 0 && !selectedRider ? 'Please select a rider.' : '';
  const vehicleTypeValidationError = selectionError(formData.type, 'vehicle type');
  const registrationNumberValidationError = requiredTextError(formData.regNumber, 'Registration number');
  const makeValidationError = requiredTextError(formData.make, 'Make');
  const modelValidationError = requiredTextError(formData.model, 'Model');
  const yearValidationError = yearError(formData.year, 'Registration year');
  const colorValidationError = requiredTextError(formData.color, 'Color');

  const riderSelectionError = hasAttemptedContinue ? riderSelectionValidationError : '';
  const vehicleTypeError = hasAttemptedContinue ? vehicleTypeValidationError : '';
  const registrationNumberError = hasAttemptedContinue ? registrationNumberValidationError : '';
  const makeError = hasAttemptedContinue ? makeValidationError : '';
  const modelError = hasAttemptedContinue ? modelValidationError : '';
  const yearFieldError = hasAttemptedContinue ? yearValidationError : '';
  const colorError = hasAttemptedContinue ? colorValidationError : '';

  const canAddVehicle = !riderSelectionValidationError && !vehicleTypeValidationError && !registrationNumberValidationError && !makeValidationError && !modelValidationError && !yearValidationError && !colorValidationError;

  useEffect(() => {
    setOrganizationVehicles(
      vehicles.map((vehicle) => ({
        vehicleType: vehicle.type,
        registrationNo: vehicle.regNumber,
        make: vehicle.make,
        model: vehicle.model,
        regYear: Number(vehicle.year) || new Date().getFullYear(),
        color: vehicle.color,
        rider: {
          idNumber: (vehicle.riderIndex !== null && draft.riders[vehicle.riderIndex]) ? (draft.riders[vehicle.riderIndex].phoneNo || '') : '',
          fullName: (vehicle.riderIndex !== null && draft.riders[vehicle.riderIndex]) ? draft.riders[vehicle.riderIndex].fullName : vehicle.riderName,
        },
      }))
    );
  }, [vehicles, setOrganizationVehicles, draft.riders]);

  const handleAddVehicle = () => {
    if (!canAddVehicle) {
      setHasAttemptedContinue(true);
      return;
    }

    const riderIdx = selectedRider !== '' ? Number(selectedRider) : null;
    const riderName = (riderIdx !== null && draft.riders[riderIdx]) ? draft.riders[riderIdx].fullName : '';
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      riderIndex: riderIdx,
      riderName,
      ...formData
    };
    setVehicles((prev) => [...prev, newVehicle]);
    setFormData({ type: '', regNumber: '', make: '', model: '', year: '', color: '' });
    setHasAttemptedContinue(false);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleContinue = () => {
    if (vehicles.length === 0) {
      setHasAttemptedContinue(true);
      return;
    }

    navigate('/company/payout-details');
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

        <StepDots currentStep={3} />

        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 flex flex-col items-center overflow-y-auto pb-32">
        
        {/* Step Icon & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bike className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">3</Badge>
            </span>
            Vehicle Information
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Add vehicle details for each rider. Each vehicle will be linked to a rider.
          </p>
        </motion.div>

        {/* Form Fields */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-4"
        >
          
          {/* Rider Selection */}
          <div className='pb-4'>
            <Select
              label="Rider"
              placeholder="Select rider"
              options={riderOptions}
              value={selectedRider}
              onChange={(value) => setSelectedRider(String(value))}
              error={riderSelectionError}
              className="rounded-2xl h-14"
              required
            />
          </div>

        
          {/* Vehicle Type */}
          <div className='pb-4'>
            <Select
              label="Vehicle Type"
              placeholder="Select vehicle type"
              options={vehicleTypes}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: String(value) })}
              error={vehicleTypeError}
              className="rounded-2xl h-14"
              required
            />
          </div>

          {/* Registration Number */}
          <div>
            <Input
              label="Registration Number"
              placeholder="Enter registration number"
              value={formData.regNumber}
              onChange={(value) => setFormData({ ...formData, regNumber: String(value) })}
              error={registrationNumberError}
              leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
              required
            />
          </div>

          {/* Make */}
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

          {/* Model */}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          {/* Add Another Vehicle Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddVehicle}
            className="w-full py-3 border-2 border-dashed border-primary/30 rounded-2xl flex items-center justify-center gap-2 text-primary font-medium text-sm hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Vehicle
          </motion.button>

          {/* Added Vehicles List */}
          <AnimatePresence>
            {vehicles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 pt-2"
              >
                <p className="text-xs font-medium text-foreground/60">
                  Added Vehicles ({vehicles.length})
                </p>
                
                <div className="space-y-2">
                  {vehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="flex items-center gap-3 bg-secondary rounded-xl p-3">
                      <span className="text-xs text-foreground/50 w-4">{index + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {vehicle.regNumber} • {vehicle.make}, {vehicle.model}, {vehicle.year}
                        </p>
                        <p className="text-xs text-foreground/50">Color: {vehicle.color}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button 
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="absolute bottom-0 w-full p-6 pb-8 bg-white border-t border-border/50">
        <Button 
          onClick={handleContinue}
          type="button"
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};