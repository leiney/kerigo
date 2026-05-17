import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import { 
  CheckCircle2, 
  Home, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/rider/dashboard');
  };

  useEffect(() => {
    const t = setTimeout(() => {
      navigate('/rider/dashboard', { replace: true });
    }, 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
      
      {/* Top Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-center">
        <StepDots currentStep={8} totalSteps={8} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        
        {/* Success Icon / Illustration */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="mb-8 relative"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-foreground mb-3 text-center"
        >
          You're all set!
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-foreground/60 text-center max-w-64 leading-relaxed"
        >
          Your rider account has been created successfully. You can now go online and start earning.
        </motion.p>

        {/* Placeholder for Illustration (Scoop image in wireframe) */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.6 }}
           className="mt-8"
        >
           {/* In a real app, an <img /> tag would go here pointing to the scooter asset */}
           <div className="w-40 h-40 bg-primary/5 rounded-full flex items-center justify-center">
              <Home className="w-16 h-16 text-primary/40" />
           </div>
        </motion.div>

      </div>

      {/* Footer Action */}
      <div className="absolute bottom-0 w-full p-6 pb-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={handleGoToDashboard}
            className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};