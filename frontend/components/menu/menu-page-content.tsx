"use client";

import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { menuCategories, menuItems, type MenuCategory } from "@/lib/data/menu";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";

export function MenuPageContent() {
  const { locale, t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);

  // Filter and search menu items
  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    // Filter by category
    if (activeCategory !== "all") {
      items = items.filter((item) => item.category === activeCategory);
    }

    // Filter by vegetarian
    if (showVegetarianOnly) {
      items = items.filter((item) => item.dietary?.includes("vegetarian"));
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name[locale].toLowerCase().includes(query) ||
          item.description[locale].toLowerCase().includes(query),
      );
    }

    return items;
  }, [activeCategory, searchQuery, showVegetarianOnly, locale]);

  // Group items by category for display
  const groupedItems = useMemo(() => {
    if (activeCategory !== "all") {
      return { [activeCategory]: filteredItems };
    }

    const groups: Record<string, typeof filteredItems> = {};
    menuCategories.forEach(({ key }) => {
      const categoryItems = filteredItems.filter(
        (item) => item.category === key,
      );
      if (categoryItems.length > 0) {
        groups[key] = categoryItems;
      }
    });
    return groups;
  }, [filteredItems, activeCategory]);

  const categoryLabels: Record<MenuCategory | "all", string> = {
    all: locale === "nl" ? "Alles" : locale === "de" ? "Alle" : "All",
    popular: t.menu.categories.popular,
    main: t.menu.categories.main,
    starters: t.menu.categories.starters,
    traditional: t.menu.categories.traditional,
    tandoori: t.menu.categories.tandoori,
    kufte: t.menu.categories.kufte,
    sides: t.menu.categories.sides,
    desserts: t.menu.categories.desserts,
    drinks: t.menu.categories.drinks,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.menu.title}
          </h1>
          <p className="text-xl text-amber-100/80">{t.menu.subtitle}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-16 lg:top-24 z-40 bg-white/95 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-4">
          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={
                  locale === "nl"
                    ? "Zoek gerechten..."
                    : locale === "de"
                      ? "Gerichte suchen..."
                      : "Search dishes..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <button
              onClick={() => setShowVegetarianOnly(!showVegetarianOnly)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                showVegetarianOnly
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
              )}
            >
              <Filter className="h-4 w-4" />
              {t.menu.vegetarian}
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === "all"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-200",
              )}
            >
              {categoryLabels.all}
            </button>
            {menuCategories.map(({ key }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeCategory === key
                    ? "bg-amber-500 text-white"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200",
                )}
              >
                {categoryLabels[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              {locale === "nl"
                ? "Geen gerechten gevonden"
                : locale === "de"
                  ? "Keine Gerichte gefunden"
                  : "No dishes found"}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedItems).map(([category, items]) => (
              <section key={category} id={category}>
                {/* Category header */}
                {activeCategory === "all" && (
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-amber-900">
                      {categoryLabels[category as MenuCategory]}
                    </h2>
                    <div className="flex-1 h-px bg-amber-200" />
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800"
                    >
                      {items.length}{" "}
                      {locale === "nl"
                        ? "gerechten"
                        : locale === "de"
                          ? "Gerichte"
                          : "dishes"}
                    </Badge>
                  </div>
                )}

                {/* Items grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Dietary legend */}
      <div className="container mx-auto px-4 py-8 border-t border-amber-200">
        <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98A4 4 0 117.5 4a4.002 4.002 0 017.5 1.5 4 4 0 011.5 3.48V12a3.5 3.5 0 01-3.5 3.5h-7z" />
              </svg>
            </div>
            <span>{t.menu.vegetarian}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
            </div>
            <span>{t.menu.glutenFree}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Filter, Search } from "lucide-react";
// import { useMemo, useState } from "react";
// import useSWR from "swr";

// import { getCategories, getMenu, localizeText } from "@/app/api/menu/menu";
// import { MenuItemCard } from "@/components/menu/menu-item-card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { useI18n } from "@/lib/i18n/context";
// import { cn } from "@/lib/utils";

// const fetcher = (fn) => fn();

// export function MenuPageContent() {
//   const { locale, t } = useI18n();

//   const [activeCategory, setActiveCategory] = useState("all"); // slug or "all"
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);

//   const [page, setPage] = useState(1);
//   const limit = 24;

//   // ---- Categories ----
//   const {
//     data: catResp,
//     isLoading: catLoading,
//     error: catError,
//   } = useSWR("menu-categories", () => fetcher(getCategories), {
//     revalidateOnFocus: false,
//   });

//   const categories = catResp?.data ?? []; // your API: { success, data: [...] }

//   // ---- Menu items ----
//   const menuKey = useMemo(() => {
//     return ["menu", activeCategory, searchQuery.trim(), page, limit].join("|");
//   }, [activeCategory, searchQuery, page, limit]);

//   const {
//     data: menuResp,
//     isLoading: menuLoading,
//     error: menuError,
//   } = useSWR(
//     ["menu", activeCategory, page, limit, searchQuery].join("|"),
//     async () => {
//       const params =
//         activeCategory === "all"
//           ? { page, limit } // ✅ All = /v1/menu?page=1&limit=24
//           : {
//               category: activeCategory, // ✅ slug
//               available: true,
//               spicy: true,
//               q: searchQuery.trim() || undefined,
//               page,
//               limit,
//             };

//       return getMenu(params);
//     },
//     { revalidateOnFocus: false }
//   );

//   const apiItems = menuResp?.data?.items ?? [];
//   const total = menuResp?.data?.total ?? 0;

//   // Local vegetarian filter (because your menu API example doesn't include vegetarian query)
//   const filteredItems = useMemo(() => {
//     let items = [...apiItems];

//     if (showVegetarianOnly) {
//       items = items.filter((i) => i.vegetarian === true);
//     }

//     // Extra local search safety (if backend q is not perfect)
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       items = items.filter((i) => {
//         const name = localizeText(i.name, locale).toLowerCase();
//         const desc = localizeText(i.description, locale).toLowerCase();
//         return name.includes(q) || desc.includes(q);
//       });
//     }

//     items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
//     return items;
//   }, [apiItems, showVegetarianOnly, searchQuery, locale]);

//   // Group by categoryId for display when "all"
//   const groupedItems = useMemo(() => {
//     if (activeCategory !== "all") {
//       return { [activeCategory]: filteredItems }; // single section
//     }

//     const groups = {};
//     categories.forEach((cat) => {
//       const list = filteredItems.filter((item) => item.categoryId === cat.id);
//       if (list.length) groups[cat.id] = list;
//     });

//     // fallback if categories not loaded yet
//     if (!categories.length && filteredItems.length) {
//       groups["all"] = filteredItems;
//     }

//     return groups;
//   }, [filteredItems, activeCategory, categories]);

//   const categoryLabelById = (categoryId) => {
//     const cat = categories.find((c) => c.id === categoryId);
//     return cat ? localizeText(cat.name, locale) : "Category";
//   };

//   const loading = catLoading || menuLoading;
//   const error = catError || menuError;

//   const canPrev = page > 1;
//   const canNext = page * limit < total;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white py-16">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">
//             {t.menu.title}
//           </h1>
//           <p className="text-xl text-amber-100/80">{t.menu.subtitle}</p>
//         </div>
//       </div>

//       {/* Filters & Search */}
//       <div className="sticky top-16 lg:top-24 z-40 bg-white/95 backdrop-blur-md shadow-md">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex flex-col md:flex-row gap-4 mb-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder={
//                   locale === "nl"
//                     ? "Zoek gerechten..."
//                     : locale === "de"
//                     ? "Gerichte suchen..."
//                     : "Search dishes..."
//                 }
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setPage(1);
//                 }}
//                 className="pl-10"
//               />
//             </div>

//             <button
//               onClick={() => {
//                 setShowVegetarianOnly((v) => !v);
//                 setPage(1);
//               }}
//               className={cn(
//                 "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
//                 showVegetarianOnly
//                   ? "bg-green-100 border-green-500 text-green-700"
//                   : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
//               )}
//             >
//               <Filter className="h-4 w-4" />
//               {t.menu.vegetarian}
//             </button>
//           </div>

//           {/* Category tabs from API */}
//           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
//             <button
//               onClick={() => {
//                 setActiveCategory("all");
//                 setPage(1);
//               }}
//               className={cn(
//                 "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
//                 activeCategory === "all"
//                   ? "bg-amber-500 text-white"
//                   : "bg-amber-100 text-amber-800 hover:bg-amber-200"
//               )}
//             >
//               {locale === "nl" ? "Alles" : locale === "de" ? "Alle" : "All"}
//             </button>

//             {categories.map((cat) => (
//               <button
//                 key={cat.id}
//                 onClick={() => {
//                   setActiveCategory(cat.slug); // IMPORTANT: use slug for query param
//                   setPage(1);
//                 }}
//                 className={cn(
//                   "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
//                   activeCategory === cat.slug
//                     ? "bg-amber-500 text-white"
//                     : "bg-amber-100 text-amber-800 hover:bg-amber-200"
//                 )}
//               >
//                 {localizeText(cat.name, locale)}
//               </button>
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between mt-4">
//             <div className="text-sm text-muted-foreground">
//               {total
//                 ? `${total} ${
//                     locale === "de"
//                       ? "Gerichte"
//                       : locale === "nl"
//                       ? "gerechten"
//                       : "dishes"
//                   }`
//                 : ""}
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 className="px-3 py-2 rounded-lg border disabled:opacity-50"
//                 disabled={!canPrev}
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//               >
//                 Prev
//               </button>
//               <span className="text-sm">Page {page}</span>
//               <button
//                 className="px-3 py-2 rounded-lg border disabled:opacity-50"
//                 disabled={!canNext}
//                 onClick={() => setPage((p) => p + 1)}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 py-8">
//         {loading ? (
//           <div className="text-center py-16 text-muted-foreground">
//             Loading...
//           </div>
//         ) : error ? (
//           <div className="text-center py-16 text-red-600">
//             {String(error.message || error)}
//           </div>
//         ) : filteredItems.length === 0 ? (
//           <div className="text-center py-16">
//             <p className="text-lg text-muted-foreground">
//               {locale === "nl"
//                 ? "Geen gerechten gevonden"
//                 : locale === "de"
//                 ? "Keine Gerichte gefunden"
//                 : "No dishes found"}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-12">
//             {Object.entries(groupedItems).map(([groupKey, items]) => (
//               <section key={groupKey} id={groupKey}>
//                 {/* Category header only when "all" */}
//                 {activeCategory === "all" && groupKey !== "all" && (
//                   <div className="flex items-center gap-4 mb-6">
//                     <h2 className="text-2xl font-bold text-amber-900">
//                       {categoryLabelById(groupKey)}
//                     </h2>
//                     <div className="flex-1 h-px bg-amber-200" />
//                     <Badge
//                       variant="secondary"
//                       className="bg-amber-100 text-amber-800"
//                     >
//                       {items.length}{" "}
//                       {locale === "nl"
//                         ? "gerechten"
//                         : locale === "de"
//                         ? "Gerichte"
//                         : "dishes"}
//                     </Badge>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                   {items.map((item) => (
//                     <MenuItemCard key={item.id} item={item} />
//                   ))}
//                 </div>
//               </section>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
