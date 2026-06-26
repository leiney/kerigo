import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  User,
  Phone,
  Mail,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { Input, Button, Badge, Select } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { profileApi } from '../../../lib/api';

export const PersonalInformation: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    gender: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const data = await profileApi.getPersonalInformation();

      if (isMounted) {
        setFormData(data);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = () => {
    profileApi.updatePersonalInformation(formData).catch(() => undefined);
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="Personal Information"
        rightContent={
          <div className="flex items-center gap-2">
           
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold h-8 px-5"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        }
      />

      <div className="px-4 space-y-6">
        {/* --- Profile Photo Section --- */}
        <div className="flex flex-col items-center pt-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-secondary overflow-hidden border-2 border-border">
              <img
                src="/placeholder-avatar.webp"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-xs font-semibold text-primary mt-3">Profile Photo</p>
        </div>

        {/* --- Form Fields --- */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
           
            <div className="relative">
              <Input
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(value) => setFormData({ ...formData, fullName: String(value) })}
                className="w-full"
                placeholder="Enter your full name"
                leftIcon={<User className="w-4 h-4 text-foreground/40" />}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <div className="relative">
              <Input
                label='Phone Number'
                type="tel"
                value={formData.phoneNumber}
                onChange={(value) => setFormData({ ...formData, phoneNumber: String(value) })}
                className="w-full"
                placeholder="Enter phone number"
                leftIcon={<Phone className="w-4 h-4 text-foreground/40" />} />
            </div>
          </div>

          {/* Email Address */}
          <div>
            
            <div className="relative">
              <Input
                type="email"
                label='Email Address'
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: String(value) })}
                className="w-full"
                placeholder="Enter email address"
                leftIcon={<Mail className="w-4 h-4 text-foreground/40" />}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            
            <div className="relative">
              <Input
                label='Date of Birth'
                type="date"
                leftIcon={<Calendar className="w-4 h-4 text-foreground/40" />}
                value={formData.dateOfBirth}
                onChange={(value) => setFormData({ ...formData, dateOfBirth: String(value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-semibold text-foreground/60 mb-2 block">
              Gender
            </label>
            <div className="relative">
              <Select
                options={[
                  { value: 'Female', label: 'Female' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Other', label: 'Other' },
                  { value: 'Prefer not to say', label: 'Prefer not to say' }
                ]}
                value={formData.gender}
                onChange={(value) => setFormData({ ...formData, gender: String(value) })}
              />
              
             </div>
          </div>
        </div>

        {/* --- Verification Section --- */}
        <div className="pt-4 border-t border-border/50">
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Verification
          </h3>
          <div className="space-y-4">
            {/* Phone Verification */}
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Phone</p>
                  <p className="text-[11px] text-foreground/50">{formData.phoneNumber}</p>
                </div>
              </div>
              <Badge 
                variant="success" 
                className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full"
              >
                <CheckCircle className="w-3 h-3 mr-1 fill-current" />
                Verified
              </Badge>
            </div>

            {/* Email Verification */}
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <p className="text-[11px] text-foreground/50">{formData.email}</p>
                </div>
              </div>
              <Badge 
                variant="success" 
                className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full"
              >
                <CheckCircle className="w-3 h-3 mr-1 fill-current" />
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};