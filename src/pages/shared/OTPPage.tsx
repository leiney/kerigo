import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import { 
  ArrowLeft, 
  ArrowRight, 
  MessageSquare 
} from 'lucide-react';
import { motion } from 'motion/react';

export const OTPPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(53);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const params = new URLSearchParams(location.search);
  const method = params.get('method') ?? 'sms';
  const source = (location.state as { source?: 'vendor' | 'rider' } | null)?.source;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
      inputRefs.current[Math.min(newOtp.length, 5)]?.focus();
    }
  };

  const verifyOTP = () => {
    const code = otp.join('');
    if (code.length === 6) {
      if (source === 'vendor') {
        navigate('/vendor-landing', { replace: true });
        return;
      }

      if (source === 'rider') {
        navigate('/rider-landing', { replace: true });
        return;
      }

      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased px-5 pb-10 relative overflow-hidden flex flex-col">
      
      {/* Top Navigation */}
      <div className="pt-6 pb-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        {/* Progress Indicator */}
        <div className="flex gap-2">
          <div className="w-8 h-1 bg-primary rounded-full" />
          <div className="w-8 h-1 bg-border rounded-full" />
        </div>

        {/* Spacer for balance */}
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
            Enter verification code
          </h1>
          <p className="text-sm sm:text-base text-foreground/50 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Code sent via {method === 'email' ? 'email' : 'SMS'}.
          </p>
        </motion.div>

        {/* OTP Inputs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between gap-2 sm:gap-3 mb-10"
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              className={`
                w-full h-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl outline-none transition-all duration-200
                ${otp[i] 
                  ? 'bg-primary/5 border-2 border-primary text-primary' 
                  : 'bg-secondary border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'}
              `}
            />
          ))}
        </motion.div>

        {/* Timer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className={`text-sm font-bold ${timer > 0 ? 'text-primary' : 'text-foreground/40'}`}>
            Resend in 00:{timer.toString().padStart(2, '0')}
          </p>
        </motion.div>

        {/* Change Method Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-auto"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Choose a different verification method
          </button>
        </motion.div>

      </div>

      {/* Decorative Leaves Background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden">
        <div className="absolute bottom-16 left-8 w-6 h-6 bg-primary/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-12 w-8 h-8 bg-primary/15 rounded-full blur-xl" />
        <div className="absolute bottom-8 left-1/3 w-4 h-4 bg-primary/30 rounded-full blur-lg" />
        <div className="absolute bottom-24 right-1/4 w-5 h-5 bg-primary/25 rounded-full blur-lg" />
      </div>

      {/* Verify Button (Fixed at bottom) */}
      <div className="relative z-10 mt-8">
        <Button 
          onClick={verifyOTP}
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Verify & Continue
        </Button>
      </div>

    </div>
  );
};