// "use client";

// import type React from "react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Textarea } from "@/components/ui/textarea";
// import { useI18n } from "@/lib/i18n/context";
// import { useCartStore } from "@/lib/store/cart-store";
// import { cn } from "@/lib/utils";
// import { formatPrice, generateOrderNumber } from "@/lib/utils/format";
// import { loadStripe } from "@stripe/stripe-js";
// import { ArrowLeft, Building, CreditCard, Wallet } from "lucide-react";
// import { useState } from "react";
// interface CheckoutFormProps {
//   onBack: () => void;
//   onSuccess: (orderNumber: string) => void;
// }

// type PaymentMethod = "card" | "ideal" | "cash";

// interface FormData {
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   postalCode: string;
//   notes: string;
// }

// export function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
//   const { locale, t } = useI18n();
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     notes: "",
//   });
//   const [errors, setErrors] = useState<Partial<FormData>>({});
//   console.log("paymentMethod:", paymentMethod);
//   const {
//     items,
//     deliveryType,
//     getSubtotal,
//     getDeliveryFee,
//     getTax,
//     getTotal,
//     clearCart,
//   } = useCartStore();

//   const subtotal = getSubtotal();
//   const deliveryFee = getDeliveryFee();
//   const tax = getTax();
//   const total = getTotal();

//   const validateForm = (): boolean => {
//     const newErrors: Partial<FormData> = {};

//     if (!formData.name.trim()) newErrors.name = t.common.required;
//     if (!formData.email.trim()) newErrors.email = t.common.required;
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email";
//     }
//     if (!formData.phone.trim()) newErrors.phone = t.common.required;

//     if (deliveryType === "delivery") {
//       if (!formData.address.trim()) newErrors.address = t.common.required;
//       if (!formData.city.trim()) newErrors.city = t.common.required;
//       if (!formData.postalCode.trim()) newErrors.postalCode = t.common.required;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsProcessing(true);

//     try {
//       // Simulate payment processing
//       // TODO: Replace with real payment gateway integration (Stripe, Mollie, etc.)
//       // Example Stripe integration:
//       const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
//       const response = await fetch("/api/create-payment-intent", {
//         method: "POST",
//         body: JSON.stringify({ amount: total, items, customer: formData }),
//       });
//       const { clientSecret } = await response.json();
//       const result = await stripe.confirmCardPayment(clientSecret);

//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       // Generate order number
//       const orderNum = generateOrderNumber();

//       // Notify POS system
//       // TODO: Implement real POS notification
//       await notifyPOS({
//         orderNumber: orderNum,
//         items: items.map(({ item, quantity }) => ({
//           id: item.id,
//           name: item.name.en,
//           price: item.price,
//           quantity,
//         })),
//         customer: formData,
//         deliveryType,
//         total,
//         paymentMethod,
//       });

//       // Clear cart and show success
//       clearCart();
//       onSuccess(orderNum);
//     } catch (error) {
//       console.error("Payment error:", error);
//       // Handle error
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Placeholder POS notification function
//   // TODO: Replace with actual POS API integration
//   async function notifyPOS(orderData: {
//     orderNumber: string;
//     items: Array<{ id: string; name: string; price: number; quantity: number }>;
//     customer: FormData;
//     deliveryType: string;
//     total: number;
//     paymentMethod: string;
//   }) {
//     // This is where you would integrate with your POS system
//     // Examples:
//     // - Send to a webhook endpoint
//     // - Use POS API (e.g., Square, Toast, Clover)
//     // - Send to a printer via network
//     // - Push to a real-time dashboard

//     console.log("POS Notification:", orderData);

//     // Example API call:
//     // await fetch('/api/pos/notify', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(orderData),
//     // })

