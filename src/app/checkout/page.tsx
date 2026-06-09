// src/app/checkout/page.tsx
"use client";

import { CountrySelect } from "@/component/checkout/CountrySelect";
import { CartItem, useCartStore } from "@/hooks/useCartStore";
import { createCheckoutSession, uploadImage } from "@/lib/api";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedImage {
  url: string;
  publicId: string;
}

interface CustomizationState {
  color: string;
  size: string;
  comment: string;
  images: UploadedImage[];
  isUploading: boolean;
}

// keyed by cart item id
type CustomizationMap = Record<string, CustomizationState>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defaultCustomization(): CustomizationState {
  return {
    color: "White",
    size: "11 oz",
    comment: "",
    images: [],
    isUploading: false,
  };
}

function resolveImage(image: any): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object" && image.src) return image.src; // StaticImport
  return "";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    getTotalPrice,
    singleOrderProduct,
    setSingleOrderProduct,
  } = useCartStore();

  // Decide which items to show:
  // If user clicked "ORDER" on a product card → show only that product
  // Otherwise → show full cart
  const displayItems: CartItem[] = singleOrderProduct
    ? [singleOrderProduct]
    : cartItems;

  // Customization state lives here, not in the cart store
  const [customizations, setCustomizations] = useState<CustomizationMap>(() =>
    Object.fromEntries(
      displayItems.map((item) => [item.id, defaultCustomization()]),
    ),
  );

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    country: "netherlands",
    address: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ── Customization helpers ──────────────────────────────────────────────────

  const updateCustomization = (
    id: string,
    field: keyof CustomizationState,
    value: any,
  ) => {
    setCustomizations((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleImageUpload = async (
    id: string,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    updateCustomization(id, "isUploading", true);
    setError(null);
    try {
      const response = await uploadImage(file);
      const newImage: UploadedImage = {
        url: response.url || response.secure_url || response[0]?.url,
        publicId:
          response.publicId || response.public_id || `file-${Date.now()}`,
      };
      setCustomizations((prev) => ({
        ...prev,
        [id]: { ...prev[id], images: [...prev[id].images, newImage] },
      }));
    } catch {
      setError("Failed to upload image. Please try again.");
    } finally {
      updateCustomization(id, "isUploading", false);
    }
  };

  const removeUploadedImage = (itemId: string, imgIndex: number) => {
    setCustomizations((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        images: prev[itemId].images.filter((_, i) => i !== imgIndex),
      },
    }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handlePlaceOrder = async (e: React.FormEvent) => {
    console.log({ submitTheFrom: e });
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validate: customizable items must have at least one image
    const missingImage = displayItems.some(
      (item) => item.isCustomizable && !customizations[item.id]?.images.length,
    );
    if (missingImage) {
      setError(
        "Please upload at least one design image for each customizable item.",
      );
      setIsProcessing(false);
      return;
    }

    try {
      const payload = {
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingCountry: customerInfo.country,
        products: displayItems.map((item) => {
          const c = customizations[item.id];
          return {
            productId: item.id,
            quantity: item.quantity,
            ...(item.isCustomizable && c
              ? {
                  customization: {
                    selections: { Color: c.color, Size: c.size },
                    comment: c.comment,
                    images: c.images,
                  },
                }
              : {}),
          };
        }),
      };

      // Create the apyload

      const response = await createCheckoutSession(payload);

      console.log({ recivetheresponse: response });
      if (response?.url) {
        window.location.href = response.url;
      } else {
        setSuccess(true);
        setSingleOrderProduct(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Empty cart guard ───────────────────────────────────────────────────────

  if (!displayItems.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfc] px-4 text-center">
        <h2 className="text-2xl font-bold text-[#181b31]">
          Your cart is empty
        </h2>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-[#2e4857] px-8 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-black"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ── Success screen ─────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfc] px-4 py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="mb-8 rounded-full bg-green-50 p-8 text-green-500 shadow-sm">
          <CheckCircle2 size={80} />
        </div>
        <h1 className="text-[36px] font-bold tracking-tight text-[#181b31]">
          Order Received!
        </h1>
        <p className="mt-4 text-[18px] font-light text-[#797b86]">
          Confirmation sent to{" "}
          <span className="font-medium text-[#181b31]">
            {customerInfo.email}
          </span>
          .
        </p>
        <Link
          href="/"
          className="mt-12 rounded-lg bg-[#2e4857] px-10 py-4 text-[14px] font-bold uppercase tracking-widest text-white hover:bg-black"
        >
          Return Home
        </Link>
      </div>
    );
  }

  // ── Main layout ────────────────────────────────────────────────────────────

  const anyUploading = Object.values(customizations).some((c) => c.isUploading);

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link href="/">
            <span className="text-[20px] font-black uppercase tracking-[0.2em] text-[#181b31]">
              Vileman
            </span>
          </Link>
          <span className="text-[13px] font-bold uppercase tracking-widest text-gray-400">
            Secure Checkout
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
        {error && (
          <div className="mb-8 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 gap-16 lg:grid-cols-12"
        >
          {/* ── Left: Order items ── */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-[28px] font-bold tracking-tight text-[#181b31]">
                Your Order
              </h2>
              <p className="mt-1 text-[#797b86]">
                Review items and fill in customization details where required.
              </p>
            </div>

            {/* Items table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-4 py-4 text-center">Qty</th>
                    <th className="px-4 py-4 text-right">Price</th>
                    <th className="px-4 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayItems.map((item) => (
                    <tr key={item.id} className="align-top">
                      {/* Product info */}
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                            {resolveImage(item.image) ? (
                              <Image
                                src={resolveImage(item.image)}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-gray-300 text-xs">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#181b31]">
                              {item.name}
                            </p>
                            {item.shortDescription && (
                              <p className="mt-0.5 text-xs text-[#797b86] line-clamp-2 max-w-xs">
                                {item.shortDescription}
                              </p>
                            )}
                            {item.isCustomizable && (
                              <span className="mt-1 inline-block rounded bg-[#2e4857]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2e4857]">
                                Customizable
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.slug,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-16 rounded-lg border border-gray-100 bg-gray-50 px-2 py-2 text-center text-sm outline-none focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857]"
                        />
                      </td>

                      {/* Price */}
                      <td className="px-4 py-5 text-right font-bold text-[#181b31]">
                        {(item.price * item.quantity).toFixed(2)} EUR
                      </td>

                      {/* Remove — only shown in cart mode */}
                      <td className="px-4 py-5 text-right">
                        {!singleOrderProduct && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.slug)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Customization forms — only for isCustomizable items */}
            {displayItems.some((i) => i.isCustomizable) && (
              <div className="space-y-6">
                <h3 className="text-[18px] font-bold text-[#181b31]">
                  Customization Details
                </h3>

                {displayItems
                  .filter((item) => item.isCustomizable)
                  .map((item) => {
                    const c = customizations[item.id];
                    if (!c) return null;
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5"
                      >
                        <p className="text-[13px] font-bold uppercase tracking-widest text-[#2e4857]">
                          {item.name}
                        </p>

                        {/* Color + Size */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                              Color
                            </label>
                            <select
                              value={c.color}
                              onChange={(e) =>
                                updateCustomization(
                                  item.id,
                                  "color",
                                  e.target.value,
                                )
                              }
                              className="h-12 w-full rounded-xl border border-gray-100 bg-white px-4 text-sm outline-none focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857]"
                            >
                              {["White", "Black", "Navy", "Red"].map((col) => (
                                <option key={col}>{col}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                              Size
                            </label>
                            <select
                              value={c.size}
                              onChange={(e) =>
                                updateCustomization(
                                  item.id,
                                  "size",
                                  e.target.value,
                                )
                              }
                              className="h-12 w-full rounded-xl border border-gray-100 bg-white px-4 text-sm outline-none focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857]"
                            >
                              {[
                                "11 oz",
                                "15 oz",
                                "S",
                                "M",
                                "L",
                                "XL",
                                "2XL",
                              ].map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Upload */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                            Upload Design *
                          </label>
                          <div className="relative rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center hover:bg-gray-100 transition-colors group">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(item.id, e)}
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              {c.isUploading ? (
                                <Loader2
                                  className="animate-spin text-[#2e4857]"
                                  size={22}
                                />
                              ) : (
                                <Upload
                                  className="text-gray-400 group-hover:text-[#2e4857] transition-colors"
                                  size={22}
                                />
                              )}
                              <span className="text-sm font-medium text-[#181b31]">
                                {c.isUploading
                                  ? "Uploading..."
                                  : "Click or drag to upload"}
                              </span>
                              <span className="text-xs text-[#797b86]">
                                JPG, PNG, WEBP
                              </span>
                            </div>
                          </div>

                          {c.images.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-2">
                              {c.images.map((img, i) => (
                                <div
                                  key={i}
                                  className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
                                >
                                  <Image
                                    src={img.url}
                                    alt={`Upload ${i}`}
                                    fill
                                    className="object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeUploadedImage(item.id, i)
                                    }
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Comment */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                            Instructions / Comments
                          </label>
                          <textarea
                            value={c.comment}
                            onChange={(e) =>
                              updateCustomization(
                                item.id,
                                "comment",
                                e.target.value,
                              )
                            }
                            rows={3}
                            placeholder="e.g., Print images side by side, centered."
                            className="w-full rounded-xl border border-gray-100 bg-white p-4 text-sm outline-none resize-none focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857]"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* ── Right: Contact + Summary ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.06)] md:p-10 space-y-8">
              <div>
                <h3 className="mb-5 text-[20px] font-bold text-[#181b31]">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={18}
                    />
                    <input
                      required
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          name: e.target.value,
                        })
                      }
                      placeholder="Full Name"
                      className="h-14 w-full rounded-xl border border-gray-100 bg-gray-50 pl-12 pr-4 text-[15px] outline-none focus:border-[#2e4857] focus:bg-white focus:ring-1 focus:ring-[#2e4857]"
                    />
                  </div>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={18}
                    />
                    <input
                      required
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          email: e.target.value,
                        })
                      }
                      placeholder="Email Address"
                      className="h-14 w-full rounded-xl border border-gray-100 bg-gray-50 pl-12 pr-4 text-[15px] outline-none focus:border-[#2e4857] focus:bg-white focus:ring-1 focus:ring-[#2e4857]"
                    />
                  </div>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={18}
                    />
                    <input
                      required
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Phone Number"
                      className="h-14 w-full rounded-xl border border-gray-100 bg-gray-50 pl-12 pr-4 text-[15px] outline-none focus:border-[#2e4857] focus:bg-white focus:ring-1 focus:ring-[#2e4857]"
                    />
                  </div>
                  <CountrySelect
                    value={customerInfo.country}
                    onChange={(val) =>
                      setCustomerInfo({ ...customerInfo, country: val })
                    }
                  />
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-4 text-gray-300"
                      size={18}
                    />
                    <textarea
                      required
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          address: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Shipping Address"
                      className="w-full rounded-xl border border-gray-100 bg-gray-50 pl-12 pr-4 py-4 text-[15px] outline-none resize-none focus:border-[#2e4857] focus:bg-white focus:ring-1 focus:ring-[#2e4857]"
                    />
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="rounded-xl bg-gray-50 p-5 space-y-2 text-sm">
                {displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-[#797b86]"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-[#181b31]">
                      {(item.price * item.quantity).toFixed(2)} EUR
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gray-200 pt-3 font-bold text-[#181b31]">
                  <span>Total</span>
                  <span className="text-lg">
                    {displayItems
                      .reduce((sum, i) => sum + i.price * i.quantity, 0)
                      .toFixed(2)}{" "}
                    EUR
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || anyUploading}
                className="group flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-[#2e4857] text-[14px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-[#2e4857]/10 transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
              <p className="text-center text-[12px] text-gray-400">
                By placing your order, you agree to our Terms and Custom Product
                Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
