import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Upload, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { emailError, phoneError, requiredTextError } from '../../lib/onboardingValidation';
import { generateDocumentSerial } from '../../lib/riderOnboarding';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';

interface RiderDoc {
  id: string;
  label: string;
  description: string;
  file: File | null;
  fileName: string;
  serialNumber?: string;
}

interface Rider {
  id: string;
  idNumber: string;
  name: string;
  phone: string;
  email?: string;
  experience?: string;
  docs: RiderDoc[];
}

const initialDocs: RiderDoc[] = [
  { id: 'nid', label: 'National ID / Passport', description: 'Front and back', file: null, fileName: '' },
  { id: 'license', label: 'Driving License', description: 'Front and back', file: null, fileName: '' },
  { id: 'photo', label: 'Passport Photo', description: 'Clear photo of face', file: null, fileName: '' }
];

const experienceOptions = [
  { value: '0-1', label: 'Less than 1 year' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5+', label: '5+ years' }
];

export const AddRiders: React.FC = () => {
  const navigate = useNavigate();
  const setRidersInStore = useRiderOnboardingStore((state) => state.setRiders);
  const setRiderDocumentFiles = useRiderOnboardingStore((state) => state.setRiderDocumentFiles);
  const storeRiders = useRiderOnboardingStore((state) => state.draft.riders);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);

  const mapStoreToLocal = (r: any, idx: number): Rider => ({
    id: `${Date.now()}-${idx}`,
    idNumber: r.idNumber || `ID-${String(Date.now()).slice(-6)}`,
    name: r.fullName || '',
    phone: r.phoneNo || '',
    email: r.email || '',
    experience: r.experience || '',
    docs: (r.documents || []).map((d: any, i: number) => ({
      id: `doc-${i}`,
      label: d.documentType || 'Document',
      description: '',
      file: null,
      fileName: d.serialNumber || '',
      serialNumber: d.serialNumber || '',
    })),
  });

  const emptyRider = (): Rider => ({
    id: `rider-${Date.now()}`,
    idNumber: `ID-${String(Date.now()).slice(-6)}`,
    name: '',
    phone: '',
    email: '',
    experience: '',
    docs: initialDocs.map((d) => ({ ...d })),
  });

  const [riders, setRiders] = useState<Rider[]>(() => (storeRiders && storeRiders.length ? storeRiders.map(mapStoreToLocal) : []));

  useEffect(() => {
    if (storeRiders && storeRiders.length) {
      setRiders((prev) => {
        // simple check: if prev is empty or differs, replace
        if (prev.length !== storeRiders.length) return storeRiders.map(mapStoreToLocal);
        return prev;
      });
    }
  }, [storeRiders]);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
  const [editingRiderIndex, setEditingRiderIndex] = useState<number | null>(null);
  const [sheetForm, setSheetForm] = useState({ idNumber: '', name: '', phone: '', email: '', experience: '' });
  const [sheetDocs, setSheetDocs] = useState<RiderDoc[]>(initialDocs);

  const riderHasAllDocs = (docs: RiderDoc[]) => docs.every((doc) => Boolean(doc.fileName));
  const isRiderComplete = (rider: Rider) => {
    const emailValidation = emailError(rider.email || '');
    return Boolean(rider.name.trim() && rider.phone.trim() && rider.idNumber.trim() && rider.experience && rider.experience.trim() && riderHasAllDocs(rider.docs) && !emailValidation);
  };
  const allRidersValid = riders.length > 0 && riders.every(isRiderComplete);

  const sheetNameError = hasAttemptedContinue ? requiredTextError(sheetForm.name, 'Rider name') : '';
  const sheetIdNumberError = hasAttemptedContinue ? requiredTextError(sheetForm.idNumber, 'ID number') : '';
  const sheetPhoneError = hasAttemptedContinue ? phoneError(sheetForm.phone, 'Phone number') : '';
  const sheetEmailError = hasAttemptedContinue ? emailError(sheetForm.email) : '';

  useEffect(() => {
    setRidersInStore(
      riders.map((rider) => ({
        idNumber: rider.idNumber,
        fullName: rider.name,
        phoneNo: rider.phone,
        email: rider.email || '',
        experience: rider.experience || '',
        documents: rider.docs
          .filter((doc) => doc.fileName)
          .map((doc, index) => ({
            documentType: doc.label,
            serialNumber: doc.serialNumber || generateDocumentSerial(doc.label, index),
            files: [],
          })),
      }))
    );

      setRiderDocumentFiles(
        riders.map((rider) =>
          rider.docs.reduce<Record<string, File[]>>((accumulator, doc) => {
            if (doc.file && doc.serialNumber) {
              accumulator[doc.serialNumber] = [doc.file];
            }

            return accumulator;
          }, {})
        )
      );
  }, [riders, setRidersInStore, setRiderDocumentFiles]);

  const handleFileUpload = (docId: string, file: File, isSheet: boolean = false, riderIndex = 0) => {
    if (isSheet) {
      const newDocs = sheetDocs.map((d, index) =>
        d.id === docId
          ? { ...d, file, fileName: file.name, serialNumber: d.serialNumber || generateDocumentSerial(d.label, index) }
          : d
      );
      setSheetDocs(newDocs);
      return;
    }

    const updatedRiders = [...riders];
    const target = updatedRiders[riderIndex] || emptyRider();
    target.docs = target.docs.map((d, index) =>
      d.id === docId
        ? { ...d, file, fileName: file.name, serialNumber: d.serialNumber || generateDocumentSerial(d.label, index) }
        : d
    );
    updatedRiders[riderIndex] = target;
    setRiders(updatedRiders);
  };

  const handleRemoveFile = (docId: string, isSheet: boolean = false, riderIndex = 0) => {
    if (isSheet) {
      setSheetDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, file: null, fileName: '', serialNumber: undefined } : d)));
      return;
    }

    const updatedRiders = [...riders];
    const target = updatedRiders[riderIndex] || emptyRider();
    target.docs = target.docs.map((d) => (d.id === docId ? { ...d, file: null, fileName: '', serialNumber: undefined } : d));
    updatedRiders[riderIndex] = target;
    setRiders(updatedRiders);
  };

  const handleAddRiderFromSheet = () => {
    if (!sheetForm.idNumber.trim() || !sheetForm.name.trim() || !sheetForm.phone.trim() || !sheetForm.email.trim() || !sheetForm.experience.trim() || emailError(sheetForm.email) || !riderHasAllDocs(sheetDocs)) {
      setHasAttemptedContinue(true);
      return;
    }

    const newRider: Rider = {
      id: Date.now().toString(),
      idNumber: sheetForm.idNumber.trim(),
      name: sheetForm.name,
      phone: sheetForm.phone,
      email: sheetForm.email || undefined,
      experience: sheetForm.experience || undefined,
      docs: sheetDocs,
    };
    setRiders((prev) => {
      if (sheetMode === 'edit' && editingRiderIndex !== null) {
        return prev.map((rider, index) => (index === editingRiderIndex ? { ...newRider, id: rider.id } : rider));
      }

      return [...prev, newRider];
    });
    setSheetForm({ idNumber: '', name: '', phone: '', email: '', experience: '' });
    setSheetDocs(initialDocs);
    setIsSheetOpen(false);
    setSheetMode('add');
    setEditingRiderIndex(null);
  };

  const handleDeleteRider = (id: string) => {
    setRiders((prev) => {
      const next = prev.filter((r) => r.id !== id);
      return next;
    });
  };

  useEffect(() => {
    if (!riders || riders.length === 0) {
      setRiders([]);
    }
  }, [riders.length]);

  const closeSheet = () => {
    setIsSheetOpen(false);
    setHasAttemptedContinue(false);
    setSheetMode('add');
    setEditingRiderIndex(null);
  };

  const openAddRiderSheet = () => {
    setSheetMode('add');
    setEditingRiderIndex(null);
    setSheetForm({ idNumber: '', name: '', phone: '', email: '', experience: '' });
    setSheetDocs(initialDocs.map((doc) => ({ ...doc, file: null, fileName: '' })));
    setIsSheetOpen(true);
  };

  const openEditRiderSheet = (index: number) => {
    const rider = riders[index];
    if (!rider) {
      return;
    }

    setSheetMode('edit');
    setEditingRiderIndex(index);
    setSheetForm({
      idNumber: rider.idNumber,
      name: rider.name,
      phone: rider.phone,
      email: rider.email || '',
      experience: rider.experience || '',
    });
    setSheetDocs(rider.docs.map((doc) => ({ ...doc })));
    setIsSheetOpen(true);
  };

  const handleContinue = () => {
    if (!allRidersValid) {
      setHasAttemptedContinue(true);
      return;
    }

    navigate('/company/vehicle-information');
  };

  const KYCDocUploader = ({ doc, isSheet = false }: { doc: RiderDoc; isSheet?: boolean }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-foreground">{doc.label}</p>
          <p className="text-[10px] text-foreground/50">{doc.description}</p>
        </div>
        <input
          type="file"
          id={`${isSheet ? 'sheet' : 'inline'}-${doc.id}`}
          accept=".png,.jpg,.jpeg,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(doc.id, file, isSheet);
          }}
        />
        <label 
          htmlFor={`${isSheet ? 'sheet' : 'inline'}-${doc.id}`}
          className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
        >
          Attach
        </label>
      </div>
      
      <AnimatePresence>
        {doc.fileName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-2xl p-2.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs text-foreground/80 truncate flex-1">{doc.fileName}</span>
            <button
              onClick={() => handleRemoveFile(doc.id, isSheet)}
              className="p-1 hover:bg-error/10 rounded-lg transition-colors"
            >
              <X className="w-3 h-3 text-error" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {hasAttemptedContinue && !doc.fileName ? (
        <p className="mt-2 text-xs text-error">Upload this document to continue.</p>
      ) : null}
    </div>
  );

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

        <StepDots currentStep={5} />

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
            <User className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">3</Badge>
            </span>
            Add Riders (Multiple)
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Add details for your riders.
          </p>
        </motion.div>

        {riders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-md space-y-3"
          >
            <p className="text-xs font-medium text-foreground/60">
              Added Riders ({riders.length})
            </p>

            <div className="space-y-2">
              {riders.map((rider, index) => (
                <div key={rider.id} className="flex items-center gap-3 bg-secondary rounded-2xl p-3">
                  <span className="text-xs text-foreground/50 w-4">{index + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{rider.name || 'Unnamed rider'}</p>
                    <p className="text-xs text-foreground/50">{rider.phone || 'No phone number'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => openEditRiderSheet(index)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4 text-foreground/60" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDeleteRider(rider.id)}
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

        {/* Add Another Rider Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddRiderSheet}
          className="w-full max-w-md mt-6 py-3 border-2 border-dashed border-primary/30 rounded-2xl flex items-center justify-center gap-2 text-primary font-medium text-sm hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {riders.length > 0 ? 'Add Another Rider' : 'Add First Rider'}
        </motion.button>

      </div>

      <AnimatePresence>
        {isSheetOpen ? (
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
                    {sheetMode === 'edit' ? 'Edit rider' : riders.length > 0 ? 'Add another rider' : 'Add first rider'}
                  </h2>
                </div>
                <button type="button" onClick={closeSheet} className="p-2 rounded-full hover:bg-secondary transition-colors">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <Input
                  label="ID Number"
                  placeholder="Enter ID number"
                  value={sheetForm.idNumber}
                  onChange={(value) => setSheetForm((prev) => ({ ...prev, idNumber: String(value) }))}
                  error={sheetIdNumberError}
                  className="h-12 rounded-2xl text-sm"
                  required
                />

                <Input
                  label="Full Name"
                  placeholder="Enter full name"
                  value={sheetForm.name}
                  onChange={(value) => setSheetForm((prev) => ({ ...prev, name: String(value) }))}
                  error={sheetNameError}
                  className="h-12 rounded-2xl text-sm"
                  required
                />
                <div className="pb-5">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    value={sheetForm.phone}
                    onChange={(value) => setSheetForm((prev) => ({ ...prev, phone: String(value) }))}
                    defaultCountry="KE"
                    error={sheetPhoneError}
                    className="h-12 rounded-2xl text-sm"
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  value={sheetForm.email}
                  onChange={(value) => setSheetForm((prev) => ({ ...prev, email: String(value) }))}
                  error={sheetEmailError}
                  className="h-12 rounded-2xl text-sm"
                  required
                />

                <div className="pb-7">
                  <Select
                    label="Riding Experience"
                    placeholder="Select experience"
                    options={experienceOptions}
                    value={sheetForm.experience}
                    onChange={(value) => setSheetForm((prev) => ({ ...prev, experience: String(value) }))}
                    className="rounded-2xl h-12 text-sm"
                    error={hasAttemptedContinue && !sheetForm.experience ? 'Please select riding experience.' : ''}
                    required
                  />

                </div>


                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-semibold text-foreground">
                    KYC Documents <span className="text-[10px] text-primary font-normal">(Required)</span>
                  </h3>
                  {(sheetDocs ?? []).map((doc) => (
                    <KYCDocUploader key={doc.id} doc={doc} isSheet />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeSheet}
                    className="h-12 rounded-2xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <Button type="button" onClick={handleAddRiderFromSheet} className="h-12 rounded-2xl text-sm font-semibold">
                    {sheetMode === 'edit' ? 'Save Changes' : 'Add Rider'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>


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