//     return Promise.resolve();
//   }

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: undefined }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white py-12">
//         <div className="container mx-auto px-4">
//           <Button
//             variant="ghost"
//             onClick={onBack}
//             className="text-white hover:bg-white/10 mb-4"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             {t.common.back}
//           </Button>
//           <h1 className="text-3xl md:text-4xl font-bold">{t.order.checkout}</h1>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Customer Information */}
//             <div className="lg:col-span-2 space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>{t.order.customerInfo.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="name">
//                         {t.order.customerInfo.name} *
//                       </Label>
//                       <Input
//                         id="name"
//                         value={formData.name}
//                         onChange={(e) =>
//                           handleInputChange("name", e.target.value)
//                         }
//                         className={cn(errors.name && "border-red-500")}
//                       />
//                       {errors.name && (
//                         <p className="text-xs text-red-500 mt-1">
//                           {errors.name}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <Label htmlFor="email">
//                         {t.order.customerInfo.email} *
//                       </Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) =>
//                           handleInputChange("email", e.target.value)
//                         }
//                         className={cn(errors.email && "border-red-500")}
//                       />
//                       {errors.email && (
//                         <p className="text-xs text-red-500 mt-1">
//                           {errors.email}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <Label htmlFor="phone">
//                         {t.order.customerInfo.phone} *
//                       </Label>
//                       <Input
//                         id="phone"
//                         type="tel"
//                         value={formData.phone}
//                         onChange={(e) =>
//                           handleInputChange("phone", e.target.value)
//                         }
//                         className={cn(errors.phone && "border-red-500")}
//                       />
//                       {errors.phone && (
//                         <p className="text-xs text-red-500 mt-1">
//                           {errors.phone}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {deliveryType === "delivery" && (
//                     <>
//                       <div>
//                         <Label htmlFor="address">
//                           {t.order.customerInfo.address} *
//                         </Label>
//                         <Input
//                           id="address"
//                           value={formData.address}
//                           onChange={(e) =>
//                             handleInputChange("address", e.target.value)
//                           }
//                           className={cn(errors.address && "border-red-500")}
//                         />
//                         {errors.address && (
//                           <p className="text-xs text-red-500 mt-1">
//                             {errors.address}
//                           </p>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <Label htmlFor="city">
//                             {t.order.customerInfo.city} *
//                           </Label>
//                           <Input
//                             id="city"
//                             value={formData.city}
//                             onChange={(e) =>
//                               handleInputChange("city", e.target.value)
//                             }
//                             className={cn(errors.city && "border-red-500")}
//                           />
//                           {errors.city && (
//                             <p className="text-xs text-red-500 mt-1">
//                               {errors.city}
//                             </p>
//                           )}
//                         </div>
//                         <div>
//                           <Label htmlFor="postalCode">
//                             {t.order.customerInfo.postalCode} *
//                           </Label>
//                           <Input
//                             id="postalCode"
//                             value={formData.postalCode}
//                             onChange={(e) =>
//                               handleInputChange("postalCode", e.target.value)
//                             }
//                             className={cn(
//                               errors.postalCode && "border-red-500"
//                             )}
//                           />
//                           {errors.postalCode && (
//                             <p className="text-xs text-red-500 mt-1">
//                               {errors.postalCode}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   <div>
//                     <Label htmlFor="notes">{t.order.customerInfo.notes}</Label>
//                     <Textarea
//                       id="notes"
//                       value={formData.notes}
//                       onChange={(e) =>
//                         handleInputChange("notes", e.target.value)
//                       }
//                       rows={3}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Payment Method */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>{t.order.payment.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <RadioGroup
//                     value={paymentMethod}
//                     onValueChange={(value) =>
//                       setPaymentMethod(value as PaymentMethod)
//                     }
//                     className="space-y-3"
//                   >
//                     <div
//                       className={cn(
//                         "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
//                         paymentMethod === "card"
//                           ? "border-amber-500 bg-amber-50"
//                           : "border-gray-200 hover:border-amber-300"
//                       )}
//                       onClick={() => setPaymentMethod("card")}
//                     >
//                       <RadioGroupItem value="card" id="card" />
//                       <CreditCard className="h-5 w-5 text-amber-600" />
//                       <Label htmlFor="card" className="flex-1 cursor-pointer">
//                         {t.order.payment.card}
//                       </Label>
//                     </div>
//                     <div
//                       className={cn(
//                         "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
//                         paymentMethod === "ideal"
//                           ? "border-amber-500 bg-amber-50"
//                           : "border-gray-200 hover:border-amber-300"
//                       )}
//                       onClick={() => setPaymentMethod("ideal")}
//                     >
//                       <RadioGroupItem value="ideal" id="ideal" />
//                       <Building className="h-5 w-5 text-amber-600" />
//                       <Label htmlFor="ideal" className="flex-1 cursor-pointer">
//                         {t.order.payment.ideal}
//                       </Label>
//                     </div>
//                     {deliveryType === "delivery" && (
//                       <div
//                         className={cn(
//                           "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
//                           paymentMethod === "cash"
//                             ? "border-amber-500 bg-amber-50"
//                             : "border-gray-200 hover:border-amber-300"
//                         )}
//                         onClick={() => setPaymentMethod("cash")}
//                       >
//                         <RadioGroupItem value="cash" id="cash" />
//                         <Wallet className="h-5 w-5 text-amber-600" />
//                         <Label htmlFor="cash" className="flex-1 cursor-pointer">
//                           {t.order.payment.cash}
//                         </Label>
//                       </div>
//                     )}
//                   </RadioGroup>

