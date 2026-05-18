import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Copy,
  MoreVertical,
  LayoutGrid,
  List,
  Package,
  CheckCircle,
  PauseCircle,
  Archive,
  ShoppingBag,
  Trash2,
  Lightbulb,
  X,
  ToggleRight,
  ChevronUp
} from 'lucide-react';
import { Button, Badge, Input, BottomSheet, Toggle } from '@stackloop/ui';
import BottomNav from '../../components/BottomNav';
import { motion, AnimatePresence } from 'motion/react';

// --- Mock Data ---
const products = [
  {
    id: '1',
    name: 'Pishori Rice 2kg',
    category: 'Rice & Grains',
    price: 320.00,
    status: 'Active',
    stock: 45,
    image: '/rice.png'
  },
  {
    id: '2',
    name: 'Sunflower Oil 1L',
    category: 'Oils & Ghee',
    price: 280.00,
    status: 'Active',
    stock: 30,
    image: '/oil.png'
  },
  {
    id: '3',
    name: 'Fresh Milk 500ml',
    category: 'Dairy & Eggs',
    price: 75.00,
    status: 'Active',
    stock: 60,
    image: '/milk.png'
  },
  {
    id: '4',
    name: 'Farm Eggs (12pcs)',
    category: 'Dairy & Eggs',
    price: 260.00,
    status: 'Active',
    stock: 20,
    image: '/eggs.png'
  },
  {
    id: '5',
    name: 'Brown Bread',
    category: 'Bakery',
    price: 135.00,
    status: 'Inactive',
    stock: 0,
    image: '/bread.png'
  },
  {
    id: '6',
    name: 'White Sugar 1kg',
    category: 'Groceries',
    price: 150.00,
    status: 'Out of Stock',
    stock: 0,
    image: '/sugar.png'
  }
];

