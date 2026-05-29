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
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';

interface RiderDoc {
  id: string;
  label: string;
  description: string;
  file: File | null;
  fileName: string;
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
    docs: (r.documents || []).map((d: any, i: number) => ({ id: `doc-${i}`, label: d.documentType || 'Document', description: '', file: null, fileName: d.serialNumber || '' })),
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

  const [riders, setRiders] = useState<Rider[]>(() => (storeRiders && storeRiders.length ? storeRiders.map(mapStoreToLocal) : [emptyRider()]));

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
  const [sheetForm, setSheetForm] = useState({ name: '', phone: '', email: '', experience: '' });
  const [sheetDocs, setSheetDocs] = useState<RiderDoc[]>(initialDocs);

  const riderHasAllDocs = (docs: RiderDoc[]) => docs.every((doc) => Boolean(doc.fileName));
  const isRiderComplete = (rider: Rider) => {
    const emailValidation = emailError(rider.email || '');
    return Boolean(rider.name.trim() && rider.phone.trim() && rider.idNumber.trim() && rider.experience && rider.experience.trim() && riderHasAllDocs(rider.docs) && !emailValidation);
  };
  const allRidersValid = riders.length > 0 && riders.every(isRiderComplete);

  const sheetNameError = hasAttemptedContinue ? requiredTextError(sheetForm.name, 'Rider name') : '';
  const sheetPhoneError = hasAttemptedContinue ? phoneError(sheetForm.phone, 'Phone number') : '';
  const sheetEmailError = hasAttemptedContinue ? emailError(sheetForm.email) : '';

  useEffect(() => {
    setRidersInStore(
      riders.map((rider) => ({
        fullName: rider.name,
        phoneNo: rider.phone,
        email: rider.email || '',
        experience: rider.experience || '',
        documents: rider.docs
          .filter((doc) => doc.fileName)
          .map((doc, index) => ({
            documentType: doc.label,
            serialNumber: doc.fileName || `DOC-${index + 1}`,
          })),
      }))
    );

      setRiderDocumentFiles(
        riders.map((rider) =>
          rider.docs.reduce<Record<string, File[]>>((accumulator, doc) => {
            if (doc.file) {
              accumulator[doc.id] = [doc.file];
            }

            return accumulator;
          }, {})
        )
      );
  }, [riders, setRidersInStore, setRiderDocumentFiles]);

  const handleFileUpload = (docId: string, file: File, isSheet: boolean = false, riderIndex = 0) => {
    if (isSheet) {
      const newDocs = sheetDocs.map((d) => (d.id === docId ? { ...d, file, fileName: file.name } : d));
      setSheetDocs(newDocs);
      return;
    }

    const updatedRiders = [...riders];
    const target = updatedRiders[riderIndex] || emptyRider();
    target.docs = target.docs.map((d) => (d.id === docId ? { ...d, file, fileName: file.name } : d));
    updatedRiders[riderIndex] = target;
    setRiders(updatedRiders);
  };