//                   {/* Mock payment form for card */}
//                   {paymentMethod === "card" && (
//                     <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
//                       <div>
//                         <Label>Card Number</Label>
//                         <Input placeholder="4242 4242 4242 4242" />
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                         <div>
//                           <Label>Expiry</Label>
//                           <Input placeholder="MM/YY" />
//                         </div>
//                         <div>
//                           <Label>CVC</Label>
//                           <Input placeholder="123" />
//                         </div>
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         Test mode - use 4242 4242 4242 4242 for testing
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Order Summary */}
//             <div>
//               <Card className="sticky top-32">
//                 <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
//                   <CardTitle>Order Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-4">
//                   {/* Items */}
//                   <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
//                     {items.map(({ item, quantity }) => (
//                       <div
//                         key={item.id}
//                         className="flex justify-between text-sm"
//                       >
//                         <span>
//                           {quantity}x {item.name[locale]}
//                         </span>
//                         <span>{formatPrice(item.price * quantity)}</span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Totals */}
//                   <div className="space-y-2 border-t pt-4">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">
//                         {t.order.subtotal}
//                       </span>
//                       <span>{formatPrice(subtotal)}</span>
//                     </div>
//                     {deliveryType === "delivery" && (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-muted-foreground">
//                           {t.order.deliveryFee}
//                         </span>
//                         <span>{formatPrice(deliveryFee)}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">
//                         {t.order.tax}
//                       </span>
//                       <span>{formatPrice(tax)}</span>
//                     </div>
//                     <div className="flex justify-between font-bold text-lg pt-2 border-t">
//                       <span>{t.order.total}</span>
//                       <span className="text-amber-600">
//                         {formatPrice(total)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Submit button */}
//                   <Button
//                     type="submit"
//                     disabled={isProcessing}
//                     className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6"
//                   >
//                     {isProcessing ? t.common.loading : t.order.payment.payNow}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/context";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";
import { formatPrice, generateOrderNumber } from "@/lib/utils/format";
import { ArrowLeft, Building, CreditCard, Wallet } from "lucide-react";

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: (orderNumber: string) => void;
}

type PaymentMethod = "card" | "ideal" | "cash";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

