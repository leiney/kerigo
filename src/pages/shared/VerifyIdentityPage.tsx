import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent } from '@stackloop/ui';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  ChevronRight, 
  ChevronLeft,
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { sharedApi } from '../../../lib/api';

type VerificationMethod = 'sms' | 'email' | 'authenticator';

export const VerifyIdentityPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [verificationMethods, setVerificationMethods] = useState<Array<{
    id: VerificationMethod;
    title: string;
    description: string;
    icon: React.ReactNode;
    highlighted: boolean;
  }>>([]);
  const source = (location.state as { source?: 'vendor' | 'rider' } | null)?.source;

  useEffect(() => {
    let isMounted = true;

    const loadMethods = async () => {
      const data = await sharedApi.getVerificationMethods();
      const iconById: Record<VerificationMethod, React.ReactNode> = {
        sms: <MessageSquare className="w-6 h-6" />,
        email: <Mail className="w-6 h-6" />,
        authenticator: <Smartphone className="w-6 h-6" />,
      };

      if (isMounted) {
        setVerificationMethods(
          data.methods.map((method) => ({
            ...method,
            icon: iconById[method.id],
          }))
        );
      }
    };

    loadMethods();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMethodSelect = (method: VerificationMethod) => {
    setSelectedMethod(method);
    if (method === 'sms') {
      navigate(`/otp?method=${method}`, { state: { source } });
      return;
    }

    navigate(`/otp?method=${method}`, { state: { source } });
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased px-5 pb-10 relative overflow-hidden">
      
      {/* Top Navigation */}
      <div className="pt-6 pb-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        {/* Progress Indicator */}
        <div className="flex gap-2">
          <div className="w-8 h-1 bg-primary rounded-full" />
          <div className="w-8 h-1 bg-border rounded-full" />
          <div className="w-8 h-1 bg-border rounded-full" />
        </div>

        {/* Spacer for balance */}
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-4">
        
        {/* Step Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
              1
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Verify Your Identity
            </h1>
          </div>
          
          <p className="text-sm sm:text-base text-foreground/60 leading-relaxed max-w-[320px]">
            Please select one method to verify your identity. This adds an extra layer of security before we complete your authentication.
          </p>
        </motion.div>

        {/* Verification Methods */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {verificationMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMethodSelect(method.id)}
              className={`
                relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
                ${method.highlighted 
                  ? 'bg-primary border-primary shadow-lg shadow-primary/20' 
                  : 'bg-white border-border hover:border-primary/50 hover:shadow-md'}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                  ${method.highlighted ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}
                `}>
                  {method.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-base mb-1 ${method.highlighted ? 'text-white' : 'text-foreground'}`}>
                    {method.title}
                  </h3>
                  <p className={`text-xs leading-tight ${method.highlighted ? 'text-white/80' : 'text-foreground/50'}`}>
                    {method.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className={`w-5 h-5 shrink-0 ${method.highlighted ? 'text-white' : 'text-foreground/40'}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Decorative Leaves Background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden">
        <div className="absolute bottom-8 left-8 w-6 h-6 bg-primary/20 rounded-full blur-xl" />
        <div className="absolute bottom-12 right-12 w-8 h-8 bg-primary/15 rounded-full blur-xl" />
        <div className="absolute bottom-4 left-1/3 w-4 h-4 bg-primary/30 rounded-full blur-lg" />
        <div className="absolute bottom-16 right-1/4 w-5 h-5 bg-primary/25 rounded-full blur-lg" />
        
        {/* Leaf shapes */}
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-12 left-12 w-5 h-5"
        >
          <div className="w-full h-full bg-primary/30 rounded-full blur-md transform -rotate-45" />
        </motion.div>
        
        <motion.div 
          animate={{ 
            y: [0, 8, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-16 w-4 h-4"
        >
          <div className="w-full h-full bg-primary/25 rounded-full blur-md transform rotate-12" />
        </motion.div>
        
        <motion.div 
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-6 right-24 w-5 h-5"
        >
          <div className="w-full h-full bg-primary/35 rounded-full blur-md transform -rotate-12" />
        </motion.div>
      </div>

    </div>
  );
};