import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  GripVertical, 
  ImagePlus 
} from 'lucide-react';
import { Button, Input, Select, Textarea } from '@stackloop/ui';
import { categoryApi } from '../../../lib/api';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      await categoryApi.createCategory({
        image: uploadedImage,
        name: categoryName.trim(),
        description: description.trim(),
        status,
        displayOrder: Number(displayOrder) || 0,
      });

      navigate('/vendor/categories', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      {/* --- Header --- */}
      <header className="px-4 pt-6 pb-4 flex items-center gap-3 sticky top-0 bg-background z-40 border-b border-border/50">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold">Add Category</h1>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* --- Description Text --- */}
        <p className="text-sm text-foreground/60">
          Create a new category to organize your products.
        </p>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* --- Category Image Upload --- */}
        <div>
          <label className="block text-sm font-bold mb-1">Category Image</label>
          <p className="text-xs text-foreground/50 mb-3">Add an image to represent this category</p>
          
          {!uploadedImage ? (
            <div 
              onClick={() => document.getElementById('category-image-upload')?.click()}
              className="border-2 border-dashed border-primary/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <ImagePlus className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-bold text-primary">Upload Image</span>
              <span className="text-xs text-foreground/40 mt-1">PNG, JPG or WEBP (Max 2MB)</span>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-border/50">
              <img 
                src={URL.createObjectURL(uploadedImage)} 
                alt="Preview" 
                className="w-full h-40 object-cover"
              />
              <button 
                onClick={() => setUploadedImage(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
              >
                <span className="text-xs font-bold text-error">✕</span>
              </button>
            </div>
          )}
          
          {/* Hidden file input */}
          <input
            id="category-image-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setUploadedImage(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* --- Category Name --- */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Category Name <span className="text-error">*</span>
          </label>
          <Input
            placeholder="Enter category name"
            value={categoryName}
            onChange={(value) => setCategoryName(String(value))}
            maxLength={50}
            className="bg-white"
          />
          <p className="text-right text-[11px] text-foreground/40 mt-1">
            {categoryName.length}/50
          </p>
        </div>

        {/* --- Description --- */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Description <span className="text-foreground/40 font-normal">(Optional)</span>
          </label>
          <Textarea
            placeholder="Enter category description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={150}
            className="bg-white h-24 resize-none"
          />
          <p className="text-right text-[11px] text-foreground/40 mt-1">
            {description.length}/150
          </p>
        </div>

        {/* --- Display Order --- */}
        <div>
          <label className="block text-sm font-bold mb-1">Display Order</label>
          <p className="text-xs text-foreground/50 mb-3">
            Set the order in which this category will appear
          </p>
          <div className="relative">
            <GripVertical className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
            <Input
              type="number"
              value={displayOrder}
              onChange={(value) => setDisplayOrder(String(value))}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* --- Category Status --- */}
        <div>
          <label className="block text-sm font-bold mb-1">Category Status</label>
          <p className="text-xs text-foreground/50 mb-3">
            Choose whether to show this category
          </p>
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(value) => setStatus(String(value) as 'active' | 'inactive')}
            placeholder="Select status"
            className="w-full"
          />
        </div>

        {/* --- Save Button --- */}
        <Button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-4 rounded-xl shadow-sm shadow-primary/20 mt-8"
          disabled={isSaving}
        >
          {isSaving ? 'Saving Category...' : 'Save Category'}
        </Button>
      </div>
    </div>
  );
};