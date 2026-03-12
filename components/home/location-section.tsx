"use client"

import { MapPin, Navigation, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { restaurantInfo } from "@/lib/data/restaurant"

export function LocationSection() {
  const { t } = useI18n()

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">{t.location.title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Map embed */}
          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border border-amber-200">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2457.5!2d${restaurantInfo.coordinates.lng}!3d${restaurantInfo.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDU3JzU1LjQiTiA2wrAxNyczMC4yIkU!5e0!3m2!1sen!2snl!4v1234567890`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant location"
            />
          </div>

          {/* Contact info */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg border border-amber-200">
            <h3 className="text-2xl font-bold text-amber-900 mb-6">{t.footer.contactUs}</h3>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-900 mb-1">{t.location.address}</p>
                  <p className="text-amber-700">{restaurantInfo.address.street}</p>
                  <p className="text-amber-700">
                    {restaurantInfo.address.postalCode} {restaurantInfo.address.city}
                  </p>
                  <p className="text-amber-700">{restaurantInfo.address.country}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-900 mb-1">{t.location.phone}</p>
                  <a
                    href={`tel:${restaurantInfo.contact.phone}`}
                    className="text-amber-700 hover:text-amber-600 transition-colors"
                  >
                    {restaurantInfo.contact.phoneFormatted}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-900 mb-1">{t.location.email}</p>
                  <a
                    href={`mailto:${restaurantInfo.contact.email}`}
                    className="text-amber-700 hover:text-amber-600 transition-colors"
                  >
                    {restaurantInfo.contact.email}
                  </a>
                </div>
              </div>

              {/* Directions button */}
              <a href={restaurantInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6">
                  <Navigation className="h-5 w-5 mr-2" />
                  {t.location.directions}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