// --- Filter Bottom Sheet Component ---
const FilterBottomSheet = ({ isOpen, onClose }: any) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Products" showCloseButton={false}>
      <div className="p-4 pb-8 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={onClose} className="text-sm font-medium text-foreground/60 hover:text-foreground">
            Cancel
          </button>
          <button className="text-sm font-medium text-red-500 hover:text-red-600">
            Clear All
          </button>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/70 uppercase tracking-wide">Status</label>
          <div className="grid grid-cols-4 gap-2">
            {['All', 'Active', 'Inactive', 'Out of Stock'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-[10px] font-semibold transition-all ${
                  statusFilter === s
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-white border-border text-foreground/50 hover:bg-gray-50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mb-1.5 ${
                  s === 'Active' ? 'bg-success' : s === 'Inactive' ? 'bg-warning' : s === 'Out of Stock' ? 'bg-error' : 'bg-foreground/30'
                }`} />
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/70 uppercase tracking-wide">Category</label>
          <button className="w-full flex items-center justify-between bg-white border border-border rounded-lg px-3 py-3 text-sm text-foreground">
            <span>All Categories</span>
            <ChevronDown className="w-4 h-4 text-foreground/40" />
          </button>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/70 uppercase tracking-wide">Price Range (KES)</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-foreground/50 ml-1 mb-1 block">Min Price</label>
              <input
                type="number"
                placeholder="Enter min price"
                className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <span className="text-foreground/30 pt-6">-</span>
            <div className="flex-1">
              <label className="text-[10px] text-foreground/50 ml-1 mb-1 block">Max Price</label>
              <input
                type="number"
                placeholder="Enter max price"
                className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stock Quantity */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/70 uppercase tracking-wide">Stock Quantity</label>
          <button className="w-full flex items-center justify-between bg-white border border-border rounded-lg px-3 py-3 text-sm text-foreground">
            <span>All Stock Levels</span>
            <ChevronDown className="w-4 h-4 text-foreground/40" />
          </button>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/70 uppercase tracking-wide">Sort By</label>
          <button className="w-full flex items-center justify-between bg-white border border-border rounded-lg px-3 py-3 text-sm text-foreground">
            <span>Newest First</span>
            <ChevronDown className="w-4 h-4 text-foreground/40" />
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 space-y-3">
          <Button className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20">
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full border-border text-foreground font-semibold py-3 rounded-xl" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};

// --- Duplicate Bottom Sheet Component ---
const DuplicateBottomSheet = ({ isOpen, onClose, product }: any) => {
  const [duplicateImages, setDuplicateImages] = useState(true);
  const [newName, setNewName] = useState(product ? `${product.name} (Copy)` : '');

  if (!product) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Duplicate Product" showCloseButton={false}>
      <div className="p-4 pb-8 space-y-6">
        {/* Description */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Copy className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-foreground/60">
            This will create a copy of this product. You can edit the details before saving.
          </p>
        </div>

        {/* Product Summary Card */}
        <div className="bg-secondary border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-border">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-foreground truncate">{product.name}</h4>
            <p className="text-xs text-foreground/50">{product.category}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-primary">KES {product.price.toFixed(2)}</span>
              <span className="text-xs text-foreground/40">•</span>
              <span className="text-xs text-foreground/50">Stock: {product.stock}</span>
            </div>
          </div>
        </div>

        {/* New Product Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">New Product Name</label>
          <div className="relative">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-3 bg-white border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/40">
              {newName.length}/100
            </span>
          </div>
        </div>

        {/* Duplicate Images Toggle */}
        <div className="flex items-center justify-between bg-secondary p-3 rounded-lg border border-border">
          <span className="text-sm text-foreground">Duplicate product images as well</span>
          <Toggle checked={duplicateImages} onChange={setDuplicateImages} />
        </div>

        {/* Footer */}
        <div className="pt-2 space-y-3">
          <Button className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 gap-2">
            <Copy className="w-4 h-4" /> Duplicate Product
          </Button>
          <Button variant="outline" className="w-full border-primary/20 text-primary font-semibold py-3 rounded-xl" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};

// --- Delete Bottom Sheet Component ---
const DeleteBottomSheet = ({ isOpen, onClose, product }: any) => {
  if (!product) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Remove Product?" showCloseButton={false}>
      <div className="p-4 pb-8 space-y-6">
        {/* Warning */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6 text-error" />
          </div>
          <p className="text-sm text-foreground/60">
            This action cannot be undone. The product will be permanently deleted from your store.
          </p>
        </div>

        {/* Product Summary Card */}
        <div className="bg-secondary border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-border">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-foreground truncate">{product.name}</h4>
            <p className="text-xs text-foreground/50">{product.category}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-foreground/50">Stock: {product.stock}</span>
              <span className="text-xs text-foreground/40">•</span>
              <span className="text-xs font-bold text-primary">KES {product.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 space-y-3">
          <Button className="w-full bg-error text-white font-bold py-3.5 rounded-xl shadow-lg shadow-error/20 gap-2">
            <Trash2 className="w-4 h-4" /> Delete Product
          </Button>
          <Button variant="outline" className="w-full border-error/20 text-error font-semibold py-3 rounded-xl" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};


export const ProductsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Bottom Sheet States
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showDuplicateSheet, setShowDuplicateSheet] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  
  // Selected Product for actions
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const openDuplicate = (product: any) => {
    setSelectedProduct(product);
    setShowDuplicateSheet(true);
  };

  const openDelete = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteSheet(true);
  };

  const tabs = [
    { id: 'all', label: 'All Products', count: 128 },
    { id: 'active', label: 'Active', count: 96 },
    { id: 'inactive', label: 'Inactive', count: 18 },
    { id: 'out-of-stock', label: 'Out of Stock', count: 14 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-0 text-[10px] font-semibold px-2 py-0.5">
            {status}
          </Badge>
        );
      case 'Inactive':
        return (
          <Badge variant="warning" className="bg-orange-50 text-orange-600 border-0 text-[10px] font-semibold px-2 py-0.5">
            {status}
          </Badge>
        );
      case 'Out of Stock':
        return (
          <Badge variant="danger" className="bg-red-50 text-red-600 border-0 text-[10px] font-semibold px-2 py-0.5">
            {status}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-foreground font-sans antialiased pb-24">
      {/* --- Header --- */}
      <header className="bg-white px-4 pt-5 pb-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button className="p-1">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Products</h1>
            <p className="text-xs text-foreground/50">Manage your store products</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-50">
            <Search className="w-5 h-5 text-foreground/60" />
          </button>
          <button className="relative p-2 rounded-full hover:bg-gray-50">
            <Bell className="w-5 h-5 text-foreground/60" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <div className="px-3 space-y-3">
        {/* Store Selector */}
        <div className="bg-white rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 overflow-hidden">
              <img src="/store-avatar.png" alt="FreshMart Grocery" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">FreshMart Grocery</span>
              <span className="bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Open
                <ChevronDown className="w-3 h-3" />
              </span>
            </div>
          </div>
          <Button size="sm" className="bg-primary text-white text-xs font-semibold px-3 h-8 gap-1">
            <Plus className="w-3.5 h-3.5" />
            Add Store
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-xl p-3 grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50/50">
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mb-1.5">
              <ShoppingBag className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-lg font-bold text-foreground">128</span>
            <span className="text-[9px] text-foreground/50 text-center leading-tight">Total Products</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50/50">
            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center mb-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-lg font-bold text-foreground">96</span>
            <span className="text-[9px] text-foreground/50 text-center leading-tight">Active</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50/50">
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center mb-1.5">
              <PauseCircle className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-lg font-bold text-foreground">18</span>
            <span className="text-[9px] text-foreground/50 text-center leading-tight">Inactive</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50/50">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-1.5">
              <Archive className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-lg font-bold text-foreground">14</span>
            <span className="text-[9px] text-foreground/50 text-center leading-tight">Out of Stock</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-xs font-medium text-center transition-all relative ${
                  activeTab === tab.id
                    ? 'text-primary font-semibold'
                    : 'text-foreground/50'
                }`}
              >
                {tab.label} ({tab.count})
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50"
            />
          </div>
          <button className="bg-white border border-border rounded-lg px-3 py-2.5 flex items-center gap-1.5 text-xs font-medium text-foreground/70">
            <List className="w-3.5 h-3.5" />
            Category
          </button>
          {/* Filter Button Trigger */}
          <button 
            onClick={() => setShowFilterSheet(true)}
            className="bg-white border border-border rounded-lg px-3 py-2.5 flex items-center gap-1.5 text-xs font-medium text-foreground/70"
          >
            <Archive className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>

        {/* Add Product & Sort */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:bg-primary/5 text-xs font-semibold gap-1 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Product
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-foreground/60">
              <span>Sort by:</span>
              <button className="flex items-center gap-1 font-medium text-foreground">
                Newest
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="flex bg-white border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-foreground/40'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-foreground/40'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-2">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-3 flex items-center gap-3"
            >
              {/* Product Image */}
              <div className="w-14 h-14 rounded-lg bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
                </div>
                <p className="text-[11px] text-foreground/50">{product.category}</p>
                <p className="text-sm font-bold text-primary mt-0.5">
                  KES {product.price.toLocaleString('.00')}
                </p>
              </div>

              {/* Status & Stock */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                {getStatusBadge(product.status)}
                <span className={`text-[10px] font-medium ${product.stock === 0 ? 'text-red-500' : 'text-foreground/60'}`}>
                  Stock: {product.stock}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50">
                  <Pencil className="w-3.5 h-3.5 text-foreground/50" />
                </button>
                {/* Duplicate Button Trigger */}
                <button 
                  onClick={() => openDuplicate(product)}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50"
                >
                  <Copy className="w-3.5 h-3.5 text-foreground/50" />
                </button>
                
                {/* Dropdown for more options including Delete */}
                <div className="relative">
                  <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50">
                    <MoreVertical className="w-3.5 h-3.5 text-foreground/50" />
                  </button>
                  {/* Note: In a real app, a dropdown menu would render here. 
                      For this demo, we'll put a hidden delete trigger or rely on the dropdown 
                      item to trigger the sheet. 
                      Let's assume the dropdown menu item "Delete" calls openDelete(product). */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1">
          <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground/50 hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-lg text-xs font-medium ${
                1 === page
                  ? 'bg-primary text-white'
                  : 'border border-border text-foreground/60 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <span className="text-foreground/40 text-xs">...</span>
          <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-xs font-medium text-foreground/60 hover:bg-gray-50">
            8
          </button>
          <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground/60 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Remove Store */}
        <button className="w-full py-2.5 flex items-center justify-center gap-2 text-red-500 text-xs font-medium bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50">
          <Trash2 className="w-3.5 h-3.5" />
          Remove Store
        </button>

        {/* Tip */}
        <div className="flex items-start gap-2 bg-green-50/50 rounded-xl p-3 border border-green-100/50">
          <Lightbulb className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-green-700/80 leading-relaxed">
            Keep your products updated to attract more customers and increase sales.
          </p>
        </div>
      </div>

      {/* --- Bottom Sheets --- */}
      <FilterBottomSheet isOpen={showFilterSheet} onClose={() => setShowFilterSheet(false)} />
      <DuplicateBottomSheet isOpen={showDuplicateSheet} onClose={() => setShowDuplicateSheet(false)} product={selectedProduct} />
      <DeleteBottomSheet isOpen={showDeleteSheet} onClose={() => setShowDeleteSheet(false)} product={selectedProduct} />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ProductsDashboard;