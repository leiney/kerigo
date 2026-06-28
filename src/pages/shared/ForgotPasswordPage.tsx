import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@stackloop/ui';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  KeyRound,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { authApi } from '../../../lib/api';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'forgot_password_state';

const maskIdentifier = (value: string, type: 'sms' | 'email'): string => {
  if (!value) return '';
  if (type === 'email') {
    const parts = value.split('@');
    if (parts.length !== 2) return value;
    const name = parts[0] ?? '';
    const domain = parts[1] ?? '';
    if (name.length <= 2) {
      return `${name.substring(0, 1)}**@${domain}`;
    }
    return `${name.substring(0, 2)}***${name.substring(name.length - 1)}@${domain}`;
  } else {
    const digitsOnly = value.replace(/\s+/g, '');
    if (digitsOnly.length <= 6) return digitsOnly;
    const prefixLen = digitsOnly.startsWith('+') ? 4 : 3;
    const prefix = digitsOnly.substring(0, prefixLen);
    const suffix = digitsOnly.substring(digitsOnly.length - 3);
    const stars = '*'.repeat(Math.max(3, digitsOnly.length - prefixLen - 3));
    return `${prefix}${stars}${suffix}`;
  }
};

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1); // 1: Enter Identifier & Password, 2: Enter Code Only
  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [phoneNo, setPhoneNo] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [resetCode, setResetCode] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load state from Capacitor Preferences on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) {
          const parsed = JSON.parse(value);
          if (parsed) {
            setStep(parsed.step || 1);
            setChannel(parsed.channel || 'sms');
            setPassword(parsed.password || '');
            setConfirmPassword(parsed.password || '');
            if (parsed.channel === 'email') {
              setEmail(parsed.identifier || '');
            } else {
              setPhoneNo(parsed.identifier || '');
            }
          }
        }
      } catch (err) {
        console.error('Error loading forgot password state:', err);
      }
    };
    loadState();
  }, []);

  // Save state to Capacitor Preferences
  const saveState = async (nextStep: number, nextIdentifier: string, nextChannel: 'sms' | 'email', nextPassword?: string) => {
    try {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify({
          step: nextStep,
          identifier: nextIdentifier,
          channel: nextChannel,
          password: nextPassword || password,
        }),
      });
    } catch (err) {
      console.error('Error saving forgot password state:', err);
    }
  };

  // Clear state from Capacitor Preferences
  const clearStoredState = async () => {
    try {
      await Preferences.remove({ key: STORAGE_KEY });
    } catch (err) {
      console.error('Error clearing forgot password state:', err);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const identifier = channel === 'email' ? email.trim() : phoneNo.trim();
    if (!identifier) {
      setErrorMessage(channel === 'email' ? 'Please enter your email address' : 'Please enter your phone number');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a new password');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const payload = {
      data: channel === 'email' ? { email: identifier } : { phoneNo: identifier },
      channel,
    };

    try {
      await authApi.resetCode(payload);
      setSuccessMessage(`Reset code sent to your ${channel === 'email' ? 'email address' : 'phone number'}`);
      await saveState(2, identifier, channel, password);
      setStep(2);
    } catch (error: any) {
      console.error('Reset code request failed:', error);
      setErrorMessage(error?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const identifier = channel === 'email' ? email.trim() : phoneNo.trim();
    const code = resetCode.trim();

    if (!code) {
      setErrorMessage('Please enter the verification code');
      setIsLoading(false);
      return;
    }

    const payload = {
      data: {
        ...(channel === 'email' ? { email: identifier } : { phoneNo: identifier }),
        resetCode: code,
        password,
      },
      channel,
    };

    try {
      await authApi.changeForgottenPassword(payload);
      setSuccessMessage('Your password has been changed successfully!');
      await clearStoredState();
      
      // Wait briefly for success animation, then redirect to login page
      setTimeout(() => {
        navigate(channel === 'email' ? '/phone-login' : '/login');
      }, 2000);
    } catch (error: any) {
      console.error('Password reset failed:', error);
      setErrorMessage(error?.message || 'Failed to change password. Please verify the code and try again.');
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = async () => {
    const identifier = channel === 'email' ? email : phoneNo;
    await saveState(1, identifier, channel, password);
    setStep(1);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCancel = async () => {
    await clearStoredState();
    navigate(channel === 'email' ? '/phone-login' : '/login');
  };

  const handleBack = () => {
    if (step === 2) {
      handleBackToStep1();
    } else {
      handleCancel();
    }
  };
  // clear state when the user navigates away from the page
  useEffect(() => {
    return () => {
      clearStoredState();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased px-5 pb-10 relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="pt-8 pb-4 flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/75 hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src="kerigo.png" alt="KeriGo Logo" className="h-10 object-contain" />
        </div>

        {/* Hero Section */}
        <section className="flex flex-nowrap items-center gap-4 mb-6 mt-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 min-w-0"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight mb-2">
              Forgot Password
            </h2>
            <p className="text-xs sm:text-sm text-foreground/60 font-medium leading-relaxed">
              {step === 1
                ? 'Enter details along with your new password to receive a code.'
                : 'Enter the verification code to activate your new password.'}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="shrink-0 w-24 h-24 sm:w-28 sm:h-28"
          >
            <img src="shopping-bag.png" alt="Shopping bag" className="w-full h-full object-contain drop-shadow-md" />
          </motion.div>
        </section>

        {/* Error / Success Banners */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 bg-error/10 border border-error/20 rounded-2xl text-xs sm:text-sm text-error font-medium"
          >
            {errorMessage}
          </motion.div>
        )}

        

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSendCode}
              className="space-y-6 relative z-10"
            >
              {/* Channel/Verification Method Tabs */}
              <div className="bg-secondary/40 p-1 rounded-2xl flex border border-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setChannel('sms');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    channel === 'sms'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-foreground/50 hover:text-foreground/80'
                  }`}
                >
                  Phone Number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChannel('email');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    channel === 'email'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-foreground/50 hover:text-foreground/80'
                  }`}
                >
                  Email Address
                </button>
              </div>

              {/* Dynamic Inputs (using tel for phone and email for email address) */}
              {channel === 'sms' ? (
                <div className="space-y-1">
                  <Input
                    type="tel"
                    label="Phone number"
                    placeholder="Enter phone (e.g. +254...)"
                    value={phoneNo}
                    onChange={(val) => setPhoneNo(String(val))}
                    leftIcon={<Phone className="w-5 h-5 text-foreground/40" />}
                  />
                  <p className="text-[11px] text-foreground/40 px-1">We will send a reset code via SMS</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Input
                    type="email"
                    label="Email address"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(val) => setEmail(String(val))}
                    leftIcon={<Mail className="w-5 h-5 text-foreground/40" />}
                    className="rounded-2xl h-14"
                  />
                  <p className="text-[11px] text-foreground/40 px-1">We will send a reset code to this email</p>
                </div>
              )}

              {/* Password Input */}
              <Input
                type="password"
                label="New Password"
                placeholder="Enter password"
                value={password}
                onChange={(val) => setPassword(String(val))}
                leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
                className="rounded-2xl h-14"
              />

              {/* Confirm Password Input */}
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(val) => setConfirmPassword(String(val))}
                leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
                className="rounded-2xl h-14"
              />

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 disabled:opacity-60"
                icon={
                  <ArrowRight className="w-5 h-5" />
                }
                loading={isLoading}
              >
                {isLoading ? 'Requesting Code...' : 'Send Reset Code'}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleResetPassword}
              className="space-y-5 relative z-10"
            >
              <div className="bg-secondary/30 border border-border/40 rounded-2xl p-4 text-center">
                <p className="text-xs sm:text-sm text-foreground/70">
                  Reset code sent to your {channel === 'email' ? 'email address' : 'phone number'}:
                </p>
                <p className="text-sm sm:text-base text-foreground font-extrabold mt-1 tracking-wide">
                  {maskIdentifier(channel === 'email' ? email : phoneNo, channel)}
                </p>
              </div>

              {/* Verification Code Input */}

              <Input
                type="text"
                label="Verification Code"
                placeholder="Enter 6-digit code"
                value={resetCode}
                onChange={(val) => setResetCode(String(val))}
                leftIcon={<KeyRound className="w-5 h-5 text-foreground/40" />}
                className="rounded-2xl h-14"
              />

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 disabled:opacity-60"
              >
                {isLoading ? 'Resetting password...' : 'Verify & Reset Password'}
              </Button>

              {/* Actions row */}
              <div className="flex justify-between items-center px-1 pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="text-primary font-bold hover:underline"
                >
                  Resend Code
                </button>
               
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full mt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="py-4 text-center flex items-center justify-center gap-2 text-xs text-foreground/50 font-medium"
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          Your data is safe and secure with us.
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <div className="absolute bottom-4 left-8 w-6 h-6 bg-primary/20 rounded-full blur-xl" />
        <div className="absolute bottom-8 right-12 w-8 h-8 bg-primary/15 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-1/3 w-4 h-4 bg-primary/30 rounded-full blur-lg" />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
