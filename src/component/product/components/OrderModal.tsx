"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { X, Plus, Minus, CreditCard, ChevronRight, CheckCircle2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { Visa, Mastercard, Maestro } from "@/component/icons";

export function OrderModal() {
  const { 
    items, 
    isOrderModalOpen, 
    closeOrderModal, 
    updateQuantity, 
    getTotalPrice,
    clearCart,
    singleOrderProduct 
  } = useCartStore();
  
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [singleQuantity, setSingleQuantity] = useState(1);

  // Reset state when modal closes/opens
  useEffect(() => {
    if (isOrderModalOpen) {
      setStep(1);
      setSelectedPayment(null);
      setSingleQuantity(1);
    }
  }, [isOrderModalOpen]);

  if (!isOrderModalOpen) return null;

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePlaceOrder = () => {
    setStep(3);
    // In a real app, we would process payment here
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  const totalPrice = singleOrderProduct 
    ? singleOrderProduct.price * singleQuantity 
    : getTotalPrice();

  const displayItems = singleOrderProduct 
    ? [{ ...singleOrderProduct, cartQuantity: singleQuantity }]
    : items;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={closeOrderModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
          <div>
            <h2 className="text-[24px] font-bold tracking-tight text-[#181b31]">
              {step === 1 && "Review Your Order"}
              {step === 2 && "Payment Method"}
              {step === 3 && "Order Confirmed!"}
            </h2>
            <p className="mt-1 text-[14px] font-light text-[#797b86]">
              {step === 1 && "Check your items and quantities."}
              {step === 2 && "Select how you would like to pay."}
              {step === 3 && "Thank you for your purchase."}
            </p>
          </div>
          <button 
            onClick={closeOrderModal}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto px-8 py-6">
          {step === 1 && (
            <div className="space-y-6">
              {displayItems.map((item) => (
                <div key={item.slug} className="flex items-center justify-between gap-4 py-2">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-50 flex items-center justify-center">
                       <ShoppingBag className="text-gray-300" size={24} />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-medium text-[#181b31]">{item.name}</h4>
                      <p className="text-[14px] font-light text-[#797b86]">{item.price.toFixed(2)} EUR</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-lg border border-gray-100 p-1">
                      <button 
                        onClick={() => {
                          if (singleOrderProduct) {
                            setSingleQuantity(Math.max(1, singleQuantity - 1));
                          } else {
                            updateQuantity(item.slug, item.cartQuantity - 1);
                          }
                        }}
                        disabled={displayItems.length === 1 && item.cartQuantity === 1}
                        className="rounded-md p-1 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-[14px] font-medium">{item.cartQuantity}</span>
                      <button 
                        onClick={() => {
                          if (singleOrderProduct) {
                            setSingleQuantity(singleQuantity + 1);
                          } else {
                            updateQuantity(item.slug, item.cartQuantity + 1);
                          }
                        }}
                        className="rounded-md p-1 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-[16px] font-bold">{(item.price * item.cartQuantity).toFixed(2)} EUR</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard size={20} />, icons: [<Visa key="v" />, <Mastercard key="m" />, <Maestro key="ma" />] },
                { id: 'paypal', name: 'PayPal', icon: <span className="font-bold italic text-blue-600">PayPal</span> },
                { id: 'transfer', name: 'Bank Transfer', icon: <ChevronRight size={20} /> }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`flex flex-col items-start gap-4 rounded-xl border-2 p-6 text-left transition-all ${
                    selectedPayment === method.id 
                      ? "border-[#2e4857] bg-[#2e4857]/5 ring-1 ring-[#2e4857]" 
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="rounded-full bg-gray-50 p-2 text-[#2e4857]">
                      {method.icon}
                    </div>
                    {selectedPayment === method.id && (
                      <CheckCircle2 size={20} className="text-[#2e4857]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#181b31]">{method.name}</h4>
                    {method.icons && (
                      <div className="mt-2 flex gap-2 grayscale opacity-50">
                        {method.icons.map((ic, i) => (
                          <div key={i} className="scale-75 origin-left">{ic}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-6 rounded-full bg-green-50 p-6 text-green-500">
                <CheckCircle2 size={64} />
              </div>
              <h3 className="text-[24px] font-bold text-[#181b31]">Order Placed Successfully!</h3>
              <p className="mt-2 max-w-md text-[#797b86]">
                We've received your order and are processing it. You will receive a confirmation email shortly.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-6">
          {step === 1 && (
            <div className="flex items-center justify-between gap-8">
              <div className="flex flex-col">
                <span className="text-[14px] font-light text-[#797b86] uppercase tracking-widest">Total Amount</span>
                <span className="text-[24px] font-bold text-[#181b31]">{totalPrice.toFixed(2)} EUR</span>
              </div>
              <button 
                onClick={handleNextStep}
                className="flex flex-1 items-center justify-center gap-3 rounded-lg bg-[#2e4857] h-14 text-[14px] font-bold uppercase tracking-[0.2em] text-white hover:bg-black transition-all"
              >
                Proceed to Payment
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border-2 border-gray-200 h-14 text-[14px] font-bold uppercase tracking-[0.2em] text-[#181b31] hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button 
                onClick={handlePlaceOrder}
                disabled={!selectedPayment}
                className="flex-[2] flex items-center justify-center gap-3 rounded-lg bg-[#2e4857] h-14 text-[14px] font-bold uppercase tracking-[0.2em] text-white hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Confirm & Place Order
              </button>
            </div>
          )}

          {step === 3 && (
            <button 
              onClick={closeOrderModal}
              className="w-full rounded-lg bg-[#2e4857] h-14 text-[14px] font-bold uppercase tracking-[0.2em] text-white hover:bg-black transition-all"
            >
              Back to Store
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
