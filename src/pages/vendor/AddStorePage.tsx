import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  UploadCloud, 
  Lightbulb, 
  AlertCircle 
} from 'lucide-react';
import { Button, Input, Textarea } from '@stackloop/ui';

export const AddStorePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Form State
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);

  // Character count for description
  const charCount = description.length;
  const maxChars = 250;

  return (
    <div className="min-h-screen bg-secondary text-foreground font-sans antialiased pb-24">
      
      {/* --- Header --- */}
      <header className="sticky top-0 bg-background/90 backdrop-blur-md z-40 px-4 py-5 flex items-center justify-between border-b border-border">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-foreground">Add Store</h1>
          <p className="text-xs text-foreground/60 mt-0.5">Add basic details to create your store.</p>
        </div>
        <div className="w-8" /> {/* Spacer for balance */}
      </header>

      {/* --- Main Content --- */}
      <div className="p-4 space-y-4">
        
        {/* Card: Basic Details */}
        <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 pb-2">
            <h2 className="font-bold text-sm text-foreground">Basic Details</h2>
          </div>
          
          <div className="p-4 pt-2 space-y-5">
            
            {/* Store Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground block">
                Store Name <span className="text-error ml-0.5">*</span>
              </label>
              <Input
                placeholder="Enter store name"
                value={storeName}
                onChange={ (value) => setStoreName(String(value)) }
                className="bg-secondary border-border focus:border-primary focus:ring-primary/20"
              />
            </div>

            {/* Store Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground block">
                Store Description <span className="text-error ml-0.5">*</span>
              </label>
              <div className="relative">
                <Textarea
                  placeholder="Describe your store, products and services..."
                  value={description}
                  onChange={(val) => setDescription(String(val))}
                  className="bg-secondary border-border focus:border-primary focus:ring-primary/20 min-h-[100px] resize-none pr-12"
                  maxLength={maxChars}
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-foreground/40 pointer-events-none font-medium">
                  {charCount}/{maxChars}
                </div>
              </div>
            </div>

            {/* Store Logo */}
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Store Logo <span className="text-error ml-0.5">*</span>
                </label>
              </div>
              <p className="text-xs text-foreground/50">This will be shown on your store profile.</p>
              
              <div className="mt-1">
                {/* Custom Upload Area */}
                <label className="flex flex-col items-center justify-center w-full h-fit pb-2 border-2 border-dashed border-border rounded-xl cursor-pointer bg-secondary hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <UploadCloud className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Upload logo</p>
                    <p className="text-xs text-foreground/40 mt-1">PNG, JPG or SVG (Max. 2MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.svg" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
                </label>
              </div>
              
              {/* Logo Tip */}
              {logo && (
                <div className="flex items-center gap-2 text-xs text-foreground/60 bg-green-50 p-2 rounded-lg border border-green-100">
                  <AlertCircle className="w-3.5 h-3.5 text-success" />
                  <span>Image selected: {logo.name}</span>
                </div>
              )}
              <div className="flex items-start gap-1.5 text-xs text-foreground/60">
                <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>Use a square logo for the best results.</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- Footer Action --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-30 pb-safe">
        <div className="max-w-md mx-auto space-y-3">
          <Button 
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md shadow-primary/10 text-base"
            onClick={() => {
              // Handle creation logic here
              navigate('/dashboard');
            }}
          >
            Create Store
          </Button>
          <p className="text-[11px] text-center text-foreground/50 leading-relaxed">
            By creating a store, you agree to our{' '}
            <a href="#" className="text-primary font-medium hover:underline">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>

    </div>
  );
};

export default AddStorePage;