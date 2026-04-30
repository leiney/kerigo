
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import { ArrowLeft, ArrowRight, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export const OTPPage: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(53);

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
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyOTP = () => {
    // In real app verify
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-12">
      <header className="mb-12">
        <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary border border-border mb-8">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-foreground mb-2">Verify Phone Number</h1>
          <p className="text-sm text-foreground/50">
            Enter the 6-digit code sent to <br />
            <span className="font-bold text-foreground/70">+254 712 345 678</span>
          </p>
        </motion.div>
      </header>

      <div className="flex justify-between gap-2 mb-10">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="number"
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-full h-14 bg-secondary border border-border rounded-xl text-center text-xl font-black focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        ))}
      </div>

      <div className="text-center space-y-8">
        <div>
          <p className="text-sm text-foreground/40 font-medium mb-1">Didn't receive code?</p>
          <button className={`text-sm font-bold ${timer > 0 ? 'text-foreground/30' : 'text-primary'}`} disabled={timer > 0}>
            Resend in 00:{timer.toString().padStart(2, '0')}
          </button>
        </div>

        <Button 
          onClick={verifyOTP}
          className="w-full h-14 rounded-2xl text-lg font-bold flex justify-between px-8"
          icon={<ArrowRight className="h-6 w-6" />}
        >
          Verify & Continue
        </Button>
        
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-foreground/40 flex items-center justify-center gap-2 mx-auto">
          <Smartphone className="h-4 w-4" />
          Change phone number
        </button>
      </div>
    </div>
  );
};
