"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MenuItemCard } from "@/components/domain/menu-item-card"
import { MenuCategory } from "@/components/domain/menu-category"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { EmptyState } from "@/components/ui/empty-state"
import { useMenu, useCategories } from "@/hooks/use-menu"

interface Filters {
  vegetarian: boolean
  vegan: boolean
  glutenFree: boolean
  spicy: boolean
  containsNuts: boolean
  availableOnly: boolean
}

export function MenuPageContent() {
  const t = useTranslations("menu")
  const { menu, isLoading: menuLoading } = useMenu()
  const { categories, isLoading: categoriesLoading } = useCategories()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filters, setFilters] = useState<Filters>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    spicy: false,
    containsNuts: false,
    availableOnly: false,
  })

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      // Search filter
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false
      }

      // Dietary filters
      if (filters.vegetarian && !item.isVegetarian) return false
      if (filters.vegan && !item.isVegan) return false
      if (filters.glutenFree && !item.isGlutenFree) return false
      if (filters.spicy && !item.isSpicy) return false
      if (filters.containsNuts && !item.containsNuts) return false
      if (filters.availableOnly && !item.isAvailable) return false

      return true
    })
  }, [menu, searchQuery, selectedCategory, filters])

  const toggleFilter = (key: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const FiltersContent = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {(["vegetarian", "vegan", "glutenFree", "spicy", "containsNuts"] as const).map((key) => (
          <div key={key} className="flex items-center gap-3">
            <Checkbox id={key} checked={filters[key]} onCheckedChange={() => toggleFilter(key)} />
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
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-sans text-4xl md:text-5xl font-bold text-foreground">{t("title")}</h1>
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

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t("allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mobile Filters */}
        <Sheet>
          <SheetTrigger asChild className="sm:hidden">
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

        {/* Desktop Filters Button */}
        <div className="hidden sm:block">
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
        </div>
      </div>

      {/* Category Pills */}
      {!categoriesLoading && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <MenuCategory
            name={t("allCategories")}
            isActive={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
          />
          {categories.map((cat) => (
            <MenuCategory
              key={cat._id}
              name={cat.name}
              isActive={selectedCategory === cat._id}
              onClick={() => setSelectedCategory(cat._id)}
            />
          ))}
        </div>
      )}

      {/* Menu Grid */}
      {menuLoading ? (
        <SkeletonLoader variant="card" count={6} />
      ) : filteredMenu.length === 0 ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title={t("noItemsFound")}
          description="Try adjusting your search or filters"
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setFilters({
                  vegetarian: false,
                  vegan: false,
                  glutenFree: false,
                  spicy: false,
                  containsNuts: false,
                  availableOnly: false,
                })
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
