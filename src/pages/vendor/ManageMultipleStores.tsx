import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@stackloop/ui';
import { 
  ChevronLeft, 
  ArrowRight, 
  Plus, 
  LayoutList, 
  Store, 
  CheckCircle2,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { useVendorOnboardingStore } from '../../store/vendorOnboardingStore';

export const ManageMultipleStores: React.FC = () => {
  const navigate = useNavigate();
  const stores = useVendorOnboardingStore((state) => state.draft.stores);
  const removeStore = useVendorOnboardingStore((state) => state.removeStore);
  const canContinue = stores.length > 0;
  

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

        {/* Spacer to balance the header */}
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 flex flex-col items-center">
        
        {/* Step Icon & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">4</Badge>
            </span>
            Manage Multiple Stores
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Add multiple stores and keep them in your onboarding draft.
          </p>
        </motion.div>

        {/* Illustration / Features Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="flex items-start gap-5">
            
           
            {/* Feature Callouts */}
            <div className="flex-1 space-y-4 pt-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                  <Plus className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-xs text-foreground/70 leading-tight font-medium">
                  Add your stores
                </p>
              </div>
              
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                  <LayoutList className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-xs text-foreground/70 leading-tight font-medium">
                  View and switch between stores
                </p>
              </div>
              
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                  <Store className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-xs text-foreground/70 leading-tight font-medium">
                  Manage all store details easily
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => navigate('/vendor/add-store')}
              className="w-full py-3.5 border-2 border-dashed border-primary/40 rounded-2xl text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/60 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Your First Store
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {stores.map((store) => (
              <div key={store.id} className="flex items-center gap-3 bg-secondary rounded-2xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{store.storeName}</p>
                  <p className="text-xs text-foreground/50 truncate">{store.cityTown} · {store.businessType}</p>
                </div>
                <button
                  onClick={() => removeStore(store.id)}
                  className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 text-error rotate-45" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Decorative Leaves at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-2 left-8 w-6 h-6 bg-primary/20 rounded-full blur-xl" />
        <div className="absolute -bottom-4 right-12 w-8 h-8 bg-primary/15 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-1/3 w-4 h-4 bg-primary/30 rounded-full blur-lg" />
      </div>

      {/* Footer / Action Button */}
      <div className="p-6 pb-8 bg-white relative z-10">
        <Button 
          onClick={() => navigate('/vendor/payout-method')}
          disabled={!canContinue}
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          {canContinue ? 'Continue' : 'Add at least one store'}
        </Button>
      </div>

    </div>
  );
};