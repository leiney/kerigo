import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  store: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartItemInput {
  id: string | number;
  name: string;
  store: string;
  price: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItemInput) => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const itemId = String(item.id);
          const existingItem = state.items.find((cartItem) => cartItem.id === itemId);

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === itemId
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: itemId,
                name: item.name,
                store: item.store,
                price: item.price,
                quantity: 1,
                image: item.image,
              },
            ],
          };
        }),
      increaseItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      decreaseItem: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'kerigo-cart',
    }
  )
);

export const selectCartCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);