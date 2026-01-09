// "use client";

// import type { MenuItem } from "@/lib/data/menu";
// import { restaurantInfo } from "@/lib/data/restaurant";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export interface CartItem {
//   item: MenuItem;
//   quantity: number;
// }

// interface CartStore {
//   items: CartItem[];
//   deliveryType: "delivery" | "pickup";
//   voucherCode: string | null;
//   voucherDiscount: number;
//   addItem: (item: MenuItem) => void;
//   removeItem: (itemId: string) => void;
//   updateQuantity: (itemId: string, quantity: number) => void;
//   clearCart: () => void;
//   setDeliveryType: (type: "delivery" | "pickup") => void;
//   applyVoucher: (code: string) => { success: boolean; message: string };
//   removeVoucher: () => void;
//   getSubtotal: () => number;
//   getDeliveryFee: () => number;
//   getTax: () => number;
//   getTotal: () => number;
//   getTotalItems: () => number;
// }

// // Simulated voucher validation
// // TODO: Replace with real API call to validate vouchers
// const validateVoucher = (
//   code: string
// ): { valid: boolean; discount: number; message: string } => {
//   const vouchers: Record<
//     string,
//     { discount: number; type: "fixed" | "percent" }
//   > = {
//     WELCOME10: { discount: 10, type: "percent" },
//     DIWALI15: { discount: 15, type: "percent" },
//     GIFT25: { discount: 25, type: "fixed" },
//     GIFT50: { discount: 500, type: "fixed" },
//   };

//   const upperCode = code.toUpperCase();
//   if (vouchers[upperCode]) {
//     const voucher = vouchers[upperCode];
//     return {
//       valid: true,
//       discount: voucher.discount,
//       message:
//         voucher.type === "percent"
//           ? `${voucher.discount}% discount applied!`
//           : `€${voucher.discount} discount applied!`,
//     };
//   }
//   return { valid: false, discount: 0, message: "Invalid voucher code" };
// };

// export const useCartStore = create<CartStore>()(
//   persist(
//     (set, get) => ({
//       items: [],
//       deliveryType: "delivery",
//       voucherCode: null,
//       voucherDiscount: 0,

//       addItem: (item) => {
//         set((state) => {
//           const existingItem = state.items.find((i) => i.item.id === item.id);
//           if (existingItem) {
//             return {
//               items: state.items.map((i) =>
//                 i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
//               ),
//             };
//           }
//           return { items: [...state.items, { item, quantity: 1 }] };
//         });
//       },

//       removeItem: (itemId) => {
//         set((state) => ({
//           items: state.items.filter((i) => i.item.id !== itemId),
//         }));
//       },

//       updateQuantity: (itemId, quantity) => {
//         if (quantity <= 0) {
//           get().removeItem(itemId);
//           return;
//         }
//         set((state) => ({
//           items: state.items.map((i) =>
//             i.item.id === itemId ? { ...i, quantity } : i
//           ),
//         }));
//       },

//       clearCart: () => {
//         set({ items: [], voucherCode: null, voucherDiscount: 0 });
//       },

//       setDeliveryType: (type) => {
//         set({ deliveryType: type });
//       },

//       applyVoucher: (code) => {
//         const result = validateVoucher(code);
//         if (result.valid) {
//           set({
//             voucherCode: code.toUpperCase(),
//             voucherDiscount: result.discount,
//           });
//         }
//         return { success: result.valid, message: result.message };
//       },

//       removeVoucher: () => {
//         set({ voucherCode: null, voucherDiscount: 0 });
//       },

//       getSubtotal: () => {
//         return get().items.reduce(
//           (sum, item) => sum + item.item.price * item.quantity,
//           0
//         );
//       },

//       getDeliveryFee: () => {
//         const { deliveryType, items } = get();
//         if (deliveryType === "pickup" || items.length === 0) return 0;
//         return restaurantInfo.deliveryFee;
//       },

//       getTax: () => {
//         const subtotal = get().getSubtotal();
//         return subtotal * restaurantInfo.taxRate;
//       },

//       getTotal: () => {
//         const subtotal = get().getSubtotal();
//         const deliveryFee = get().getDeliveryFee();
//         const tax = get().getTax();
//         const { voucherDiscount, voucherCode } = get();

//         let discount = 0;
//         if (voucherCode && voucherDiscount > 0) {
//           // Check if it's a percentage or fixed discount based on value
//           if (voucherDiscount <= 20) {
//             // Percentage discount
//             discount = subtotal * (voucherDiscount / 100);
//           } else {
//             // Fixed discount
//             discount = voucherDiscount;
//           }
//         }

//         return Math.max(0, subtotal + deliveryFee + tax - discount);
//       },

//       getTotalItems: () => {
//         return get().items.reduce((sum, item) => sum + item.quantity, 0);
//       },
//     }),
//     {
//       name: "dekleineman-cart",
//     }
//   )
// );
"use client";

import { validateVoucherApi } from "@/app/api/vouchers/validate/voucher";
import { restaurantInfo } from "@/lib/data/restaurant";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      deliveryType: "delivery",
      discountAmount: 0,
      voucherCode: null,
      voucherDiscount: 0, // numeric discount value from backend
      voucherType: null, // "fixed" | "percent" (store it to calculate correctly)
      voucherMessage: null,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.item.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { item, quantity: 1 }] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.item.id === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          voucherCode: null,
          voucherDiscount: 0,
          voucherType: null,
          voucherMessage: null,
        });
      },

      setDeliveryType: (type) => {
        set({ deliveryType: type });
      },

      // ✅ REAL API voucher validation
      applyVoucher: async (code) => {
        const subtotal = get().getSubtotal();

        const result = await validateVoucherApi({
          code: code.toUpperCase(),
          subtotalAmount: subtotal,
          currency: "EUR",
        });

        if (!result.ok) {
          set({
            voucherCode: null,
            voucherDiscount: 0,
            discountAmount: 0,
            voucherType: null,
            voucherMessage: result.message,
          });
          return { success: false, message: result.message };
        }

        // ✅ Adjust these paths to match YOUR backend response
        // Example possibilities:
        // result.data.data.discountValue
        // result.data.data.value + result.data.data.type
        // result.data.discount
        const payload = result.data?.data || result.data;

        const type = payload?.type || payload?.discountType; // "fixed" | "percent"
        const value =
          payload?.value ?? payload?.discount ?? payload?.discountValue ?? 0;

        const message =
          payload?.message ||
          (type === "percent"
            ? `${value}% discount applied!`
            : `€${value} discount applied!`);

        set({
          voucherCode: code.toUpperCase(),
          voucherDiscount: Number(value) || 0,
          voucherType: type || "fixed",
          voucherMessage: message,
        });

        return { success: true, message };
      },

      removeVoucher: () => {
        set({
          voucherCode: null,
          voucherDiscount: 0,
          voucherType: null,
          voucherMessage: null,
        });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.item.price * item.quantity,
          0
        );
      },

      getDeliveryFee: () => {
        const { deliveryType, items } = get();
        if (deliveryType === "pickup" || items.length === 0) return 0;
        return restaurantInfo.deliveryFee;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return subtotal * restaurantInfo.taxRate;
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const { voucherDiscount, voucherType, voucherCode } = get();

        if (!voucherCode || !voucherDiscount) return 0;

        if (voucherType === "percent") {
          return subtotal * (voucherDiscount / 100);
        }
        // fixed
        return voucherDiscount;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTax();
        const discount = get().getDiscountAmount();

        return Math.max(0, subtotal + deliveryFee + tax - discount);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: "dekleineman-cart" }
  )
);
