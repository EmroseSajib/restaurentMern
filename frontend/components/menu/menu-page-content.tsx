"use client";

import { MenuCategory } from "@/components/domain/menu-category";
import { MenuItemCard } from "@/components/domain/menu-item-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCategoriesData, useMenuData } from "@/hooks/use-menu-data";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface Filters {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  spicy: boolean;
  containsNuts: boolean;
  availableOnly: boolean;
}

export function MenuPageContent() {
  const t = useTranslations("menu");
  const locale = useLocale() as "en" | "nl" | "de";

  const { categories, isLoading: categoriesLoading } = useCategoriesData();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 350);

  // ✅ category filter should use slug
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [filters, setFilters] = useState<Filters>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    spicy: false,
    containsNuts: false,
    availableOnly: false,
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // ✅ backend query params
  const menuParams = useMemo(() => {
    return {
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      q: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
      limit: 24,

      available: filters.availableOnly || undefined,
      spicy: filters.spicy || undefined,
      vegetarian: filters.vegetarian || undefined,
      vegan: filters.vegan || undefined,
      glutenFree: filters.glutenFree || undefined,
      nuts: filters.containsNuts || undefined,
    };
  }, [selectedCategory, debouncedQuery, filters]);

  const {
    items,
    isLoading: menuLoading,
    error,
    hasMore,
    loadMore,
    refetch,
  } = useMenuData(menuParams);

  const toggleFilter = (key: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const FiltersContent = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {(
          [
            "vegetarian",
            "vegan",
            "glutenFree",
            "spicy",
            "containsNuts",
          ] as const
        ).map((key) => (
          <div key={key} className="flex items-center gap-3">
            <Checkbox
              id={key}
              checked={filters[key]}
              onCheckedChange={() => toggleFilter(key)}
            />
            <Label htmlFor={key} className="cursor-pointer">
              {t(`dietary.${key}`)}
            </Label>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t">
        <div className="flex items-center gap-3">
          <Checkbox
            id="availableOnly"
            checked={filters.availableOnly}
            onCheckedChange={() => toggleFilter("availableOnly")}
          />
          <Label htmlFor="availableOnly" className="cursor-pointer">
            {t("availableOnly")}
          </Label>
        </div>
      </div>
    </div>
  );

  const categoryLabel = (cat: any) =>
    cat?.name?.[locale] ?? cat?.name?.en ?? cat?.slug;

  const clearAll = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setFilters({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: false,
      containsNuts: false,
      availableOnly: false,
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-sans text-4xl md:text-5xl font-bold text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* ✅ Select uses slug */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder={t("allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {categoryLabel(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filters Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <SlidersHorizontal className="h-4 w-4" />
              {t("filters")}
              {activeFiltersCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{t("filters")}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          onClick={refetch}
          disabled={menuLoading}
          className="hidden sm:inline-flex"
        >
          Refresh
        </Button>
      </div>

      {/* ✅ Category Pills (unique, quick filter) */}
      {!categoriesLoading && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <MenuCategory
            name={t("allCategories")}
            isActive={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
          />
          {categories.map((cat) => (
            <MenuCategory
              key={cat.id}
              name={categoryLabel(cat)}
              isActive={selectedCategory === cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
            />
          ))}
        </div>
      )}

      {/* Menu Grid */}
      {menuLoading && items.length === 0 ? (
        <SkeletonLoader variant="card" count={6} />
      ) : error ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="Failed to load menu"
          description={error}
          action={
            <Button variant="outline" onClick={refetch}>
              Try again
            </Button>
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title={t("noItemsFound")}
          description="Try adjusting your search or filters"
          action={
            <Button variant="outline" onClick={clearAll}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item as any} />
            ))}
          </div>

          {/* ✅ Load more */}
          <div className="mt-8 flex justify-center">
            {hasMore ? (
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={menuLoading}
              >
                {menuLoading ? "Loading..." : "Load more"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                You’ve reached the end.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
