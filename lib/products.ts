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

const compactValue = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (
    (typeof File !== 'undefined' && value instanceof File) ||
    (typeof Blob !== 'undefined' && value instanceof Blob) ||
    (typeof FileList !== 'undefined' && value instanceof FileList)
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    const compactedItems = value
      .map((item) => compactValue(item))
      .filter((item) => item !== undefined);

    return compactedItems.length > 0 ? compactedItems : undefined;
  }

  if (typeof value === 'object') {
    const compactedEntries = Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((accumulator, [key, childValue]) => {
      const compactedChild = compactValue(childValue);
      if (compactedChild !== undefined) {
        accumulator[key] = compactedChild;
      }
      return accumulator;
    }, {});

    return Object.keys(compactedEntries).length > 0 ? compactedEntries : undefined;
  }

  if (typeof value === 'string') {
    return value.trim() === '' ? undefined : value;
  }

  return value;
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
  isNew: false,
  active: true,
  images: [],
  attributes: [],
});

export const normalizeProductPayload = (payload: ProductPayload): ProductPayload => ({
  ...(() => {
    const { rating, reviewCount, ...rest } = payload;
    return rest;
  })(),
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
    ...(() => {
      const { rating, reviewCount, ...rest } = variant;
      return rest;
    })(),
    sku: variant.sku.trim(),
    barcode: variant.barcode?.trim() || '',
    unit: variant.unit?.trim() || undefined,
    price: toNumber(variant.price, 0),
    oldPrice: toNumber(variant.oldPrice, 0),
    stock: toNumber(variant.stock, 0),
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
  const normalizedPayload = normalizeProductPayload(payload) as unknown as Record<string, unknown>;
  const compactedPayload = compactValue(normalizedPayload) as Record<string, unknown>;
  return buildFlattenedFormData(compactedPayload);
};
