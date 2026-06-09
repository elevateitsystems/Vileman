// hooks/useCartStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  isCustomizable: boolean;
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
  singleOrderProduct: CartItem | null;
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  setSingleOrderProduct: (product: any | null) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely resolves an image to a plain string URL.
 * Guards against Next.js StaticImport objects (e.g. from `import img from "@/assets/x.svg"`).
 */
function resolveImage(product: any): string {
  // Prefer explicit string image field
  if (typeof product.image === "string" && product.image.length > 0) {
    return product.image;
  }
  // imageSrc used by home page mapped products
  if (typeof product.imageSrc === "string" && product.imageSrc.length > 0) {
    return product.imageSrc;
  }
  // images array from API: [{ url: string }] or [string]
  const firstImage = product.images?.[0];
  if (typeof firstImage === "string" && firstImage.length > 0) return firstImage;
  if (typeof firstImage?.url === "string" && firstImage.url.length > 0) return firstImage.url;
  // StaticImport fallback (next.js svg/image imports)
  if (typeof product.image === "object" && product.image?.src) return product.image.src;
  if (typeof product.imageSrc === "object" && product.imageSrc?.src) return product.imageSrc.src;
  return "";
}

/** Maps any raw product shape to a clean CartItem. */
function toCartItem(product: any, quantity: number): CartItem {
  return {
    id: product.id || product._id || product.productId || product.uuid || "",
    slug: product.slug || "",
    name: product.name || "",
    shortDescription: product.shortDescription || "",
    image: resolveImage(product),
    price: typeof product.price === "number" ? product.price : parseFloat(product.price) || 0,
    quantity,
    color: product.color || product.colors?.[0],
    // Explicitly read the boolean — never default-false silently on a string "false"
    isCustomizable: product.isCustomizable === true,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerInfo: { name: "", email: "", phone: "", address: "" },
      singleOrderProduct: null,

      setSingleOrderProduct: (product) => {
        if (!product) {
          set({ singleOrderProduct: null });
          return;
        }
        set({ singleOrderProduct: toCartItem(product, 1) });
      },

      setCustomerInfo: (info) => set({ customerInfo: info }),

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existing = currentItems.find((item) => item.slug === product.slug);

        if (existing) {
          set({
            items: currentItems.map((item) =>
              item.slug === product.slug
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, toCartItem(product, quantity)] });
        }
      },

      removeItem: (productSlug) => {
        set({ items: get().items.filter((item) => item.slug !== productSlug) });
      },

      updateQuantity: (productSlug, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productSlug);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.slug === productSlug ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: "vileman-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);