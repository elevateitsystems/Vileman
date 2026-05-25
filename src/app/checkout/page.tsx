"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Loader2,
  User,
  Mail,
  Phone,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { createCheckoutSession, uploadImage } from "@/lib/api";
import { CountrySelect } from "@/component/checkout/CountrySelect";

// Hardcoded product IDs as requested
const PRODUCTS = {
  MUG: "b1647d2d-72f8-4a9f-a1bd-6df6dd181ba2",
  SHIRT: "4e2e9f09-a41a-4460-834e-ada5f08798a9",
};

interface CustomImage {
  url: string;
  publicId: string;
}

interface CustomProductItem {
  id: string; // internal id for UI
  type: "MUG" | "SHIRT";
  quantity: number;
  color: string;
  size: string;
  comment: string;
  images: CustomImage[];
  isUploading: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();

  // --- Form States ---
  const [items, setItems] = useState<CustomProductItem[]>([
    {
      id: "item-1",
      type: "MUG",
      quantity: 1,
      color: "White",
      size: "11 oz",
      comment: "",
      images: [],
      isUploading: false,
    },
  ]);

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

  // --- Handlers ---
  const handleAddAnother = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        type: "SHIRT",
        quantity: 1,
        color: "Black",
        size: "M",
        comment: "",
        images: [],
        isUploading: false,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof CustomProductItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleImageUpload = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    handleItemChange(id, "isUploading", true);
    setError(null);