export function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const { locale, t } = useI18n();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const {
    items,
    deliveryType,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    clearCart,
  } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = t.common.required;
    if (!formData.email.trim()) newErrors.email = t.common.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.phone.trim()) newErrors.phone = t.common.required;

    if (deliveryType === "delivery") {
      if (!formData.address.trim()) newErrors.address = t.common.required;
      if (!formData.city.trim()) newErrors.city = t.common.required;
      if (!formData.postalCode.trim()) newErrors.postalCode = t.common.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Placeholder POS notification function
  // TODO: Replace with actual POS API integration
  async function notifyPOS(orderData: {
    orderNumber: string;
    items: Array<{ id: string; name: string; price: number; quantity: number }>;
    customer: FormData;
    deliveryType: string;
    total: number;
    paymentMethod: string;
  }) {
    console.log("POS Notification:", orderData);

    // Example:
    // await fetch("/api/pos/notify", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(orderData),
    // });

    return Promise.resolve();
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // CASH ON DELIVERY: no Stripe
      if (paymentMethod === "cash") {
        const orderNum = generateOrderNumber();

        await notifyPOS({
          orderNumber: orderNum,
          items: items.map(({ item, quantity }) => ({
            id: item.id,
            name: item.name.en,
            price: item.price,
            quantity,
          })),
          customer: formData,
          deliveryType,
          total,
          paymentMethod,
        });

        clearCart();
        onSuccess(orderNum);
        return;
      }

      // CARD or iDEAL -> Stripe Checkout
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: formData,
          deliveryType,
          total,
          paymentMethod, // "card" or "ideal"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Stripe error:", data.error);
        alert("Payment error: " + (data.error || "Please try again."));
        return;
      }

      // Redirect to Stripe hosted payment page
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.common.back}
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold">{t.order.checkout}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.order.customerInfo.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">
                        {t.order.customerInfo.name} *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={cn(errors.name && "border-red-500")}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">
                        {t.order.customerInfo.email} *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={cn(errors.email && "border-red-500")}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">
                        {t.order.customerInfo.phone} *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={cn(errors.phone && "border-red-500")}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {deliveryType === "delivery" && (
                    <>
                      <div>
                        <Label htmlFor="address">
                          {t.order.customerInfo.address} *
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          className={cn(errors.address && "border-red-500")}
                        />
                        {errors.address && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">
                            {t.order.customerInfo.city} *
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                            className={cn(errors.city && "border-red-500")}
                          />
                          {errors.city && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors.city}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="postalCode">
                            {t.order.customerInfo.postalCode} *
                          </Label>
                          <Input
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={(e) =>
                              handleInputChange("postalCode", e.target.value)
                            }
                            className={cn(
                              errors.postalCode && "border-red-500"
                            )}
                          />
                          {errors.postalCode && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors.postalCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="notes">{t.order.customerInfo.notes}</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.order.payment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as PaymentMethod)
                    }
                    className="space-y-3"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                        paymentMethod === "card"
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      )}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="h-5 w-5 text-amber-600" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        {t.order.payment.card}
                      </Label>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                        paymentMethod === "ideal"
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      )}
                      onClick={() => setPaymentMethod("ideal")}
                    >
                      <RadioGroupItem value="ideal" id="ideal" />
                      <Building className="h-5 w-5 text-amber-600" />
                      <Label htmlFor="ideal" className="flex-1 cursor-pointer">
                        {t.order.payment.ideal}
                      </Label>
                    </div>
                    {deliveryType === "delivery" && (
                      <div
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                          paymentMethod === "cash"
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-amber-300"
                        )}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <RadioGroupItem value="cash" id="cash" />
                        <Wallet className="h-5 w-5 text-amber-600" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          {t.order.payment.cash}
                        </Label>
                      </div>
                    )}
                  </RadioGroup>

                  <p className="mt-3 text-xs text-muted-foreground">
                    {paymentMethod === "cash"
                      ? "You will pay in cash upon delivery."
                      : "You will be redirected to a secure Stripe payment page to complete your payment."}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-32">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Items */}
                  <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                    {items.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {quantity}x {item.name[locale]}
                        </span>
                        <span>{formatPrice(item.price * quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t.order.subtotal}
                      </span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {deliveryType === "delivery" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t.order.deliveryFee}
                        </span>
                        <span>{formatPrice(deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t.order.tax}
                      </span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>{t.order.total}</span>
                      <span className="text-amber-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6"
                  >
                    {isProcessing ? t.common.loading : t.order.payment.payNow}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
