import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  ChevronRight, 
  Info, 
} from 'lucide-react';
import { Button, Input } from '@stackloop/ui';
import { motion } from 'motion/react';
import { categoryApi } from '../../../lib/api';
import type { CategoryItem } from '../../../lib/types';

export const ManageCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const items = await categoryApi.getCategories();
        if (isMounted) {
          setCategories(items);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories = categories.filter((category) => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-6">
      {/* --- Header --- */}
      <header className="px-4 pt-6 pb-4 flex items-start justify-between sticky top-0 bg-background z-40">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold leading-tight">Manage Product Categories</h1>
              <p className="text-xs text-foreground/50 mt-1">Organize your products into categories</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/vendor/add-category')}
          className="flex flex-col items-center gap-1 shrink-0 ml-4"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <span className="text-[10px] font-bold text-primary">Add Category</span>
        </button>
      </header>

      {/* --- Search Bar --- */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
          <Input
            placeholder="Search categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-transparent focus:border-primary/30"
          />
        </div>
      </div>

      {/* --- Categories List --- */}
      <div className="px-4 space-y-3">
        {!isLoading && filteredCategories.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-white px-4 py-8 text-center text-sm text-foreground/50">
            No categories found.
          </div>
        )}
        {filteredCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="bg-white rounded-xl p-3 border border-border/50 shadow-sm flex items-center gap-3"
          >
            <img 
              src={category.imageUrl} 
              alt={category.name}
              className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-foreground">{category.name}</h3>
              <p className="text-[11px] text-foreground/50 mt-0.5 line-clamp-2">{category.description}</p>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-foreground/40">
                <span>Order #{category.displayOrder}</span>
                <span>•</span>
                <span className={category.status === 'active' ? 'text-primary' : 'text-warning'}>
                  {category.status}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-foreground/30 shrink-0" />
          </motion.div>
        ))}
      </div>

      {/* --- Info Banner --- */}
      <div className="px-4 mt-6">
        <div className="bg-secondary border border-border/50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[11px] text-foreground/60">
            Reorder categories by long pressing and dragging
          </p>
        </div>
      </div>
    </div>
  );
};