    try {
      // Hit the backend upload image endpoint
      const response = await uploadImage(file);
      // Assuming response contains url and publicId (or we adjust based on actual return)
      const newImage: CustomImage = {
        url: response.url || response.secure_url || response[0]?.url, 
        publicId: response.publicId || response.public_id || response[0]?.publicId || `file-${Date.now()}`,
      };

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, images: [...item.images, newImage] } : item
        )
      );
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      handleItemChange(id, "isUploading", false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validate that items have images (optional, but requested in flow)
    const missingImages = items.some((item) => item.images.length === 0);
    if (missingImages) {
      setError("Please upload at least one image for each custom item.");
      setIsProcessing(false);
      return;
    }

    try {
      const payload = {
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingCountry: customerInfo.country,
        products: items.map((item) => ({
          productId: item.type === "MUG" ? PRODUCTS.MUG : PRODUCTS.SHIRT,
          quantity: item.quantity,
          customization: {
            selections: {
              Color: item.color,
              Size: item.size,
            },
            comment: item.comment,
            images: item.images,
          },
        })),
      };

      const response = await createCheckoutSession(payload);

      if (response && response.url) {
        window.location.href = response.url;
      } else {
        // If it just successfully places order without URL
        setSuccess(true);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to initiate checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
          Your custom order has been placed successfully.
        </p>
        <p className="mt-2 max-w-md text-[#797b86]">
          We&apos;ve sent a confirmation email to{" "}
          <span className="font-medium text-[#181b31]">{customerInfo.email}</span>
          . Our team is already reviewing your customization request.
        </p>
        <Link
          href="/"
          className="mt-12 rounded-lg bg-[#2e4857] px-10 py-4 text-[14px] font-bold uppercase tracking-widest text-white transition-all hover:bg-black"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
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
          <div className="mb-8 rounded-xl bg-red-50 p-4 text-red-600 text-sm border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left Column: Custom Product Selection */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2 className="text-[28px] font-bold tracking-tight text-[#181b31]">
                Customize Your Order
              </h2>
              <p className="mt-2 text-[#797b86]">
                Design your custom mug or shirt. Upload your images and leave instructions for our team.
              </p>
            </div>

            <div className="space-y-8">
              {items.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-6 mb-6">
                    <h3 className="text-[16px] font-bold uppercase tracking-widest text-[#181b31]">
                      Item {index + 1}
                    </h3>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Product Type & Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                          Product Type
                        </label>
                        <select
                          value={item.type}
                          disabled
                          className="h-14 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 text-[15px] outline-none appearance-none disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="MUG">Custom Mug</option>
                          <option value="SHIRT">Custom Shirt</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 1)}
                          className="h-14 w-full rounded-xl border border-gray-100 bg-white px-4 text-[15px] transition-all focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857] outline-none"
                        />
                      </div>
                    </div>

                    {/* Color & Size */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                          Color
                        </label>
                        <select
                          value={item.color}
                          onChange={(e) => handleItemChange(item.id, "color", e.target.value)}
                          className="h-14 w-full rounded-xl border border-gray-100 bg-white px-4 text-[15px] transition-all focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857] outline-none"
                        >
                          <option value="White">White</option>
                          <option value="Black">Black</option>
                          <option value="Navy">Navy</option>
                          <option value="Red">Red</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                          Size
                        </label>
                        <select
                          value={item.size}
                          onChange={(e) => handleItemChange(item.id, "size", e.target.value)}
                          className="h-14 w-full rounded-xl border border-gray-100 bg-white px-4 text-[15px] transition-all focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857] outline-none"
                        >
                          {item.type === "MUG" ? (
                            <>
                              <option value="11 oz">11 oz</option>
                              <option value="15 oz">15 oz</option>
                            </>
                          ) : (
                            <>
                              <option value="S">Small (S)</option>
                              <option value="M">Medium (M)</option>
                              <option value="L">Large (L)</option>
                              <option value="XL">Extra Large (XL)</option>
                              <option value="2XL">2XL</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                        Upload Design / Image
                      </label>
                      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center hover:bg-gray-100 transition-colors relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(item.id, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-2">
                          {item.isUploading ? (
                            <Loader2 className="animate-spin text-[#2e4857]" size={24} />
                          ) : (
                            <Upload className="text-gray-400 group-hover:text-[#2e4857] transition-colors" size={24} />
                          )}
                          <span className="text-[14px] font-medium text-[#181b31]">
                            {item.isUploading ? "Uploading..." : "Click or drag image to upload"}
                          </span>
                          <span className="text-[12px] text-[#797b86]">
                            Supports JPG, PNG, WEBP
                          </span>
                        </div>
                      </div>

                      {/* Image Previews */}
                      {item.images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                          {item.images.map((img, i) => (
                            <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                              <Image src={img.url} alt={`Upload ${i}`} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                        Instructions / Comments
                      </label>
                      <textarea
                        required
                        value={item.comment}
                        onChange={(e) => handleItemChange(item.id, "comment", e.target.value)}
                        rows={3}
                        placeholder="e.g., Please print the images side by side, centered."
                        className="w-full rounded-xl border border-gray-100 bg-white p-4 text-[15px] transition-all focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857] outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddAnother}
              className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-widest text-[#2e4857] hover:text-black transition-colors"
            >
              <Plus size={18} />
              Add Another Custom Item
            </button>
          </div>

          {/* Right Column: Customer Info & Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.06)] md:p-10 space-y-8">
              <div>
                <h3 className="mb-6 text-[20px] font-bold text-[#181b31]">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      required
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Full Name"
                      className="h-14 w-full rounded-xl border border-gray-100 bg-gray-50 pl-12 pr-4 text-[15px] transition-all focus:border-[#2e4857] focus:bg-white focus:ring-1 focus:ring-[#2e4857] outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      required
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="Email Address"
                      className="h-14 w-full rounded-xl border border-gray-100 bg-gray-50 pl-12 pr-4 text-[15px] transition-all focus:border-[#2e4857] focus:bg-white focus:ring-1 focus:ring-[#2e4857] outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      required
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="Phone Number"
                      className="h-14 w-full rounded-xl border border-gray-100 bg-gray-50 pl-12 pr-4 text-[15px] transition-all focus:border-[#2e4857] focus:bg-white focus:ring-1 focus:ring-[#2e4857] outline-none"
                    />
                  </div>
                  <CountrySelect
                    value={customerInfo.country}
                    onChange={(val) => setCustomerInfo({ ...customerInfo, country: val })}
                  />
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-300" size={18} />
                    <textarea
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      rows={2}
                      placeholder="Shipping Address"
                      className="w-full rounded-xl border border-gray-100 bg-gray-50 pl-12 pr-4 py-4 text-[15px] transition-all focus:border-[#2e4857] focus:bg-white focus:ring-1 focus:ring-[#2e4857] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-[15px] font-bold text-[#797b86]">Total Items</span>
                  <span className="text-[24px] font-bold text-[#181b31]">
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || items.some((i) => i.isUploading)}
                  className="group flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-[#2e4857] text-[14px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-[#2e4857]/10 transition-all hover:bg-black hover:shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <p className="mt-4 text-center text-[12px] text-gray-400">
                  By placing your order, you agree to our Terms and Custom Product Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
