import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  MoreVertical,
  ChevronRight,
  Edit3,
  Plus,
  Utensils,
  Package,
  DollarSign,
  Calendar,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';
import { Button, Badge } from '@stackloop/ui';
import { motion } from 'motion/react';
import { productApi } from '@/lib/api';
import { ProductPayload } from '@/lib/types';
import { BASE_URL, TENANT_ID } from '@/config';

export const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productApi.getProduct(id);
        setProduct(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageClick = (index: number) => {
    setCurrentImage(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm font-semibold text-foreground/50 animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 gap-4">
        <p className="text-sm font-semibold text-error text-center">{error || 'Product not found.'}</p>
        <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="h-10 rounded-xl">
          Go Back
        </Button>
      </div>
    );
  }

  // Gather unique images across all variants
  const images = (product.variants || []).reduce<string[]>((acc, variant) => {
    (variant.images || []).forEach((imgId) => {
      const url = `${BASE_URL}/resources/download/${imgId.toString()}?tenant-id=${TENANT_ID}`;
      if (!acc.includes(url)) {
        acc.push(url);
      }
    });
    return acc;
  }, []);

  if (images.length === 0) {
    images.push('/logo.png');
  }

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const firstVariant = product.variants?.[0];
  const defaultPrice = firstVariant?.price ?? 0;
  const defaultStock = firstVariant?.stock ?? 0;
  const defaultSku = firstVariant?.sku ?? 'N/A';
  const categoryName = product.category?.[0]?.name ?? 'N/A';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-32">
      {/* --- Header --- */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-40 px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-bold text-sm">Product Details</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-5 h-5 text-foreground" />
        </button>
      </header>

      {/* --- Main Content --- */}
      <div className="px-4 space-y-5">
        {/* Image Carousel */}
        <div className="relative rounded-md overflow-hidden bg-gray-100 aspect-square">
          <img
            src={images[currentImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {currentImage + 1} / {images.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={`w-14 h-14 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                  currentImage === index
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Product Title Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="success"
                className={`${product.active ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-600'} border-0 text-[10px] font-semibold px-2 py-0.5`}
              >
                {product.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <h1 className="text-lg font-bold text-foreground">{product.name}</h1>
            <p className="text-xs text-foreground/50 mt-0.5">SKU: {defaultSku}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-border text-foreground/70 hover:bg-gray-50 text-xs font-semibold gap-1 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Product
          </Button>
        </div>

        {/* Price & Stock */}
        <div className="bg-white rounded-md border border-border p-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xl font-bold text-foreground">
                KES {defaultPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-foreground/60 mt-1 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${defaultStock > 0 ? 'bg-primary' : 'bg-red-500'}`}></span>
                {defaultStock} {firstVariant?.unit ?? 'units'} in stock
              </p>
            </div>
          </div>
        </div>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="font-bold text-sm text-foreground">Variants</h3>
              <span className="text-xs text-foreground/50 font-medium">
                {product.variants.length} variants
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {product.variants.map((variant) => {
                const variantName = variant.attributes && variant.attributes.length > 0
                  ? variant.attributes.map(attr => attr.value).join(' / ')
                  : variant.sku;
                const variantImgUrl = variant.images && variant.images[0]
                  ? `${BASE_URL}/resources/download/${variant.images[0].toString()}?tenant-id=${TENANT_ID}`
                  : '/logo.png';
                return (
                  <motion.div
                    key={variant.variantID || variant.sku}
                    whileTap={{ scale: 0.98 }}
                    className="min-w-[200px] bg-white rounded-md border border-border p-3 flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={variantImgUrl}
                        alt={variantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {variantName}
                      </h4>
                      <p className="text-xs text-primary font-semibold mt-1">
                        KES {variant.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-foreground/50 mt-0.5 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${variant.stock > 0 ? 'bg-primary' : 'bg-red-500'}`}></span>
                        {variant.stock} in stock
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Product Details List */}
        <div className="bg-white rounded-md border border-border divide-y divide-border">
          {[
            {
              icon: <Utensils className="w-4 h-4 text-foreground/50" />,
              label: 'Category',
              value: categoryName,
              clickable: true
            },
            {
              icon: <Package className="w-4 h-4 text-foreground/50" />,
              label: 'Unit',
              value: firstVariant?.unit ?? 'N/A',
              clickable: true
            },
            {
              icon: <DollarSign className="w-4 h-4 text-foreground/50" />,
              label: 'Price',
              value: `KES ${defaultPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              clickable: false
            },
            {
              icon: <ShieldAlert className="w-4 h-4 text-foreground/50" />,
              label: 'Return Policy',
              value: product.returnPolicy?.isReturnable 
                ? `Returnable (${product.returnPolicy.message})` 
                : 'Not Returnable',
              clickable: false
            },
            {
              icon: <Calendar className="w-4 h-4 text-foreground/50" />,
              label: 'Created',
              value: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A',
              clickable: false
            }
          ].map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 ${
                item.clickable ? 'cursor-pointer hover:bg-gray-50' : ''
              } transition-colors`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm text-foreground/70">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
                {item.clickable && (
                  <ChevronRight className="w-4 h-4 text-foreground/30" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        {product.description && (
          <div className="bg-white rounded-md border border-border p-3">
            <h3 className="font-bold text-sm text-foreground mb-2">Description</h3>
            <div className="relative">
              <p className={`text-sm text-foreground/70 leading-relaxed ${
                showDescription ? '' : 'line-clamp-2'
              }`}>
                {product.description}
              </p>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center gap-1 text-primary text-xs font-semibold mt-2 hover:underline"
              >
                {showDescription ? 'View less' : 'View more'}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showDescription ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Bottom Actions --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border z-30">
        <div className="flex items-center gap-3">
          <Button
            className="w-full bg-primary text-white font-bold py-3 rounded-md shadow-lg shadow-primary/20 gap-1"
            onClick={() => navigate('/vendor/add-product')}
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;