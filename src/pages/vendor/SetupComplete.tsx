import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import { 
  Check, 
  Store, 
  ArrowRight,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

// Confetti component for the celebration effect
const Confetti = () => {
  const pieces = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random(),
    color: i % 3 === 0 ? '#3f940e' : i % 3 === 1 ? '#fbbf24' : '#ef4444'
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ opacity: 0, y: -20, scale: 0 }}
          animate={{ opacity: 1, y: piece.y, scale: 1, rotate: 360 }}
          exit={{ opacity: 0 }}
          transition={{ 
            delay: piece.delay, 
            duration: piece.duration,
            ease: "easeOut"
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            left: `${piece.x}%`, 
            backgroundColor: piece.color 
          }}
        />
      ))}
    </div>
  );
};

export const SetupComplete: React.FC = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
      
      {/* Top Header / Navigation */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
        >
          <Leaf className="w-6 h-6 text-foreground" />
        </button>

        <StepDots currentStep={9} />

        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 flex flex-col items-center justify-center relative">
        
        {/* Confetti Animation */}
        <AnimatePresence>
          {showConfetti && <Confetti />}
        </AnimatePresence>

        {/* Success Icon */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2
          }}
          className="relative mb-8"
        >
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Step Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-xl font-bold text-foreground mb-2">
            <span className="text-primary mr-1">9</span>
            Setup Complete!
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Your account is ready.<br />Start growing your business.
          </p>
        </motion.div>

        {/* Store Illustration */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative w-full max-w-70 mx-auto"
        >
          <div className="bg-primary/10 rounded-3xl p-8 flex items-center justify-center">
            <Store className="w-16 h-16 text-primary" />
          </div>
          
          {/* Decorative leaves */}
          <div className="absolute -bottom-2 -left-4 w-8 h-8 bg-primary/20 rounded-full blur-xl" />
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-primary/30 rounded-full blur-lg" />
        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="p-6 pb-8 bg-white">
        <Button 
          onClick={() => navigate('/vendor/dashboard')}
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Get Started
        </Button>
        
        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-foreground/40 flex items-center justify-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-primary" />
            You can always add or update this information later from your account settings.
          </p>
        </motion.div>
      </div>

    </div>
  );
};