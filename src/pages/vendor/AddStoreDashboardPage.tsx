import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@stackloop/ui';
import { ChevronLeft, ImageIcon, Lightbulb, Store, Upload } from 'lucide-react';
import { motion } from 'motion/react';

type FormState = {
  storeName: string;
  description: string;
};

export const AddStoreDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    storeName: '',
    description: '',
  });

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }

    setLogoFile(file);

    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const storeName = formState.storeName.trim();
    const description = formState.description.trim();

    if (!storeName || !description || !logoFile) {
      return;
    }

    navigate('/vendor/products');
  };

  const descriptionCount = formState.description.length;
  const storeNameError = hasAttemptedSubmit && !formState.storeName.trim() ? 'Store name is required.' : '';
  const descriptionError = hasAttemptedSubmit && !formState.description.trim() ? 'Store description is required.' : '';
  const logoError = hasAttemptedSubmit && !logoFile ? 'Store logo is required.' : '';

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-[22px] font-extrabold tracking-tight text-foreground">Add Store</h1>
          <p className="mt-2 text-sm text-foreground/55">Add basic details to create your store.</p>
        </div>

        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 pb-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md rounded-3xl border border-border/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] px-5 py-6"
        >
          <div className="mb-8">
            <h2 className="text-[19px] font-extrabold text-foreground">Basic Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Input
                label="Store Name"
                placeholder="Enter store name"
                value={formState.storeName}
                onChange={(value) => setFormState((current) => ({ ...current, storeName: String(value) }))}
                error={storeNameError}
                leftIcon={<Store className="w-5 h-5 text-foreground/40" />}
                className="h-14 rounded-2xl"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[15px] font-bold text-foreground">
                Store Description <span className="text-error">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={formState.description}
                  onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value.slice(0, 250) }))}
                  placeholder="Describe your store, products and services..."
                  maxLength={250}
                  rows={6}
                  className={`w-full rounded-2xl border bg-white px-4 py-4 pr-14 text-[15px] outline-none transition-colors placeholder:text-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none ${
                    descriptionError ? 'border-error' : 'border-border'
                  }`}
                />
                <span className="absolute bottom-3 right-4 text-[13px] text-foreground/45">{descriptionCount}/250</span>
              </div>
              {descriptionError ? <p className="text-xs text-error">{descriptionError}</p> : null}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[15px] font-bold text-foreground">
                  Store Logo <span className="text-error">*</span>
                </label>
                <p className="mt-2 text-sm text-foreground/55">This will be shown on your store profile.</p>
              </div>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                className="hidden"
                onChange={handleLogoChange}
              />

              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className={`w-full rounded-2xl border-2 border-dashed px-4 py-4 text-left transition-colors ${
                  logoError ? 'border-error/60 bg-error/5' : 'border-border/70 bg-white hover:border-primary/40 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Selected store logo preview" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <ImageIcon className="h-7 w-7" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-foreground">Upload logo</p>
                    <p className="mt-1 text-sm text-foreground/55">PNG, JPG or SVG (Max. 2MB)</p>
                    <p className="mt-1 truncate text-xs text-foreground/40">
                      {logoFile ? logoFile.name : 'Tap to choose a square logo for the best results.'}
                    </p>
                  </div>

                  <Upload className="h-5 w-5 shrink-0 text-foreground/35" />
                </div>
              </button>

              {logoError ? <p className="text-xs text-error">{logoError}</p> : null}

              <div className="flex items-center gap-2 text-sm text-foreground/65">
                <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
                <span>Use a square logo for the best results.</span>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="h-14 w-full rounded-2xl bg-linear-to-r from-[#1b7a14] to-[#0e5f0b] text-lg font-bold shadow-[0_14px_28px_rgba(16,124,18,0.22)]"
              >
                Create Store
              </Button>
            </div>
          </form>
        </motion.div>
      </main>

      <footer className="px-6 pb-6 text-center text-sm text-foreground/60">
        By creating a store, you agree to our <button type="button" className="font-semibold text-primary">Terms &amp; Conditions</button>
      </footer>
    </div>
  );
};

export default AddStoreDashboardPage;