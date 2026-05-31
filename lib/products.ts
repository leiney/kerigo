import { buildFlattenedFormData } from '../src/lib/multipart';
import type {
  ProductPayload,
  ProductStorePayload,
  ProductVariantPayload,
} from './types';

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const createEmptyProductStore = (): ProductStorePayload => ({
  price: 0,
  oldPrice: 0,
  stock: 0,
  stockUsed: 0,
});

export const createEmptyProductVariant = (): ProductVariantPayload => ({
  sku: '',
  barcode: '',
  unit: '',
  price: 0,
  oldPrice: 0,
  stock: 0,
  rating: 0,
  isNew: false,
  active: true,
  images: [],
  attributes: [],
  stores: [],
});

export const normalizeProductPayload = (payload: ProductPayload): ProductPayload => ({
  ...payload,
  rating: toNumber(payload.rating, 0),
  reviewCount: payload.reviewCount === undefined ? undefined : toNumber(payload.reviewCount, 0),
  active: Boolean(payload.active),
  tags: payload.tags.filter(Boolean),
  taxCodes: payload.taxCodes.filter(Boolean),
  info: {
    ingredients: payload.info.ingredients.filter(Boolean),
  },
  category: payload.category.map((item) => ({
    ...item,
    name: item.name.trim(),
    categoryID: item.categoryID?.trim() || undefined,
    image: item.image?.trim() || undefined,
  })),
  variants: payload.variants.map((variant) => ({
    ...variant,
    sku: variant.sku.trim(),
    barcode: variant.barcode?.trim() || '',
    unit: variant.unit?.trim() || undefined,
    price: toNumber(variant.price, 0),
    oldPrice: toNumber(variant.oldPrice, 0),
    stock: toNumber(variant.stock, 0),
    rating: toNumber(variant.rating, 0),
    reviewCount: variant.reviewCount === undefined ? undefined : toNumber(variant.reviewCount, 0),
    isNew: Boolean(variant.isNew),
    active: Boolean(variant.active),
    attributes: variant.attributes.map((attribute) => ({
      name: attribute.name.trim(),
      value: attribute.value.trim(),
    })),
    stores: (variant.stores ?? []).map((store) => ({
      storeID: store.storeID?.trim() || undefined,
      price: toNumber(store.price, 0),
      oldPrice: toNumber(store.oldPrice, 0),
      stock: toNumber(store.stock, 0),
      stockUsed: toNumber(store.stockUsed ?? 0, 0),
    })),
  })),
});

export const buildProductFormData = (payload: ProductPayload): FormData => {
  return buildFlattenedFormData(normalizeProductPayload(payload) as unknown as Record<string, unknown>);
};
