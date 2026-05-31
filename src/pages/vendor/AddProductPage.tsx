import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Check,
  UploadCloud,
  Plus,
  X,
  Search,
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  Info,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  GripVertical,
  AlertCircle
} from 'lucide-react';
import { Button, Badge, Input, Select } from '@stackloop/ui';
import { motion, AnimatePresence } from 'motion/react';
import { productApi } from '../../../lib/api';
import { buildProductFormData, createEmptyProductVariant } from '../../../lib/products';
import type { ProductPayload, ProductVariantPayload } from '../../../lib/types';

// --- Mock Data ---
const CATEGORIES = [
  'Electronics', 'Fashion', 'Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Home & Kitchen', 'Beauty & Personal Care'
];

const UNITS = [
  'Piece', 'Kilogram (kg)', 'Gram (g)', 'Liter (L)', 'Milliliter (ml)', 'Meter (m)', 'Centimeter (cm)', 'Inch (in)'
];

const RETURN_POLICIES = ['7 Days Return', '14 Days Return', '30 Days Return', 'No Return'];

const STATUSES = ['Active', 'Inactive', 'Out of Stock'];

// --- Components ---

const StepHeader = ({ number, title, isExpanded, isCompleted, isInvalid, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
      isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isCompleted ? 'bg-primary text-white' : isInvalid ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-500'
      }`}>
        {isCompleted ? <Check className="w-3.5 h-3.5" /> : isInvalid ? <AlertCircle className="w-3.5 h-3.5" /> : number}
      </div>
      <span className={`font-semibold text-sm ${isExpanded || isCompleted ? 'text-foreground' : 'text-foreground/60'}`}>
        {title}
      </span>
    </div>
    <div className="text-foreground/40">
      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </div>
  </button>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-background w-full sm:w-100 sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-base text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

type VariantDraft = {
  sku: string;
  barcode: string;
  price: string;
  oldPrice: string;
  stock: string;
  unit: string;
  isNew: boolean;
  active: boolean;
  images: File[];
  attributes: { name: string; value: string }[];
};

const createEmptyVariantDraft = (): VariantDraft => ({
  sku: '',
  barcode: '',
  price: '',
  oldPrice: '',
  stock: '',
  unit: '',
  isNew: true,
  active: true,
  images: [],
  attributes: [],
});

const parseList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const toNumber = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const draftToVariantPayload = (draft: VariantDraft): ProductVariantPayload => ({
  sku: draft.sku.trim(),
  barcode: draft.barcode.trim() || '',
  price: toNumber(draft.price),
  oldPrice: toNumber(draft.oldPrice),
  stock: toNumber(draft.stock),
  unit: draft.unit.trim() || undefined,
  isNew: draft.isNew ?? true,
  active: draft.active ?? true,
  images: draft.images,
  attributes: draft.attributes
    .map((attribute) => ({ name: attribute.name.trim(), value: attribute.value.trim() }))
    .filter((attribute) => attribute.name || attribute.value),
});


export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    sku: '',
    barcode: '',
    price: '',
    oldPrice: '',
    costPrice: '',
    stock: '',
    unit: '',
    description: '',
    taxCodes: '',
    ingredients: '',
    status: 'Active',
    returnPolicy: '',
    tags: '',
    returnPolicyMessage: '',
  });

  // Variant State
  const [mediaImages, setMediaImages] = useState<File[]>([]);
  const [variants, setVariants] = useState<ProductVariantPayload[]>([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<VariantDraft>(createEmptyVariantDraft());

  // Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showReturnPolicyModal, setShowReturnPolicyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<{ name: string; value: string }>({ name: '', value: '' });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMediaImages((prev) => [...prev, ...files]);
    event.target.value = '';
  };

  const removeMediaImage = (index: number) => {
    setMediaImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const isVariantDraftEmpty = (draft: VariantDraft) => {
    return (
      !draft.sku && !draft.barcode && !draft.price && !draft.oldPrice && !draft.stock && !draft.unit &&
      draft.images.length === 0 && draft.attributes.length === 0
    );
  };

  const handleSaveVariant = () => {
    const nextVariant = draftToVariantPayload(currentVariant);
    setVariants((prev) => [...prev, nextVariant]);
    setShowVariantModal(false);
    setCurrentVariant(createEmptyVariantDraft());
  };

  const handleDeleteVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setShowValidation(true);

    // collect invalid steps
    const invalidSteps: number[] = [];
    for (let s = 1; s <= 9; s++) {
      if (!isStepValid(s)) invalidSteps.push(s);
    }

    // variant draft partial check (user started a variant but didn't save)
    const draftHasData = !isVariantDraftEmpty(currentVariant);
    if (draftHasData) {
      // consider variant step invalid if draft has data and not saved
      if (variants.length === 0) {
        if (!invalidSteps.includes(9)) invalidSteps.push(9);
      }
    }

    if (invalidSteps.length > 0) {
      setExpandedStep(invalidSteps[0]);
      return;
    }

    setIsSubmitting(true);

    try {
      const primaryVariant = variants[0] ?? draftToVariantPayload(currentVariant);
      const fallbackVariant: ProductVariantPayload = {
        ...primaryVariant,
        sku: formData.sku.trim() || primaryVariant.sku,
        barcode: formData.barcode.trim() || primaryVariant.barcode || '',
        price: toNumber(formData.price, primaryVariant.price),
        oldPrice: toNumber(formData.oldPrice, primaryVariant.oldPrice),
        stock: toNumber(formData.stock, primaryVariant.stock),
        unit: formData.unit.trim() || primaryVariant.unit,
        images: mediaImages.length > 0 ? mediaImages : primaryVariant.images,
      };

      const productPayload: ProductPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: [
          {
            name: formData.category.trim(),
          },
        ],
        tags: parseList(formData.tags),
        returnPolicy: {
          isReturnable: formData.returnPolicy !== 'No Return',
          message:
            formData.returnPolicy === 'No Return'
              ? (formData.returnPolicyMessage.trim() || 'No return reason not provided.')
              : `${formData.returnPolicy || 'Selected'} applies to this product.`,
        },
        active: formData.status === 'Active',
        taxCodes: parseList(formData.taxCodes),
        info: {
          ingredients: parseList(formData.ingredients),
        },
        variants: variants.length > 0 ? variants : [fallbackVariant],
      };

      
      // nimeLog payload na FormData entries for debugging
      console.log('Product payload (normalized):', productPayload);
      const formPayload = buildProductFormData(productPayload);
      console.log('FormData entries:');
      for (const entry of formPayload.entries()) {
        const [key, value] = entry as [string, any];
        if (value instanceof File) {
          console.log(key, 'File:', value.name, value.size, value.type);
        } else {
          console.log(key, value);
        }
      }

      await productApi.createProduct(formPayload);
      navigate('/vendor/products', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number) => {
    switch(step) {
      case 2: return !!formData.name;
      case 3: return !!formData.sku;
      case 4: return !!formData.price;
      case 5: return !!formData.stock;
      case 7: return !!formData.status;
      case 8: return true;
      default: return true;
    }
  };

  const isMissingRequired = (value: string) => showValidation && !value.trim();
  const isVariantStepInvalid = showValidation && !(variants.length > 0) && !isVariantDraftEmpty(currentVariant);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-32">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-40 px-4 py-4 border-b border-border/50 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg">Add New Product</h1>
          <p className="text-[11px] text-foreground/50">Add all the details to create a new product.</p>
        </div>
        <div className="w-8" /> {/* Spacer for balance */}
      </header>

      {/* Content */}
      <div className="px-4 pt-2 space-y-2">
        
        {/* Step 1: Media */}
        <div className={`bg-white rounded-xl border overflow-hidden ${showValidation && !isStepValid(1) ? 'border-red-400' : 'border-border'}`}>
          <StepHeader 
            number={1} title="Media" 
            isExpanded={expandedStep === 1} 
            isCompleted={mediaImages.length > 0}
            isInvalid={showValidation && !isStepValid(1)}
            onClick={() => setExpandedStep((prev) => (prev === 1 ? 0 : 1))} 
          />
          <AnimatePresence>
            {expandedStep === 1 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-4">
                  <input
                    ref={mediaInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaUpload}
                  />
                  <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center bg-primary/5 text-center hover:bg-primary/10 transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Drag & drop or tap to upload</p>
                    <p className="text-xs text-foreground/50 mt-1">JPG, PNG or WebP (Max. 5MB)</p>
                    <span className="mt-4 text-primary text-xs font-bold flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add more
                    </span>
                  </button>
                  {mediaImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {mediaImages.map((image, index) => (
                        <div key={`${image.name}-${index}`} className="relative rounded-lg overflow-hidden border border-border bg-secondary aspect-square">
                          <img src={URL.createObjectURL(image)} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeMediaImage(index)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 2: Basic Information */}
        <div className={`bg-white rounded-xl border overflow-hidden ${showValidation && !isStepValid(2) ? 'border-red-400' : 'border-border'}`}>
          <StepHeader 
            number={2} title="Basic Information" 
            isExpanded={expandedStep === 2} 
            isCompleted={isStepValid(2)}
            isInvalid={showValidation && !isStepValid(2)}
            onClick={() => setExpandedStep((prev) => (prev === 2 ? 0 : 2))} 
          />
          <AnimatePresence>
            {expandedStep === 2 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Product Name <span className="text-error">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Enter product name" 
                      className={`w-full px-3 py-2.5 bg-secondary border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all ${
                        isMissingRequired(formData.name) ? 'border-red-400' : 'border-border'
                      }`}
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Product Category <span className="text-error">*</span></label>
                    <button 
                      onClick={() => setShowCategoryModal(true)}
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-left text-foreground/60 flex items-center justify-between hover:bg-gray-100"
                    >
                      <span>{formData.category || 'Select category'}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Brand <span className="text-foreground/40 font-normal">(Optional)</span></label>
                    <input 
                      type="text" 
                      placeholder="Select or enter brand" 
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      value={formData.brand}
                      onChange={(e) => updateField('brand', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 3: Product Identifiers */}
        <div className={`bg-white rounded-xl border overflow-hidden ${showValidation && !isStepValid(3) ? 'border-red-400' : 'border-border'}`}>
          <StepHeader 
            number={3} title="Product Identifiers" 
            isExpanded={expandedStep === 3} 
            isCompleted={isStepValid(3)}
            isInvalid={showValidation && !isStepValid(3)}
            onClick={() => setExpandedStep((prev) => (prev === 3 ? 0 : 3))} 
          />
          <AnimatePresence>
            {expandedStep === 3 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">SKU <span className="text-error">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Enter SKU" 
                      className={`w-full px-3 py-2.5 bg-secondary border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none ${
                        isMissingRequired(formData.sku) ? 'border-red-400' : 'border-border'
                      }`}
                      value={formData.sku}
                      onChange={(e) => updateField('sku', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Barcode <span className="text-foreground/40 font-normal">(Optional)</span></label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter barcode number" 
                        className="flex-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={formData.barcode}
                        onChange={(e) => updateField('barcode', e.target.value)}
                      />
                      <button className="p-2.5 bg-secondary border border-border rounded-lg text-primary hover:bg-gray-100">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 4: Pricing */}
        <div className={`bg-white rounded-xl border overflow-hidden ${showValidation && !isStepValid(4) ? 'border-red-400' : 'border-border'}`}>
          <StepHeader 
            number={4} title="Pricing" 
            isExpanded={expandedStep === 4} 
            isCompleted={isStepValid(4)}
            isInvalid={showValidation && !isStepValid(4)}
            onClick={() => setExpandedStep((prev) => (prev === 4 ? 0 : 4))} 
          />
          <AnimatePresence>
            {expandedStep === 4 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Price (KES) <span className="text-error">*</span></label>
                      <input 
                        type="number" 
                        placeholder="Enter price" 
                        className={`w-full px-3 py-2.5 bg-secondary border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none ${
                          isMissingRequired(formData.price) ? 'border-red-400' : 'border-border'
                        }`}
                        value={formData.price}
                        onChange={(e) => updateField('price', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Old Price <span className="text-foreground/40 font-normal">(Optional)</span></label>
                      <input 
                        type="number" 
                        placeholder="Enter old price" 
                        className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={formData.oldPrice}
                        onChange={(e) => updateField('oldPrice', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 5: Inventory */}
        <div className={`bg-white rounded-xl border overflow-hidden ${showValidation && !isStepValid(5) ? 'border-red-400' : 'border-border'}`}>
          <StepHeader 
            number={5} title="Inventory" 
            isExpanded={expandedStep === 5} 
            isCompleted={isStepValid(5)}
            isInvalid={showValidation && !isStepValid(5)}
            onClick={() => setExpandedStep((prev) => (prev === 5 ? 0 : 5))} 
          />
          <AnimatePresence>
            {expandedStep === 5 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Stock Quantity <span className="text-error">*</span></label>
                    <input 
                      type="number" 
                      placeholder="Enter stock quantity" 
                      className={`w-full px-3 py-2.5 bg-secondary border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none ${
                        isMissingRequired(formData.stock) ? 'border-red-400' : 'border-border'
                      }`}
                      value={formData.stock}
                      onChange={(e) => updateField('stock', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Unit <span className="text-foreground/40 font-normal">(Optional)</span></label>
                    <select
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
                      value={formData.unit}
                      onChange={(e) => updateField('unit', e.target.value)}
                    >
                      <option value="">Select unit</option>
                      {UNITS.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 6: Description */}
        <div className={`bg-white rounded-xl border overflow-hidden ${showValidation && !isStepValid(6) ? 'border-red-400' : 'border-border'}`}>
          <StepHeader 
            number={6} title="Description" 
            isExpanded={expandedStep === 6} 
            isCompleted={!!formData.description}
            isInvalid={showValidation && !isStepValid(6)}
            onClick={() => setExpandedStep((prev) => (prev === 6 ? 0 : 6))} 
          />
          <AnimatePresence>
            {expandedStep === 6 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0">
                  <textarea 
                    placeholder="Enter product description..." 
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm min-h-30 focus:ring-1 focus:ring-primary outline-none resize-none"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                  />
                  <div className="flex items-center justify-between mt-2 text-[10px] text-foreground/40">
                    <span>{formData.description.length}/500</span>
                    <div className="flex gap-3 font-bold">
                      <span>B</span><span>I</span><span>U</span><span>S</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 7: Status & Visibility */}
        <div className={`bg-white rounded-xl border overflow-hidden ${showValidation && !isStepValid(7) ? 'border-red-400' : 'border-border'}`}>
          <StepHeader 
            number={7} title="Status" 
            isExpanded={expandedStep === 7} 
            isCompleted={isStepValid(7)}
            isInvalid={showValidation && !isStepValid(7)}
            onClick={() => setExpandedStep((prev) => (prev === 7 ? 0 : 7))} 
          />
          <AnimatePresence>
            {expandedStep === 7 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Status <span className="text-error">*</span></label>
                    <button 
                      onClick={() => setShowStatusModal(true)}
                      className={`w-full px-3 py-2.5 bg-secondary border rounded-lg text-sm text-left flex items-center justify-between ${
                        isMissingRequired(formData.status) ? 'border-red-400' : 'border-border'
                      }`}
                    >
                      <span className={formData.status === 'Active' ? 'text-primary' : 'text-foreground'}>{formData.status}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Return Policy <span className="text-foreground/40 font-normal">(Optional)</span></label>
                    <button 
                      onClick={() => setShowReturnPolicyModal(true)}
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-left text-foreground/60 flex items-center justify-between"
                    >
                      <span>{formData.returnPolicy || 'Select return policy'}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {formData.returnPolicy === 'No Return' && (
                      <div className="mt-3">
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">No Return Message</label>
                        <textarea
                          placeholder="Why is this item not returnable?"
                          className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm min-h-24 focus:ring-1 focus:ring-primary outline-none resize-none"
                          value={formData.returnPolicyMessage}
                          onChange={(e) => updateField('returnPolicyMessage', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 8: Additional Options */}
        <div className={`bg-white rounded-xl border overflow-hidden ${showValidation && !isStepValid(8) ? 'border-red-400' : 'border-border'}`}>
          <StepHeader 
            number={8} title="Additional Options" 
            isExpanded={expandedStep === 8} 
            isCompleted={!!formData.tags || !!formData.taxCodes || !!formData.ingredients}
            isInvalid={showValidation && !isStepValid(8)}
            onClick={() => setExpandedStep((prev) => (prev === 8 ? 0 : 8))} 
          />
          <AnimatePresence>
            {expandedStep === 8 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Tags <span className="text-foreground/40 font-normal">(Optional)</span></label>
                    <input
                      type="text"
                      placeholder="Select or add tags"
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={formData.tags}
                      onChange={(e) => updateField('tags', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Tax Codes <span className="text-foreground/40 font-normal">(Optional)</span></label>
                    <input
                      type="text"
                      placeholder="VAT16, FOOD01"
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={formData.taxCodes}
                      onChange={(e) => updateField('taxCodes', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Ingredients <span className="text-foreground/40 font-normal">(Optional)</span></label>
                    <textarea
                      placeholder="Chicken, Flour Coating, Herbs & Spices"
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm min-h-24 focus:ring-1 focus:ring-primary outline-none resize-none"
                      value={formData.ingredients}
                      onChange={(e) => updateField('ingredients', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 9: Product Variants */}
        <div className={`bg-white rounded-xl border overflow-hidden ${isVariantStepInvalid ? 'border-red-400' : 'border-border'}`}>
          <StepHeader 
            number={9} title="Product Variants" 
            isExpanded={expandedStep === 9} 
            isCompleted={variants.length > 0}
            isInvalid={isVariantStepInvalid}
            onClick={() => setExpandedStep((prev) => (prev === 9 ? 0 : 9))} 
          />
          <AnimatePresence>
            {expandedStep === 9 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  {variants.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center py-6 text-center border-2 border-dashed rounded-xl ${
                      isVariantStepInvalid ? 'border-red-400' : 'border-border'
                    }`}>
                      <Package className="w-8 h-8 text-foreground/30 mb-2" />
                      <p className="text-sm font-semibold text-foreground/60">No variants added yet</p>
                      <p className="text-xs text-foreground/40 mt-1">Add variants like size, weight, color etc.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {variants.map((variant, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
                          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-border">
                            {typeof variant.images[0] === 'string' ? (
                              <img src={variant.images[0]} alt="" className="w-full h-full object-cover rounded-md" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-foreground/30" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{variant.sku || 'Variant'}</p>
                            <p className="text-xs text-foreground/50">SKU: {variant.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">KES {variant.price}</p>
                            <p className="text-xs text-foreground/50">{variant.stock} in stock</p>
                          </div>
                          <button onClick={() => handleDeleteVariant(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 text-primary hover:bg-primary/5 font-semibold gap-1"
                    onClick={() => setShowVariantModal(true)}
                  >
                    <Plus className="w-4 h-4" /> Add Variant
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Sticky Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border z-30">
        <Button
          className="w-full bg-primary text-white font-bold py-3 rounded-md shadow-lg shadow-primary/20"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Product...' : 'Add Product'}
        </Button>
      </div>

      {/* --- Modals --- */}

      {/* Category Modal */}
      <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} title="Select Category">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input type="text" placeholder="Search categories..." className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none" />
        </div>
        <div className="space-y-1 max-h-75 overflow-y-auto">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.category === cat ? 'bg-primary border-primary' : 'border-border'}`}>
                {formData.category === cat && <Check className="w-3 h-3 text-white" />}
              </div>
              <input type="radio" name="category" className="hidden" checked={formData.category === cat} onChange={() => { updateField('category', cat); setShowCategoryModal(false); }} />
              <span className="text-sm text-foreground">{cat}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button className="w-full bg-primary text-white" onClick={() => setShowCategoryModal(false)}>Apply</Button>
        </div>
      </Modal>

      {/* Return Policy Modal */}
      <Modal isOpen={showReturnPolicyModal} onClose={() => setShowReturnPolicyModal(false)} title="Select Return Policy">
        <div className="space-y-1">
          {RETURN_POLICIES.map((policy) => (
            <label key={policy} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.returnPolicy === policy ? 'border-primary' : 'border-border'}`}>
                {formData.returnPolicy === policy && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
              <input type="radio" name="policy" className="hidden" checked={formData.returnPolicy === policy} onChange={() => { updateField('returnPolicy', policy); setShowReturnPolicyModal(false); }} />
              <span className="text-sm text-foreground">{policy}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button className="w-full bg-primary text-white" onClick={() => setShowReturnPolicyModal(false)}>Apply</Button>
        </div>
      </Modal>

      {/* Status Modal */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Select Status">
        <div className="space-y-1">
          {STATUSES.map((status) => (
            <label key={status} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.status === status ? 'border-primary' : 'border-border'}`}>
                {formData.status === status && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
              <input type="radio" name="status" className="hidden" checked={formData.status === status} onChange={() => { updateField('status', status); setShowStatusModal(false); }} />
              <span className={`text-sm font-medium ${status === 'Active' ? 'text-primary' : status === 'Inactive' ? 'text-warning' : 'text-error'}`}>{status}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button className="w-full bg-primary text-white" onClick={() => setShowStatusModal(false)}>Apply</Button>
        </div>
      </Modal>

      {/* Add Variant Modal */}
      <Modal isOpen={showVariantModal} onClose={() => setShowVariantModal(false)} title="Add Variant">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">SKU <span className="text-error">*</span></label>
              <input
                type="text"
                placeholder="KFC-STREETWISE2"
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
                value={currentVariant.sku}
                onChange={(e) => setCurrentVariant({ ...currentVariant, sku: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Barcode</label>
              <input
                type="text"
                placeholder="6001234567890"
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
                value={currentVariant.barcode}
                onChange={(e) => setCurrentVariant({ ...currentVariant, barcode: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Variant Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="block w-full text-sm text-foreground/70 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white"
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                setCurrentVariant((prev) => ({ ...prev, images: [...prev.images, ...files] }));
                event.currentTarget.value = '';
              }}
            />
            {currentVariant.images.length > 0 && (
              <p className="mt-2 text-xs text-foreground/50">{currentVariant.images.length} file(s) selected</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Price (KES) <span className="text-error">*</span></label>
              <input
                type="number"
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
                value={currentVariant.price}
                onChange={(e) => setCurrentVariant({ ...currentVariant, price: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Old Price</label>
              <input
                type="number"
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
                value={currentVariant.oldPrice}
                onChange={(e) => setCurrentVariant({ ...currentVariant, oldPrice: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Stock Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
                value={currentVariant.stock}
                onChange={(e) => setCurrentVariant({ ...currentVariant, stock: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Unit</label>
              <select
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
                value={currentVariant.unit}
                onChange={(e) => setCurrentVariant({ ...currentVariant, unit: e.target.value })}
              >
                <option value="">Select unit</option>
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Hidden: isNew and active default to true */}

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-foreground">Variant Attributes</label>
              <button
                onClick={() => setShowAttributeModal(true)}
                className="text-xs text-primary font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Attribute
              </button>
            </div>
            {currentVariant.attributes.length > 0 ? (
              <div className="space-y-2">
                {currentVariant.attributes.map((attr, idx) => (
                  <div key={`${attr.name}-${idx}`} className="bg-secondary p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-foreground">{attr.name}</span>
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() =>
                          setCurrentVariant((prev) => ({
                            ...prev,
                            attributes: prev.attributes.filter((_, attributeIndex) => attributeIndex !== idx),
                          }))
                        }
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs text-foreground/60">{attr.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-foreground/40 text-center py-4">No attributes added</p>
            )}
          </div>

        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <Button className="w-full bg-primary text-white font-bold" onClick={handleSaveVariant}>
            Save Variant
          </Button>
        </div>
      </Modal>

      {/* Add Attribute Modal */}
      <Modal isOpen={showAttributeModal} onClose={() => setShowAttributeModal(false)} title="Add Attribute">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Attribute Name <span className="text-error">*</span></label>
            <input
              type="text"
              placeholder="Pieces"
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
              value={selectedAttribute.name}
              onChange={(e) => setSelectedAttribute({ ...selectedAttribute, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Attribute Value <span className="text-error">*</span></label>
            <input
              type="text"
              placeholder="2"
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
              value={selectedAttribute.value}
              onChange={(e) => setSelectedAttribute({ ...selectedAttribute, value: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <Button
            className="w-full bg-primary text-white font-bold"
            onClick={() => {
              setCurrentVariant((prev) => ({
                ...prev,
                attributes: [
                  ...prev.attributes,
                  {
                    name: selectedAttribute.name,
                    value: selectedAttribute.value,
                  },
                ],
              }));
              setShowAttributeModal(false);
              setSelectedAttribute({ name: '', value: '' });
            }}
          >
            Add Attribute
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default AddProductPage;