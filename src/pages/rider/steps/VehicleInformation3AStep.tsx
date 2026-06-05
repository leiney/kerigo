import React, { useEffect, useState } from 'react';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { Bike, FileText, Palette, Plus, Pencil, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { requiredTextError, selectionError, yearError, alphanumericError } from '../../../lib/onboardingValidation';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';

type VehicleInformation3AStepProps = {
  onNext: () => void;
  onBack: () => void;
};

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

export const VehicleInformation3AStep: React.FC<VehicleInformation3AStepProps> = ({ onNext, onBack }) => {
  const setOrganizationVehicles = useRiderOnboardingStore((state) => state.setOrganizationVehicles);
  const draft = useRiderOnboardingStore((state) => state.draft);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const [selectedRider, setSelectedRider] = useState<string>('');

  const riderOptions = (draft.riders || [])
    .map((r, i) => ({ value: String(i), label: r.fullName || `Rider ${i + 1}` }))
    .filter((option) => {
      const riderIdx = Number(option.value);
      const isAssignedToOtherVehicle = vehicles.some((v) => {
        if (sheetMode === 'edit' && v.id === editingVehicleId) {
          return false;
        }
        return v.riderIndex === riderIdx;
      });
      return !isAssignedToOtherVehicle;
    });

  const riderSelectionValidationError = riderOptions.length > 0 && !selectedRider ? 'Please select a rider.' : '';
  const vehicleTypeValidationError = selectionError(formData.type, 'vehicle type');
  const registrationNumberValidationError = alphanumericError(formData.regNumber, 'Registration number');
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
          idNumber: (vehicle.riderIndex !== null && draft.riders[vehicle.riderIndex]) ? (draft.riders[vehicle.riderIndex].idNumber || '') : '',
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
    setVehicles((prev) => {
      if (sheetMode === 'edit' && editingVehicleId) {
        return prev.map((vehicle) => (vehicle.id === editingVehicleId ? { ...newVehicle, id: vehicle.id } : vehicle));
      }
      return [...prev, newVehicle];
    });
    setFormData({ type: '', regNumber: '', make: '', model: '', year: '', color: '' });
    setHasAttemptedContinue(false);
    setIsSheetOpen(false);
    setSheetMode('add');
    setEditingVehicleId(null);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const openAddVehicleSheet = () => {
    setSheetMode('add');
    setEditingVehicleId(null);
    setFormData({ type: '', regNumber: '', make: '', model: '', year: '', color: '' });
    const availableOptions = (draft.riders || [])
      .map((r, i) => ({ value: String(i), label: r.fullName || `Rider ${i + 1}` }))
      .filter((option) => {
        const riderIdx = Number(option.value);
        return !vehicles.some((v) => v.riderIndex === riderIdx);
      });
    setSelectedRider(availableOptions.length ? availableOptions[0].value : '');
    setIsSheetOpen(true);
  };

  const openEditVehicleSheet = (vehicle: Vehicle) => {
    setSheetMode('edit');
    setEditingVehicleId(vehicle.id);
    setSelectedRider(vehicle.riderIndex !== null ? String(vehicle.riderIndex) : '');
    setFormData({
      type: vehicle.type,
      regNumber: vehicle.regNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
    });
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSheetMode('add');
    setEditingVehicleId(null);
    setHasAttemptedContinue(false);
  };

  const handleContinue = () => {
    if (vehicles.length === 0) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={6}
      stepNumber={3}
      title="Vehicle Information"
      subtitle="Add vehicle details for each rider. Each vehicle will be linked to a rider."
      icon={<Bike className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div className="w-full flex-1 flex flex-col">
        <AnimatePresence>
          {vehicles.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
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
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => openEditVehicleSheet(vehicle)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4 text-foreground/60" />
                      </button>
                      <button 
                        type="button"
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

        {vehicles.length < (draft.riders || []).length ? (
          <button
            type="button"
            onClick={openAddVehicleSheet}
            className="w-full mt-6 py-3 border-2 border-dashed border-primary/30 rounded-2xl flex items-center justify-center gap-2 text-primary font-medium text-sm hover:bg-primary/5 transition-colors active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            {vehicles.length > 0 ? 'Add Another Vehicle' : 'Add First Vehicle'}
          </button>
        ) : (
          <div className="w-full mt-6 py-3 bg-secondary/50 rounded-2xl text-center text-foreground/40 text-sm font-medium border border-border">
            All riders have been assigned to a vehicle
          </div>
        )}
      </div>

      <AnimatePresence>
        {isSheetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-end"
            onClick={closeSheet}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="w-full max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="px-6 pt-5 pb-4 border-b border-border/60 flex items-start justify-between gap-4">
                <div>
                  <h2 className="mt-1 text-lg font-bold text-foreground">
                    {sheetMode === 'edit' ? 'Edit vehicle' : vehicles.length > 0 ? 'Add another vehicle' : 'Add first vehicle'}
                  </h2>
                </div>
                <button type="button" onClick={closeSheet} className="p-2 rounded-full hover:bg-secondary transition-colors">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div className="pb-5">
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

                <div className="pb-5">
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

                <Input
                  label="Make"
                  placeholder="e.g. Honda, TVS"
                  value={formData.make}
                  onChange={(value) => setFormData({ ...formData, make: String(value) })}
                  error={makeError}
                  className="h-14 rounded-2xl"
                  required
                />

                <Input
                  label="Model"
                  placeholder="e.g. CG 125"
                  value={formData.model}
                  onChange={(value) => setFormData({ ...formData, model: String(value) })}
                  error={modelError}
                  className="h-14 rounded-2xl"
                  required
                />

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

                <div className="grid grid-cols-2 gap-3 pt-2 shrink-0">
                  <button
                    type="button"
                    onClick={closeSheet}
                    className="h-12 rounded-2xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <Button type="button" onClick={handleAddVehicle} className="h-12 rounded-2xl text-sm font-semibold">
                    {sheetMode === 'edit' ? 'Save Changes' : 'Add Vehicle'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingLayout>
  );
};
