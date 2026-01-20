"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { restaurantInfo } from "@/lib/data/restaurant";
import { useI18n } from "@/lib/i18n/context";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/format";
import {
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";

export function CartSidebar({ onCheckout }) {
  const { locale, t } = useI18n();

  const [voucherInput, setVoucherInput] = useState("");
  const [voucherMessage, setVoucherMessage] = useState(null);

  const {
    items,
    deliveryType,
    voucherCode,
    voucherDiscount,
    updateQuantity,
    removeItem,
    discountAmount,
    setDeliveryType,
    applyVoucher,
    removeVoucher,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
  } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();

  const minimumMet =
    subtotal >= restaurantInfo.minimumOrder || deliveryType === "pickup";

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;

    try {
      const result = await applyVoucher(voucherInput);

      setVoucherMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      });

      if (result.success) {
        setVoucherInput("");
      }
    } catch (e) {
      setVoucherMessage({
        type: "error",
        text: e?.message || "Something went wrong",
      });
    }
  };

  return (
    <Card className="shadow-xl border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {t.order.cart}
          {items.length > 0 && (
            <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{t.order.emptyCart}</p>
          </div>
        ) : (
          <>
            {/* Delivery type */}
            <div className="mb-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm font-medium text-amber-900 mb-2">
                {t.order.deliveryType.title}
              </p>

              <RadioGroup
                value={deliveryType}
                onValueChange={setDeliveryType}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    {t.order.deliveryType.delivery}
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="flex items-center gap-1">
                    <Store className="h-4 w-4" />
                    {t.order.deliveryType.pickup}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Cart items */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.name[locale]}
                    </p>
                    <p className="text-amber-600 font-semibold text-sm">
                      {formatPrice(item.price * quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="w-6 text-center text-sm font-medium">
                      {quantity}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Voucher */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {t.order.voucher.title}
              </p>

              {voucherCode ? (
                <div className="flex items-center justify-between bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                  <span className="font-medium">{voucherCode}</span>
                  <Button variant="ghost" size="sm" onClick={removeVoucher}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder={t.order.voucher.placeholder}
                  />
                  <Button onClick={handleApplyVoucher} size="sm">
                    {t.order.voucher.apply}
                  </Button>
                </div>
              )}

              {voucherMessage && (
                <p
                  className={cn(
                    "text-xs mt-2",
                    voucherMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-500"
                  )}
                >
                  {voucherMessage.text}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>{t.order.subtotal}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {deliveryType === "delivery" && (
                <div className="flex justify-between text-sm">
                  <span>{t.order.deliveryFee}</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>{t.order.tax}</span>
                <span>{formatPrice(tax)}</span>
              </div>

              {voucherCode && voucherDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>
                    -
                    {formatPrice(
                      voucherDiscount <= 20
                        ? subtotal * (voucherDiscount / 100)
                        : voucherDiscount
                    )}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>{t.order.total}</span>
                <span className="text-amber-600">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              onClick={onCheckout}
              disabled={!minimumMet}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-6"
            >
              {t.order.checkout}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
