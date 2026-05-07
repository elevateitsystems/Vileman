import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/lib/products";

export interface CartItem {
  slug: string;
  name: string;
  shortDescription: string;
  image: string;
  price: number;
  cartQuantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CartState {
  items: CartItem[];
  customerInfo: CustomerInfo;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  singleOrderProduct: CartItem | null;
  setSingleOrderProduct: (product: Product | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerInfo: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      singleOrderProduct: null,

      setSingleOrderProduct: (product) => {
        if (!product) {
          set({ singleOrderProduct: null });
          return;
        }

        const cartItem: CartItem = {
          slug: product.slug,
          name: product.name,
          shortDescription: product.shortDescription,
          image: product.image,
          price: product.price,
          cartQuantity: 1
        };
        set({ singleOrderProduct: cartItem });
      },

      setCustomerInfo: (info) => set({ customerInfo: info }),

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
          const newItem: CartItem = {
            slug: product.slug,
            name: product.name,
            shortDescription: product.shortDescription,
            image: product.image,
            price: product.price,
            cartQuantity: quantity
          };
          set({
            items: [...currentItems, newItem],
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
