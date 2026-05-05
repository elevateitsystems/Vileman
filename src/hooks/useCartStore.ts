import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/lib/products";

export interface CartItem extends Product {
  cartQuantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isOrderModalOpen: boolean;
  singleOrderProduct: Product | null;
  openOrderModal: (product?: Product) => void;
  closeOrderModal: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOrderModalOpen: false,
      singleOrderProduct: null,

      openOrderModal: (product) => set({ 
        isOrderModalOpen: true,
        singleOrderProduct: product || null 
      }),
      closeOrderModal: () => set({ 
        isOrderModalOpen: false,
        singleOrderProduct: null 
      }),

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.slug === product.slug);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.slug === product.slug
                ? { ...item, cartQuantity: item.cartQuantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...product, cartQuantity: quantity }],
          });
        }
      },

      removeItem: (productSlug) => {
        set({
          items: get().items.filter((item) => item.slug !== productSlug),
        });
      },

      updateQuantity: (productSlug, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productSlug);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.slug === productSlug ? { ...item, cartQuantity: quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.cartQuantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.cartQuantity, 0);
      },
    }),
    {
      name: "vileman-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
