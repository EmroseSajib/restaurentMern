// "use client"

// import { useState } from "react"
// import { MenuItemCard } from "@/components/menu/menu-item-card"
// import { CartSidebar } from "@/components/order/cart-sidebar"
// import { CheckoutForm } from "@/components/order/checkout-form"
// import { OrderSuccess } from "@/components/order/order-success"
// import { useI18n } from "@/lib/i18n/context"
// import { menuItems, menuCategories, type MenuCategory } from "@/lib/data/menu"
// import { useCartStore } from "@/lib/store/cart-store"
// import { cn } from "@/lib/utils"

// type OrderStep = "menu" | "checkout" | "success"

// export function OrderPageContent() {
//   const { locale, t } = useI18n()
//   const [step, setStep] = useState<OrderStep>("menu")
//   const [activeCategory, setActiveCategory] = useState<MenuCategory>("popular")
//   const [orderNumber, setOrderNumber] = useState<string>("")
//   const items = useCartStore((state) => state.items)

//   const categoryLabels: Record<MenuCategory, string> = {
//     popular: t.menu.categories.popular,
//     main: t.menu.categories.main,
//     starters: t.menu.categories.starters,
//     traditional: t.menu.categories.traditional,
//     tandoori: t.menu.categories.tandoori,
//     kufte: t.menu.categories.kufte,
//     sides: t.menu.categories.sides,
//     desserts: t.menu.categories.desserts,
//     drinks: t.menu.categories.drinks,
//   }

//   const filteredItems = menuItems.filter((item) => item.category === activeCategory)

//   const handleCheckout = () => {
//     setStep("checkout")
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }

//   const handleOrderSuccess = (orderNum: string) => {
//     setOrderNumber(orderNum)
//     setStep("success")
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }

//   const handleBackToMenu = () => {
//     setStep("menu")
//   }

//   if (step === "success") {
//     return <OrderSuccess orderNumber={orderNumber} />
//   }

//   if (step === "checkout") {
//     return <CheckoutForm onBack={handleBackToMenu} onSuccess={handleOrderSuccess} />
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white py-12">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.order.title}</h1>
//           <p className="text-xl text-amber-100/80">{t.order.subtitle}</p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Menu Section */}
//           <div className="flex-1">
//             {/* Category tabs */}
//             <div className="sticky top-24 lg:top-32 z-30 bg-white/95 backdrop-blur-md rounded-xl shadow-md p-4 mb-6">
//               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
//                 {menuCategories.map(({ key }) => (
//                   <button
//                     key={key}
//                     onClick={() => setActiveCategory(key)}
//                     className={cn(
//                       "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
//                       activeCategory === key
//                         ? "bg-amber-500 text-white"
//                         : "bg-amber-100 text-amber-800 hover:bg-amber-200",
//                     )}
//                   >
//                     {categoryLabels[key]}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Menu items grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {filteredItems.map((item) => (
//                 <MenuItemCard key={item.id} item={item} variant="compact" />
//               ))}
//             </div>
//           </div>

//           {/* Cart Sidebar */}
//           <div className="w-full lg:w-96 shrink-0">
//             <div className="lg:sticky lg:top-32">
//               <CartSidebar onCheckout={handleCheckout} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import { getCategories, getMenu, localizeText } from "@/app/api/menu/menu";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { CartSidebar } from "@/components/order/cart-sidebar";
import { CheckoutForm } from "@/components/order/checkout-form";
import { OrderSuccess } from "@/components/order/order-success";
import { useI18n } from "@/lib/i18n/context";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

export function OrderPageContent() {
  const { locale, t } = useI18n();

  // steps
  const [step, setStep] = useState("menu"); // "menu" | "checkout" | "success"
  const [orderNumber, setOrderNumber] = useState("");

  // categories/menu filters
  const [activeCategorySlug, setActiveCategorySlug] = useState("all"); // slug or "all"
  const [page] = useState(1);
  const [limit] = useState(24);

  // cart store (kept)
  const items = useCartStore((state) => state.items);

  // ---- categories from API ----
  const {
    data: catResp,
    isLoading: catLoading,
    error: catError,
  } = useSWR("menu-categories", getCategories, { revalidateOnFocus: false });

  const categories = catResp?.data ?? [];

  // ---- menu items from API ----
  const menuKey = useMemo(
    () => ["menu", activeCategorySlug, page, limit].join("|"),
    [activeCategorySlug, page, limit]
  );

  const {
    data: menuResp,
    isLoading: menuLoading,
    error: menuError,
  } = useSWR(
    menuKey,
    async () => {
      const params =
        activeCategorySlug === "all"
          ? { page, limit } // ✅ All = /v1/menu?page=1&limit=24
          : { category: activeCategorySlug, page, limit }; // ✅ category = slug

      return getMenu(params);
    },
    { revalidateOnFocus: false }
  );

  const apiItems = menuResp?.data?.items ?? [];

  // If you want to sort by sortOrder (API provides it)
  const filteredItems = useMemo(() => {
    const arr = [...apiItems];
    arr.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return arr;
  }, [apiItems]);

  // ----- handlers -----
  const handleCheckout = () => {
    setStep("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderSuccess = (orderNum) => {
    setOrderNumber(orderNum);
    setStep("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToMenu = () => setStep("menu");

  if (step === "success") {
    return <OrderSuccess orderNumber={orderNumber} />;
  }

  if (step === "checkout") {
    return (
      <CheckoutForm onBack={handleBackToMenu} onSuccess={handleOrderSuccess} />
    );
  }

  const loading = catLoading || menuLoading;
  const error = catError || menuError;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.order.title}
          </h1>
          <p className="text-xl text-amber-100/80">{t.order.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Section */}
          <div className="flex-1">
            {/* Category tabs */}
            <div className="sticky top-24 lg:top-32 z-30 bg-white/95 backdrop-blur-md rounded-xl shadow-md p-4 mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {/* Optional ALL */}
                <button
                  onClick={() => setActiveCategorySlug("all")}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    activeCategorySlug === "all"
                      ? "bg-amber-500 text-white"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  )}
                >
                  {locale === "nl" ? "Alles" : locale === "de" ? "Alle" : "All"}
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategorySlug(cat.slug)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      activeCategorySlug === cat.slug
                        ? "bg-amber-500 text-white"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    )}
                  >
                    {localizeText(cat.name, locale)}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">
                Loading...
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-600">
                {String(error.message || error)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredItems.map((item, idx) => (
                  <MenuItemCard
                    key={item.id ?? `${item.categoryId}-${idx}`}
                    item={item}
                    variant="compact"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="lg:sticky lg:top-32">
              <CartSidebar onCheckout={handleCheckout} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
