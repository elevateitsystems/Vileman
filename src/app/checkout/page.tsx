"use client";

import { useCartStore } from "@/hooks/useCartStore";
import {
  ChevronLeft,
  CreditCard,
  CheckCircle2,
  ShoppingBag,
  Truck,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Visa, Mastercard, Maestro } from "@/component/icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { createCheckoutSession } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    customerInfo,
    setCustomerInfo,
    updateQuantity,
    getTotalPrice,
    clearCart,
    singleOrderProduct,
    setSingleOrderProduct,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState(customerInfo);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Sync with store on mount and check for stripe redirect
  useEffect(() => {
    setMounted(true);
    if (searchParams.get("success") === "true") {
      setStep(3);
    }
  }, [searchParams]);

  if (!mounted) return null;

  const displayItems = singleOrderProduct ? [singleOrderProduct] : items;

  if (displayItems.length === 0 && step !== 3) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfc] px-4 py-20 text-center">
        <div className="mb-8 rounded-full bg-gray-50 p-10 text-gray-200">
          <ShoppingBag size={80} />
        </div>
        <h1 className="text-[32px] font-bold text-[#181b31]">
          Your bag is empty
        </h1>
        <p className="mt-4 max-w-md text-[#797b86]">
          You haven't added any items to your bag yet. Browse our collection and
          find something you love.
        </p>
        <Link
          href="/products"
          className="mt-10 rounded-lg bg-[#2e4857] px-10 py-4 text-[14px] font-bold uppercase tracking-widest text-white transition-all hover:bg-black"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  const totalPrice = singleOrderProduct
    ? singleOrderProduct.price * singleOrderProduct.cartQuantity
    : getTotalPrice();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setCustomerInfo(formData);
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const payload = {
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingCountry: (formData as any).country || "netherlands",
        products: displayItems.map((item) => ({
          productId: item.id,
          quantity: item.cartQuantity,
        })),
      };

      const response = await createCheckoutSession(payload);

      if (response && response.url) {
        // Clear cart before redirecting so they don't come back to a full cart
        clearCart();
        setSingleOrderProduct(null);
        window.location.href = response.url;
      } else {
        throw new Error("No checkout URL received from the server");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to initiate checkout. Please try again.");
      setIsProcessing(false);
    }
  };

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
          <div className="hidden items-center gap-8 md:flex">
            {[
              { id: 1, name: "Information" },
              { id: 2, name: "Payment" },
              { id: 3, name: "Confirmation" },
            ].map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest transition-colors ${
                  step >= s.id ? "text-[#181b31]" : "text-gray-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] ${
                    step >= s.id
                      ? "border-[#181b31] bg-[#181b31] text-white"
                      : "border-gray-200"
                  }`}
                >
                  {s.id}
                </span>
                {s.name}
                {s.id < 3 && <div className="h-px w-8 bg-gray-100" />}
              </div>
            ))}
          </div>
          <Link
            href={singleOrderProduct ? "/products" : "/cart"}
            className="text-[13px] font-medium text-gray-400 hover:text-black transition-colors"
          >
            {step === 3 ? "Return Home" : "Cancel Checkout"}
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
        {step === 3 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-8 rounded-full bg-green-50 p-8 text-green-500 shadow-sm">
              <CheckCircle2 size={80} />
            </div>
            <h1 className="text-[36px] font-bold tracking-tight text-[#181b31]">
              Thank You!
            </h1>
            <p className="mt-4 text-[18px] font-light text-[#797b86]">
              Your order{" "}
              <span className="font-bold text-[#181b31]">
                #VL-{Math.floor(100000 + Math.random() * 900000)}
              </span>{" "}
              has been placed successfully.
            </p>
            <p className="mt-2 max-w-md text-[#797b86]">
              We&apos;ve sent a confirmation email to{" "}
              <span className="font-medium text-[#181b31]">
                {customerInfo.email}
              </span>
              . Our team is already preparing your package for shipment.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="rounded-lg bg-[#2e4857] px-10 py-4 text-[14px] font-bold uppercase tracking-widest text-white transition-all hover:bg-black"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
            {/* Left Column: Forms */}
            <div className="lg:col-span-3">
              {step === 1 && (
                <form
                  onSubmit={handleNextStep}
                  className="animate-in fade-in slide-in-from-left duration-500"
                >
                  <div className="mb-10">
                    <h2 className="text-[28px] font-bold tracking-tight text-[#181b31]">
                      Contact Information
                    </h2>
                    <p className="mt-2 text-[#797b86]">
                      Please provide your shipping and contact details below.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                          Full Name
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                            size={18}
                          />
                          <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="h-14 w-full rounded-xl border border-gray-100 bg-white pl-12 pr-4 text-[15px] transition-all focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857] outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                            size={18}
                          />
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="h-14 w-full rounded-xl border border-gray-100 bg-white pl-12 pr-4 text-[15px] transition-all focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={18}
                        />
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+49 123 4567890"
                          className="h-14 w-full rounded-xl border border-gray-100 bg-white pl-12 pr-4 text-[15px] transition-all focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857] outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                        Shipping Address
                      </label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-4 top-4 text-gray-300"
                          size={18}
                        />
                        <textarea
                          required
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Street, City, Postal Code, Country"
                          className="w-full rounded-xl border border-gray-100 bg-white pl-12 pr-4 py-4 text-[15px] transition-all focus:border-[#2e4857] focus:ring-1 focus:ring-[#2e4857] outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="group mt-12 flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-[#2e4857] text-[14px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-[#2e4857]/10 transition-all hover:bg-black hover:shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue to Payment
                        <ArrowRight
                          size={18}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-left duration-500">
                  <div className="mb-10">
                    <button
                      onClick={() => setStep(1)}
                      className="mb-6 flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#2e4857] transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Back to Information
                    </button>
                    <h2 className="text-[28px] font-bold tracking-tight text-[#181b31]">
                      Payment Method
                    </h2>
                    <p className="mt-2 text-[#797b86]">
                      Select your preferred payment method to complete the
                      order.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-8 rounded-xl bg-red-50 p-4 text-red-600 text-sm border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      {
                        id: "card",
                        name: "Credit / Debit Card",
                        icon: <CreditCard size={20} />,
                        icons: [
                          <Visa key="v" />,
                          <Mastercard key="m" />,
                          <Maestro key="ma" />,
                        ],
                      },
                      {
                        id: "paypal",
                        name: "PayPal",
                        icon: (
                          <span className="font-bold italic text-blue-600">
                            PayPal
                          </span>
                        ),
                      },
                      {
                        id: "transfer",
                        name: "Bank Transfer",
                        icon: <ArrowRight size={20} />,
                      },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`flex flex-col items-start gap-4 rounded-2xl border-2 p-6 text-left transition-all ${
                          selectedPayment === method.id
                            ? "border-[#2e4857] bg-[#2e4857]/5 ring-1 ring-[#2e4857]"
                            : "border-gray-100 hover:border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="rounded-full bg-gray-50 p-3 text-[#2e4857]">
                            {method.icon}
                          </div>
                          {selectedPayment === method.id && (
                            <CheckCircle2
                              size={24}
                              className="text-[#2e4857]"
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#181b31]">
                            {method.name}
                          </h4>
                          {method.icons && (
                            <div className="mt-2 flex gap-2 grayscale opacity-50">
                              {method.icons.map((ic, i) => (
                                <div key={i} className="scale-75 origin-left">
                                  {ic}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!selectedPayment || isProcessing}
                    onClick={handlePlaceOrder}
                    className="group mt-12 flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-[#2e4857] text-[14px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-[#2e4857]/10 transition-all hover:bg-black hover:shadow-black/10 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Complete Purchase
                        <ShieldCheck size={18} />
                      </>
                    )}
                  </button>

                  <p className="mt-6 text-center text-[13px] font-light text-gray-400">
                    By clicking "Complete Purchase", you agree to our Terms of
                    Service and Privacy Policy.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.06)] md:p-10">
                <h3 className="mb-8 text-[20px] font-bold text-[#181b31]">
                  Order Summary
                </h3>

                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6">
                  {displayItems.map((item) => (
                    <div
                      key={item.slug}
                      className="flex gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-200">
                            <ShoppingBag size={32} />
                          </div>
                        )}
                        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#181b31] text-[10px] font-bold text-white">
                          {item.cartQuantity}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <h4 className="text-[15px] font-bold text-[#181b31] line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-[13px] font-light text-[#797b86] line-clamp-1">
                            {item.shortDescription}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[15px] font-bold text-[#181b31]">
                            {(item.price * item.cartQuantity).toFixed(2)} EUR
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 space-y-4 pt-10 border-t border-gray-50">
                  <div className="flex justify-between text-[15px]">
                    <span className="text-[#797b86]">Subtotal</span>
                    <span className="font-bold text-[#181b31]">
                      {totalPrice.toFixed(2)} EUR
                    </span>
                  </div>
                  <div className="flex justify-between text-[15px]">
                    <span className="text-[#797b86]">Shipping</span>
                    <span className="font-bold text-green-500 uppercase tracking-widest text-[12px]">
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold uppercase tracking-widest text-[#797b86]">
                        Total
                      </span>
                      <span className="text-[12px] text-gray-300">
                        Including VAT
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[32px] font-bold leading-none text-[#181b31]">
                        {totalPrice.toFixed(2)}
                      </span>
                      <span className="ml-1 text-[14px] font-light text-gray-400 uppercase tracking-widest">
                        EUR
                      </span>
                    </div>
                  </div>
                </div>

                {step === 2 && (
                  <div className="mt-10 rounded-xl bg-gray-50 p-6">
                    <h4 className="mb-4 text-[12px] font-bold uppercase tracking-widest text-gray-400">
                      Shipping To
                    </h4>
                    <div className="flex gap-3 text-[14px] text-[#181b31]">
                      <MapPin
                        size={18}
                        className="flex-shrink-0 text-[#2e4857]"
                      />
                      <p className="font-medium whitespace-pre-wrap">
                        {formData.address}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-10 flex items-center gap-4 rounded-xl border border-dashed border-gray-200 p-4">
                  <div className="rounded-full bg-blue-50 p-2 text-blue-500">
                    <Truck size={20} />
                  </div>
                  <div className="text-[12px]">
                    <p className="font-bold text-[#181b31]">Express Delivery</p>
                    <p className="text-[#797b86]">
                      Estimated arrival: 2-4 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
