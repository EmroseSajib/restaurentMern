"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveDiscounts, type OccasionDiscount } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface OccasionDiscountSliderProps {
  className?: string;
}

export function OccasionDiscountSlider({
  className,
}: OccasionDiscountSliderProps) {
  const [discounts, setDiscounts] = useState<OccasionDiscount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await getActiveDiscounts();
        setDiscounts(response.data);
      } catch {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  useEffect(() => {
    if (discounts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % discounts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [discounts.length]);

  if (isLoading) {
    return <Skeleton className={cn("h-24 w-full rounded-lg", className)} />;
  }

  if (discounts.length === 0) {
    return null;
  }

  const current = discounts[currentIndex];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-primary/10 p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="secondary" className="mb-2">
            {current.discountPercentage}% OFF
          </Badge>
          <h3 className="font-sans text-xl font-bold text-foreground">
            {current.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {current.description}
          </p>
        </div>
      </div>
      {discounts.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {discounts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === currentIndex ? "w-6 bg-primary" : "w-2 bg-border"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
