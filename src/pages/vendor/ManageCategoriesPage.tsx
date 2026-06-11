import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Info,
  Trash2, 
} from 'lucide-react';
import { Button, Input, BottomSheet } from '@stackloop/ui';
import { motion } from 'motion/react';
import PullToRefresh from '../../components/PullToRefresh';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../../lib/api';
import type { CategoryItem } from '../../../lib/types';
import { returnImageUrl } from '@/config';

export const ManageCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  const queryClient = useQueryClient();

  const categoriesQuery = useQuery<CategoryItem[]>({
    queryKey: ['vendorCategories'],
    queryFn: categoryApi.getCategories,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryID: string) => categoryApi.deleteCategory(categoryID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorCategories'] });
      setShowDeleteSheet(false);
      setSelectedCategory(null);
    },
  });

  const isLoading = categoriesQuery.isLoading;
  const categories = categoriesQuery.data ?? [];
  const isDeleting = deleteCategoryMutation.status === 'pending';

  const handleDeleteCategory = async (categoryID: string) => {
    deleteCategoryMutation.mutate(categoryID);
  };

  const openDeleteCategorySheet = (category: CategoryItem) => {
    setSelectedCategory(category);
    setShowDeleteSheet(true);
  };

  const filteredCategories = categories.filter((category) => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PullToRefresh onRefresh={async () => { await categoriesQuery.refetch(); }}>
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
              <h1 className="text-xl font-bold leading-tight">Categories</h1>
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
            onChange={(value) => setSearchQuery(String(value))}
            className="pl-10 bg-secondary border-transparent focus:border-primary/30"
          />
        </div>
      </div>

      {/* --- Categories List --- */}
      <div className="px-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-border/50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm bg-secondary/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-1/3 bg-secondary/70 rounded-md mb-2" />
                  <div className="h-3 w-2/3 bg-secondary/60 rounded-md" />
                  <div className="mt-2 h-3 w-1/4 bg-secondary/50 rounded-md" />
                </div>
                <div className="w-4 h-4 rounded-md bg-secondary/60" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {!isLoading && filteredCategories.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-white px-4 py-8 text-center text-sm text-foreground/50">
                No categories found.
              </div>
            )}
            {filteredCategories.map((category, idx) => (
              <motion.div
                key={category.categoryID}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-lg p-3 border border-border/50 flex items-center gap-3"
              >
                <img 
                  src={returnImageUrl(category.image)} 
                  alt={category.name}
                  className="w-12 h-12 rounded-sm object-cover bg-gray-100 shrink-0"
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
                <Trash2 onClick={(event)=> { event.stopPropagation(); openDeleteCategorySheet(category); }} className="w-4 h-4 text-red-400 shrink-0" />
              </motion.div>
            ))}
          </>
        )}
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

      <BottomSheet
        isOpen={showDeleteSheet}
        onClose={() => {
          setShowDeleteSheet(false);
          setSelectedCategory(null);
        }}
        animate={false}
        title="Remove Category?"
        className="z-100"
        showCloseButton={false}
      >
        <div className="pb-8 space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6 text-error" />
            </div>
            <p className="text-sm text-foreground/60">
              This action cannot be undone. The category will be permanently deleted.
            </p>
          </div>

          {selectedCategory && (
            <div className="bg-secondary border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-lg overflow-hidden shrink-0 border border-border">
                <img
                  src={returnImageUrl(selectedCategory.image)}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate">{selectedCategory.name}</h4>
                <p className="text-xs text-foreground/50 line-clamp-2">{selectedCategory.description}</p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-foreground/50">
                  <span>Order #{selectedCategory.displayOrder}</span>
                  <span>•</span>
                  <span className={selectedCategory.status === 'active' ? 'text-primary' : 'text-warning'}>
                    {selectedCategory.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 space-y-3">
            <Button
              className="w-full bg-error text-white font-bold py-3.5 rounded-xl shadow-lg shadow-error/20 gap-2"
              onClick={() => selectedCategory && handleDeleteCategory(selectedCategory.categoryID)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
            <Button variant="outline" className="w-full border-error/20 text-error font-semibold py-3 rounded-xl" onClick={() => setShowDeleteSheet(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </BottomSheet>
      </div>
    </PullToRefresh>
  );
};