  const handleRemoveFile = (docId: string, isSheet: boolean = false, riderIndex = 0) => {
    if (isSheet) {
      setSheetDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, file: null, fileName: '' } : d)));
      return;
    }

    const updatedRiders = [...riders];
    const target = updatedRiders[riderIndex] || emptyRider();
    target.docs = target.docs.map((d) => (d.id === docId ? { ...d, file: null, fileName: '' } : d));
    updatedRiders[riderIndex] = target;
    setRiders(updatedRiders);
  };

  const handleAddRiderFromSheet = () => {
    if (!sheetForm.name.trim() || !sheetForm.phone.trim() || !sheetForm.email.trim() || emailError(sheetForm.email) || !riderHasAllDocs(sheetDocs)) {
      setHasAttemptedContinue(true);
      return;
    }

    const newRider: Rider = {
      id: Date.now().toString(),
      idNumber: `ID-${Date.now().toString().slice(-6)}`,
      name: sheetForm.name,
      phone: sheetForm.phone,
      email: sheetForm.email || undefined,
      experience: sheetForm.experience || undefined,
      docs: sheetDocs
    };
    setRiders((prev) => [...prev, newRider]);
    setSheetForm({ name: '', phone: '', email: '', experience: '' });
    setSheetDocs(initialDocs);
    setIsSheetOpen(false);
  };

  const handleDeleteRider = (id: string) => {
    setRiders((prev) => {
      const next = prev.filter((r) => r.id !== id);
      return next.length ? next : [emptyRider()];
    });
  };

  useEffect(() => {
    if (!riders || riders.length === 0) {
      setRiders([emptyRider()]);
    }
  }, [riders.length]);

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

        {/* Inline Rider Form (Rider 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-4"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-foreground">Rider 1</h2>
            <button
              onClick={() => { if (riders[0]) handleDeleteRider(riders[0].id); }}
              className="text-xs text-error font-medium hover:opacity-80"
            >
              Remove
            </button>
          </div>

          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={riders[0]?.name ?? ''}
            onChange={(value) => setRiders((prev) => {
              const next = [...prev];
              if (!next[0]) next[0] = emptyRider();
              next[0] = { ...next[0], name: String(value) };
              return next;
            })}
            error={hasAttemptedContinue && !riders[0]?.name.trim() ? 'Full name is required.' : ''}
            className="h-12 rounded-2xl text-sm"
            required
          />

          <div className="pb-6">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              value={riders[0]?.phone ?? ''}
              onChange={(value) => setRiders((prev) => {
                const next = [...prev];
                if (!next[0]) next[0] = emptyRider();
                next[0] = { ...next[0], phone: String(value) };
                return next;
              })}
              defaultCountry="KE"
              error={hasAttemptedContinue && !riders[0]?.phone.trim() ? 'Phone number is required.' : ''}
              className="h-12 rounded-2xl text-sm"
              required
            />
          </div>

          <div className="">
            <Input
              label="ID Number"
              type="text"
              placeholder="Enter ID number"
              value={riders[0]?.idNumber ?? ''}
              onChange={(value) => setRiders((prev) => {
                const next = [...prev];
                if (!next[0]) next[0] = emptyRider();
                next[0] = { ...next[0], idNumber: String(value) };
                return next;
              })}
              error={hasAttemptedContinue && !riders[0]?.idNumber.trim() ? 'ID number is required.' : ''}
              className="h-12 rounded-2xl text-sm"
              required
            />
          </div>


          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={riders[0]?.email ?? ''}
            onChange={(value) => setRiders((prev) => {
              const next = [...prev];
              if (!next[0]) next[0] = emptyRider();
              next[0] = { ...next[0], email: String(value) };
              return next;
            })}
            error={hasAttemptedContinue ? emailError(riders[0]?.email || '') : ''}
            className="h-12 rounded-2xl text-sm"
            required
          />

          <div className="pb-6">
            <Select
              label="Riding Experience"
              placeholder="Select experience"
              options={experienceOptions}
              value={riders[0]?.experience ?? ''}
              onChange={(value) => setRiders((prev) => {
                const next = [...prev];
                if (!next[0]) next[0] = emptyRider();
                next[0] = { ...next[0], experience: String(value) };
                return next;
              })}
              className="rounded-2xl h-12 text-sm"
              error={hasAttemptedContinue && !riders[0]?.experience ? 'Please select riding experience.' : ''}
              required
            />
          </div>

          {/* KYC Documents Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-foreground">
              KYC Documents <span className="text-[10px] text-primary font-normal">(Required)</span>
            </h3>
            {(riders[0]?.docs ?? []).map(doc => (
              <KYCDocUploader key={doc.id} doc={doc} />
            ))}
          </div>
        </motion.div>

        {/* Add Another Rider Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSheetOpen(true)}
          className="w-full max-w-md mt-6 py-3 border-2 border-dashed border-primary/30 rounded-2xl flex items-center justify-center gap-2 text-primary font-medium text-sm hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Another Rider
        </motion.button>

        {/* Added Riders List */}
        {riders.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md mt-6 space-y-3"
          >
            <p className="text-xs font-medium text-foreground/60">
              Added Riders ({riders.length})
            </p>
            
            <div className="space-y-2">
              {riders.map((rider, index) => (
                <div key={rider.id} className="flex items-center gap-3 bg-secondary rounded-2xl p-3">
                  <span className="text-xs text-foreground/50 w-4">{index + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{rider.name}</p>
                    <p className="text-xs text-foreground/50">{rider.phone}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4 text-foreground/60" />
                    </button>
                    <button 
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