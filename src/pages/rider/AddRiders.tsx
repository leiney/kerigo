import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select, BottomSheet } from '@stackloop/ui';
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

interface RiderDoc {
  id: string;
  label: string;
  description: string;
  file: File | null;
  fileName: string;
}

interface Rider {
  id: string;
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
  
  const [riders, setRiders] = useState<Rider[]>([
    { id: '1', name: 'John Doe', phone: '+254 712 345 678', email: 'john.doe@email.com', experience: '1-3', docs: initialDocs },
    { id: '2', name: 'Michael Kimani', phone: '+254 723 456 789', email: '', experience: '', docs: initialDocs }
  ]);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetForm, setSheetForm] = useState({ name: '', phone: '', email: '', experience: '' });
  const [sheetDocs, setSheetDocs] = useState<RiderDoc[]>(initialDocs);

  const handleFileUpload = (docId: string, file: File, isSheet: boolean = false) => {
    const updateDocs = isSheet ? sheetDocs : riders[0].docs;
    const newDocs = updateDocs.map(d => 
      d.id === docId ? { ...d, file, fileName: file.name } : d
    );
    if (isSheet) setSheetDocs(newDocs);
    else {
      const updatedRiders = [...riders];
      updatedRiders[0].docs = newDocs;
      setRiders(updatedRiders);
    }
  };

  const handleRemoveFile = (docId: string, isSheet: boolean = false) => {
    const updateDocs = isSheet ? sheetDocs : riders[0].docs;
    const newDocs = updateDocs.map(d => 
      d.id === docId ? { ...d, file: null, fileName: '' } : d
    );
    if (isSheet) setSheetDocs(newDocs);
    else {
      const updatedRiders = [...riders];
      updatedRiders[0].docs = newDocs;
      setRiders(updatedRiders);
    }
  };

  const handleAddRiderFromSheet = () => {
    const newRider: Rider = {
      id: Date.now().toString(),
      name: sheetForm.name,
      phone: sheetForm.phone,
      email: sheetForm.email || undefined,
      experience: sheetForm.experience || undefined,
      docs: sheetDocs
    };
    setRiders([...riders, newRider]);
    setSheetForm({ name: '', phone: '', email: '', experience: '' });
    setSheetDocs(initialDocs);
    setIsSheetOpen(false);
  };

  const handleDeleteRider = (id: string) => {
    setRiders(riders.filter(r => r.id !== id));
  };

  const handleContinue = () => {
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
            <button className="text-xs text-error font-medium hover:opacity-80">Remove</button>
          </div>

          <Input
            label="Full Name"
            placeholder="Enter full name"
            value=""
            onChange={() => {}}
            className="h-12 rounded-2xl text-sm"
          />

          <div className="pb-4">
            <Input
              label="Phone Number"
              type="phone"
              placeholder="Enter phone number"
              value=""
              onChange={() => {}}
              defaultCountry="KE"
              className="h-12 rounded-2xl text-sm"
            />
          </div>


          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="Enter email address"
            value=""
            onChange={() => {}}
            className="h-12 rounded-2xl text-sm"
          />

          <div className="pb-4">
            <Select
              label="Riding Experience"
              placeholder="Select experience"
              options={experienceOptions}
              value=""
              onChange={() => {}}
              className="rounded-2xl h-12 text-sm"
            />
          </div>

          {/* KYC Documents Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-foreground">
              KYC Documents <span className="text-[10px] text-primary font-normal">(Required)</span>
            </h3>
            {riders[0].docs.map(doc => (
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

      {/* Bottom Sheet for Adding New Rider */}
      <BottomSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title="Add New Rider"
        showCloseButton={true}
        animate={false}
      >
        <div className="p-6 space-y-4 pb-8">
          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={sheetForm.name}
            onChange={(v) => setSheetForm({ ...sheetForm, name: String(v) })}
            className="h-12 rounded-2xl text-sm"
          />
          <div className="pb-6">
            <Input
              label="Phone Number"
              type="phone"
              placeholder="Enter phone number"
              value={sheetForm.phone}
              onChange={(v) => setSheetForm({ ...sheetForm, phone: String(v) })}
              defaultCountry="KE"
              className="h-12 rounded-2xl text-sm"
            />
          </div>
          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="Enter email address"
            value={sheetForm.email}
            onChange={(v) => setSheetForm({ ...sheetForm, email: String(v) })}
            className="h-12 rounded-2xl text-sm"
          />
          <div className="pb-6">
            <Select
              label="Riding Experience (Optional)"
              placeholder="Select experience"
              options={experienceOptions}
              value={sheetForm.experience}
              onChange={(v) => setSheetForm({ ...sheetForm, experience: String(v) })}
              className="rounded-2xl h-12 text-sm"
            />
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-foreground">
              KYC Documents <span className="text-[10px] text-primary font-normal">(Required)</span>
            </h3>
            {sheetDocs.map(doc => (
              <KYCDocUploader key={doc.id} doc={doc} isSheet={true} />
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-2xl text-sm font-medium"
              onClick={() => setIsSheetOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-12 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20"
              onClick={handleAddRiderFromSheet}
            >
              Add Rider
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Footer / Action Button */}
      <div className="absolute bottom-0 w-full p-6 pb-8 bg-white border-t border-border/50">
        <Button 
          onClick={handleContinue}
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};