"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  text: {
    en: string;
    nl: string;
    de: string;
  };
  rating: number;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Gurpreet Seehra",
    text: {
      en: "Very tasty food and he quantity is very good. The best dishes were tandoori chicken and mutton rogan Josh. The naan bread was also perfect. Must visit again",
      nl: "Very tasty food and he quantity is very good. The best dishes were tandoori chicken and mutton rogan Josh. The naan bread was also perfect. Must visit again",
      de: "Very tasty food and he quantity is very good. The best dishes were tandoori chicken and mutton rogan Josh. The naan bread was also perfect. Must visit again",
    },
    rating: 5,
    date: "2025-11-15",
  },
  {
    id: "2",
    name: "Andrea Rabadan",
    text: {
      en: "It was incredibly tasty, beyond my expectations and super nice staff.",
      nl: "It was incredibly tasty, beyond my expectations and super nice staff.",
      de: "It was incredibly tasty, beyond my expectations and super nice staff.",
    },
    rating: 5,
    date: "2025-10-28",
  },
  {
    id: "3",
    name: "Sunny Sahota",
    text: {
      en: "This place is seriously good! The food is delicious, the owners are friendly and did I mention the food was delicious! Would highly recommend. Balti dishes, meat samosa, onion bhaji, paneer and kufta dishes,Finger licking good!",
      nl: "This place is seriously good! The food is delicious, the owners are friendly and did I mention the food was delicious! Would highly recommend. Balti dishes, meat samosa, onion bhaji, paneer and kufta dishes,Finger licking good!",
      de: "This place is seriously good! The food is delicious, the owners are friendly and did I mention the food was delicious! Would highly recommend. Balti dishes, meat samosa, onion bhaji, paneer and kufta dishes,Finger licking good!",
    },
    rating: 5,
    date: "2025-12-01",
  },
];

export function TestimonialsSection() {
  const { locale, t } = useI18n();

  return (
    <section className="py-20 bg-gradient-to-b from-amber-900 to-amber-950 text-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-3">
            {t.testimonials.title}
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-amber-800/30 border-amber-700/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-amber-500/50 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-amber-700"
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-amber-100/90 mb-4 leading-relaxed">
                  "{testimonial.text[locale]}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-amber-100">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-amber-400/70">
                      {new Date(testimonial.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
