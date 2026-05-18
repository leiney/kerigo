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

const StepHeader = ({ number, title, isExpanded, isCompleted, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
      isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {isCompleted ? <Check className="w-3.5 h-3.5" /> : number}
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
        className="bg-background w-full sm:w-[400px] sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-xl"
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

// --- Main Page ---

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    sku: '',
    barcode: '',
    price: '',
    costPrice: '',
    vat: '',
    taxable: false,
    stock: '',
    unit: '',
    lowStockAlert: '',
    description: '',
    status: 'Active',
    visibility: 'Visible',
    returnPolicy: '',
    tags: '',
    shipping: false,
    digital: false,
    featured: false
  });

  // Variant State
  const [variants, setVariants] = useState<any[]>([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<{
    name: string;
    sku: string;
    price: string;
    stock: string;
    image: any;
    attributes: { type: string; values: string[] }[];
  }>({
    name: '',
    sku: '',
    price: '',
    stock: '',
    image: null,
    attributes: []
  });

  // Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showReturnPolicyModal, setShowReturnPolicyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<{ type: string; values: string[] }>({ type: '', values: [] });

  // Helpers
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveVariant = () => {
    setVariants([...variants, { ...currentVariant, id: Date.now() }]);
    setShowVariantModal(false);
    setCurrentVariant({ name: '', sku: '', price: '', stock: '', image: null, attributes: [] });
  };

  const handleDeleteVariant = (id: number) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  // Validation Check (Simple)
  const isStepValid = (step: number) => {
    switch(step) {
      case 2: return !!formData.name && !!formData.category;
      case 3: return !!formData.sku;
      case 4: return !!formData.price;
      case 5: return !!formData.stock && !!formData.unit;
      default: return true;
    }
  };

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
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <StepHeader 
            number={1} title="Media" 
            isExpanded={expandedStep === 1} 
            isCompleted={expandedStep > 1}
            onClick={() => setExpandedStep(expandedStep === 1 ? 0 : 1)} 
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
                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center bg-primary/5 text-center cursor-pointer hover:bg-primary/10 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Drag & drop or tap to upload</p>
                    <p className="text-xs text-foreground/50 mt-1">JPG, PNG or WebP (Max. 5MB)</p>
                    <button className="mt-4 text-primary text-xs font-bold flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add more
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 2: Basic Information */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <StepHeader 
            number={2} title="Basic Information" 
            isExpanded={expandedStep === 2} 
            isCompleted={isStepValid(2)}
            onClick={() => setExpandedStep(2)} 
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
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
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
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <StepHeader 
            number={3} title="Product Identifiers" 
            isExpanded={expandedStep === 3} 
            isCompleted={isStepValid(3)}
            onClick={() => setExpandedStep(3)} 
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
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
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
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <StepHeader 
            number={4} title="Pricing" 
            isExpanded={expandedStep === 4} 
            isCompleted={isStepValid(4)}
            onClick={() => setExpandedStep(4)} 
          />
          <AnimatePresence>
            {expandedStep === 4 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Price (KES) <span className="text-error">*</span></label>
                    <input 
                      type="number" 
                      placeholder="Enter price" 
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">VAT</label>
                      <input 
                        type="number" 
                        placeholder="0%" 
                        className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={formData.vat}
                        onChange={(e) => updateField('vat', e.target.value)}
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.taxable ? 'bg-primary border-primary' : 'border-border'}`}>
                          {formData.taxable && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.taxable} onChange={() => updateField('taxable', !formData.taxable)} />
                        <span className="text-xs font-medium text-foreground/70">Taxable</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Cost Price (KES) <span className="text-foreground/40 font-normal">(Optional)</span></label>
                    <input 
                      type="number" 
                      placeholder="Enter cost price" 
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={formData.costPrice}
                      onChange={(e) => updateField('costPrice', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 5: Inventory */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <StepHeader 
            number={5} title="Inventory" 
            isExpanded={expandedStep === 5} 
            isCompleted={isStepValid(5)}
            onClick={() => setExpandedStep(5)} 
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
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={formData.stock}
                      onChange={(e) => updateField('stock', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Unit <span className="text-error">*</span></label>
                    <button 
                      onClick={() => setShowUnitModal(true)}
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-left text-foreground/60 flex items-center justify-between"
                    >
                      <span>{formData.unit || 'Select unit'}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Low Price Alert (KES) <span className="text-foreground/40 font-normal">(Optional)</span></label>
                    <input 
                      type="number" 
                      placeholder="Enter alert quantity" 
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={formData.lowStockAlert}
                      onChange={(e) => updateField('lowStockAlert', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 6: Description */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <StepHeader 
            number={6} title="Description" 
            isExpanded={expandedStep === 6} 
            isCompleted={!!formData.description}
            onClick={() => setExpandedStep(6)} 
          />
          <AnimatePresence>
            {expandedStep === 6 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0">
                  <textarea 
                    placeholder="Enter product description..." 
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm min-h-[120px] focus:ring-1 focus:ring-primary outline-none resize-none"
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
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <StepHeader 
            number={7} title="Status & Visibility" 
            isExpanded={expandedStep === 7} 
            isCompleted={true}
            onClick={() => setExpandedStep(7)} 
          />
          <AnimatePresence>
            {expandedStep === 7 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Status <span className="text-error">*</span></label>
                    <button 
                      onClick={() => setShowStatusModal(true)}
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-left flex items-center justify-between"
                    >
                      <span className={formData.status === 'Active' ? 'text-primary' : 'text-foreground'}>{formData.status}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Visibility <span className="text-error">*</span></label>
                    <select 
                      className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
                      value={formData.visibility}
                      onChange={(e) => updateField('visibility', e.target.value)}
                    >
                      <option>Visible</option>
                      <option>Hidden</option>
                    </select>
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
                  </div>
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
                  <div className="space-y-3 pt-2 border-t border-border">
                    {[
                      { label: 'Requires Shipping', key: 'shipping', icon: Package },
                      { label: 'Digital Product', key: 'digital', icon: ImageIcon },
                      { label: 'Featured Product', key: 'featured', icon: Tag }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-foreground/80">{item.label}</span>
                        <div 
                          className={`w-10 h-6 rounded-full p-1 transition-colors ${formData[item.key as keyof typeof formData] ? 'bg-primary' : 'bg-gray-200'}`}
                          onClick={() => updateField(item.key, !formData[item.key as keyof typeof formData])}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${formData[item.key as keyof typeof formData] ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 8: Additional Options */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <StepHeader 
            number={8} title="Additional Options" 
            isExpanded={expandedStep === 8} 
            isCompleted={false}
            onClick={() => setExpandedStep(8)} 
          />
          <AnimatePresence>
            {expandedStep === 8 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 text-center text-sm text-foreground/50">
                  No additional options available for this product type.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 9: Product Variants */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <StepHeader 
            number={9} title="Product Variants" 
            isExpanded={expandedStep === 9} 
            isCompleted={variants.length > 0}
            onClick={() => setExpandedStep(9)} 
          />
          <AnimatePresence>
            {expandedStep === 9 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 pt-0 space-y-4">
                  {variants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-border rounded-xl">
                      <Package className="w-8 h-8 text-foreground/30 mb-2" />
                      <p className="text-sm font-semibold text-foreground/60">No variants added yet</p>
                      <p className="text-xs text-foreground/40 mt-1">Add variants like size, weight, color etc.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {variants.map((variant) => (
                        <div key={variant.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
                          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-border">
                            {variant.image ? <img src={variant.image} alt="" className="w-full h-full object-cover rounded-md" /> : <ImageIcon className="w-5 h-5 text-foreground/30" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{variant.name}</p>
                            <p className="text-xs text-foreground/50">SKU: {variant.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">KES {variant.price}</p>
                            <p className="text-xs text-foreground/50">{variant.stock} in stock</p>
                          </div>
                          <button onClick={() => handleDeleteVariant(variant.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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
        <Button className="w-full bg-primary text-white font-bold py-3 rounded-md shadow-lg shadow-primary/20">
          Add Product
        </Button>
      </div>

      {/* --- Modals --- */}

      {/* Category Modal */}
      <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} title="Select Category">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input type="text" placeholder="Search categories..." className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none" />
        </div>
        <div className="space-y-1 max-h-[300px] overflow-y-auto">
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

      {/* Unit Modal */}
      <Modal isOpen={showUnitModal} onClose={() => setShowUnitModal(false)} title="Select Unit">
        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          {UNITS.map((unit) => (
            <label key={unit} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-border">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.unit === unit ? 'border-primary' : 'border-border'}`}>
                {formData.unit === unit && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
              <input type="radio" name="unit" className="hidden" checked={formData.unit === unit} onChange={() => { updateField('unit', unit); setShowUnitModal(false); }} />
              <span className="text-sm text-foreground">{unit}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button className="w-full bg-primary text-white" onClick={() => setShowUnitModal(false)}>Apply</Button>
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
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Variant Name <span className="text-error">*</span></label>
            <input 
              type="text" 
              placeholder="e.g. Size, Color" 
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
              value={currentVariant.name}
              onChange={(e) => setCurrentVariant({...currentVariant, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Variant Image (Optional)</label>
            <div className="border border-dashed border-border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-foreground/40" />
              </div>
              <span className="text-sm text-foreground/60">Upload image</span>
            </div>
          </div>
          
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
            
            {/* Attributes List */}
            {currentVariant.attributes.length > 0 ? (
              <div className="space-y-2">
                {currentVariant.attributes.map((attr: any, idx: number) => (
                  <div key={idx} className="bg-secondary p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-foreground">{attr.type}</span>
                      <button className="text-red-500"><X className="w-3 h-3" /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map((val: string, vIdx: number) => (
                        <span key={vIdx} className="px-2 py-1 bg-white border border-border rounded text-[10px] font-medium flex items-center gap-1">
                          {val}
                          <X className="w-3 h-3 text-foreground/40" />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-foreground/40 text-center py-4">No attributes added</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Price (KES)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none"
                value={currentVariant.price}
                onChange={(e) => setCurrentVariant({...currentVariant, price: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Stock</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none"
                value={currentVariant.stock}
                onChange={(e) => setCurrentVariant({...currentVariant, stock: e.target.value})}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <Button className="w-full bg-primary text-white font-bold" onClick={handleSaveVariant}>Save Variant</Button>
        </div>
      </Modal>

      {/* Add Attribute Modal (Nested inside Variant logic visually, but separate modal for demo) */}
      <Modal isOpen={showAttributeModal} onClose={() => setShowAttributeModal(false)} title="Add Attribute">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Attribute Type <span className="text-error">*</span></label>
            <input 
              type="text" 
              placeholder="Select type" 
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none"
              value={selectedAttribute.type}
              onChange={(e) => setSelectedAttribute({...selectedAttribute, type: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Attribute Value <span className="text-error">*</span></label>
            <input 
              type="text" 
              placeholder="Enter value" 
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm outline-none mb-2"
            />
            <div className="flex gap-2">
              {['S', 'M', 'L'].map(val => (
                <button key={val} className="px-3 py-1 bg-gray-100 rounded text-xs font-bold text-foreground/70 hover:bg-gray-200">{val}</button>
              ))}
              <button className="px-3 py-1 border border-primary text-primary rounded text-xs font-bold">+ Add Value</button>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <Button className="w-full bg-primary text-white font-bold" onClick={() => {
            setCurrentVariant(prev => ({
              ...prev,
              attributes: [...(prev.attributes || []), selectedAttribute]
            }));
            setShowAttributeModal(false);
            setSelectedAttribute({ type: '', values: [] });
          }}>Add Attribute</Button>
        </div>
      </Modal>

    </div>
  );
};

export default AddProductPage;