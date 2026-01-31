"use client";

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
import { formatPrice } from "@/lib/utils/format";
import { ArrowLeft, Building, Wallet } from "lucide-react";

export function CheckoutForm({ onBack, onSuccess }) {
  const { locale, t } = useI18n();

  const [paymentMethod, setPaymentMethod] = useState("cash"); // "card" | "ideal" | "cash"
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const [errors, setErrors] = useState({}); // { name?: string, email?: string, ... }

  const {
    items,
    deliveryType,
    getSubtotal,
    getDeliveryFee,
    // getTax,
    getTotal,
    clearCart,
  } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  // const tax = getTax();
  const total = getTotal();

  const validateForm = () => {
    const newErrors = {};

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
  async function notifyPOS(orderData) {
    console.log("POS Notification:", orderData);
    return Promise.resolve();
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const API =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

      // Build payload to match your Order schema
      const payload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
        fulfillment: {
          type: deliveryType, // "delivery" | "pickup"
          address: {
            line1: formData.address || "",
            postalCode: formData.postalCode || "",
            city: formData.city || "",
            country: "NL",
          },
          notes: formData.notes || "",
        },
        items: items.map(({ item, quantity }) => ({
          menuItemId: item.id,
          nameSnapshot: {
            en: item.name?.en || "",
            nl: item.name?.nl || "",
            de: item.name?.de || "",
          },
          unitPrice: item.price,
          quantity,
          isMainDish: !!item.isMainDish,
          vegetarian: !!item.vegetarian,
          vegan: !!item.vegan,
          glutenFree: !!item.glutenFree,
          spicy: !!item.spicy,
          nuts: !!item.nuts,
        })),
        bonus: { type: "none", price: 0 },
        discounts: { voucherCode: "", membershipId: "", discountTotal: 0 },
        totals: { subtotal, total },
      };

      // CASH -> create COD order
      if (paymentMethod === "cash") {
        const res = await fetch(`${API}/v1/payments/orders/cod`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.success === false)
          throw new Error(data?.message || "COD failed");

        clearCart();
        onSuccess(data.data.orderNumber);
        return;
      }

      // STRIPE -> create session
      const res = await fetch(`${API}/v1/payments/stripe/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          paymentMethod, // "card" | "ideal"
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false)
        throw new Error(data?.message || "Stripe failed");

      window.location.href = data.data.url;
    } catch (err) {
      console.error(err);
      alert(err?.message || "Payment failed");
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
                              errors.postalCode && "border-red-500",
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
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                <Label
                  htmlFor="card"
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    paymentMethod === "card"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300",
                  )}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Building className="h-5 w-5 text-amber-600" />
                  <span className="flex-1">{t.order.payment.card}</span>
                </Label>
                <Label
                  htmlFor="ideal"
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    paymentMethod === "ideal"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300",
                  )}
                >
                  <RadioGroupItem value="ideal" id="ideal" />
                  <Building className="h-5 w-5 text-amber-600" />
                  <span className="flex-1">{t.order.payment.ideal}</span>
                </Label>

                <Label
                  htmlFor="cash"
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    paymentMethod === "cash"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300",
                  )}
                >
                  <RadioGroupItem value="cash" id="cash" />
                  <Wallet className="h-5 w-5 text-amber-600" />
                  <span className="flex-1">{t.order.payment.cash}</span>
                </Label>
              </RadioGroup>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-32">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="p-4">
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

                    {/* <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t.order.tax}
                      </span>
                      <span>{formatPrice(tax)}</span>
                    </div> */}

                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>{t.order.total}</span>
                      <span className="text-amber-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

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
