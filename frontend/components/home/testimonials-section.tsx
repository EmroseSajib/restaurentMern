"use client"

import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"

interface Testimonial {
  id: string
  name: string
  text: {
    en: string
    nl: string
    de: string
  }
  rating: number
  date: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Maria van der Berg",
    text: {
      en: "The best Indian food in the region! The Butter Chicken is absolutely divine, and the service is always warm and welcoming.",
      nl: "Het beste Indiase eten in de regio! De Butter Chicken is absoluut goddelijk, en de service is altijd warm en gastvrij.",
      de: "Das beste indische Essen in der Region! Das Butter Chicken ist absolut göttlich, und der Service ist immer herzlich und einladend.",
    },
    rating: 5,
    date: "2024-11-15",
  },
  {
    id: "2",
    name: "Thomas Müller",
    text: {
      en: "Authentic flavors that remind me of my travels in India. The tandoori dishes are exceptional. Highly recommend!",
      nl: "Authentieke smaken die me doen denken aan mijn reizen in India. De tandoori gerechten zijn uitzonderlijk. Zeer aanbevolen!",
      de: "Authentische Aromen, die mich an meine Reisen in Indien erinnern. Die Tandoori-Gerichte sind außergewöhnlich. Sehr empfehlenswert!",
    },
    rating: 5,
    date: "2024-10-28",
  },
  {
    id: "3",
    name: "Lisa de Jong",
    text: {
      en: "Great vegetarian options! The Palak Paneer and Dal Makhani are my absolute favorites. Fresh ingredients and perfect spice balance.",
      nl: "Geweldige vegetarische opties! De Palak Paneer en Dal Makhani zijn mijn absolute favorieten. Verse ingrediënten en perfecte kruidenbalans.",
      de: "Tolle vegetarische Optionen! Palak Paneer und Dal Makhani sind meine absoluten Favoriten. Frische Zutaten und perfekte Gewürzbalance.",
    },
    rating: 5,
    date: "2024-12-01",
  },
]

export function TestimonialsSection() {
  const { locale, t } = useI18n()

  return (
    <section className="py-20 bg-gradient-to-b from-amber-900 to-amber-950 text-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-3">{t.testimonials.title}</h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-amber-800/30 border-amber-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-amber-500/50 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-amber-700"
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-amber-100/90 mb-4 leading-relaxed">"{testimonial.text[locale]}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-amber-100">{testimonial.name}</p>
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
  )
}
