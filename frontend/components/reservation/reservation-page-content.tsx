"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { restaurantInfo } from "@/lib/data/restaurant";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  tablePreference: string;
  notes: string;
}

export function ReservationPageContent() {
  const { locale, t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    tablePreference: "any",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Generate available times based on opening hours
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 16; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = t.common.required;
    if (!formData.email.trim()) newErrors.email = t.common.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.phone.trim()) newErrors.phone = t.common.required;
    if (!formData.date) newErrors.date = t.common.required;
    if (!formData.time) newErrors.time = t.common.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Send reservation to API
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setIsSuccess(true);
    } catch (error) {
      console.error("Reservation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-24 lg:pt-32 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {t.reservation.success.title}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t.reservation.success.message}
              </p>
              <div className="bg-amber-50 rounded-lg p-4 text-left space-y-2">
                <h3 className="font-semibold text-amber-900 mb-3">
                  {t.reservation.success.details}
                </h3>
                <p className="flex items-center gap-2 text-amber-800">
                  <Calendar className="h-4 w-4" />
                  {new Date(formData.date).toLocaleDateString(locale, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="flex items-center gap-2 text-amber-800">
                  <Clock className="h-4 w-4" />
                  {formData.time}
                </p>
                <p className="flex items-center gap-2 text-amber-800">
                  <Users className="h-4 w-4" />
                  {formData.guests}{" "}
                  {Number(formData.guests) === 1
                    ? t.common.person
                    : t.common.people}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.reservation.title}
          </h1>
          <p className="text-xl text-amber-100/80">{t.reservation.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-900">
                {t.reservation.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t.reservation.form.name} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={cn(errors.name && "border-red-500")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">{t.reservation.form.email} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={cn(errors.email && "border-red-500")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">{t.reservation.form.phone} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={cn(errors.phone && "border-red-500")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">{t.reservation.form.date} *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className={cn(errors.date && "border-red-500")}
                    />
                    {errors.date && (
                      <p className="text-xs text-red-500 mt-1">{errors.date}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="time">{t.reservation.form.time} *</Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) =>
                        handleInputChange("time", value)
                      }
                    >
                      <SelectTrigger
                        className={cn(errors.time && "border-red-500")}
                      >
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time && (
                      <p className="text-xs text-red-500 mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>

                {/* Guests & Table Preference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guests">
                      {t.reservation.form.guests} *
                    </Label>
                    <Select
                      value={formData.guests}
                      onValueChange={(value) =>
                        handleInputChange("guests", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}{" "}
                            {num === 1 ? t.common.person : t.common.people}
                          </SelectItem>
                        ))}
                        <SelectItem value="10+">10+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tablePreference">
                      {t.reservation.form.tablePreference}
                    </Label>
                    <Select
                      value={formData.tablePreference}
                      onValueChange={(value) =>
                        handleInputChange("tablePreference", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">
                          {t.reservation.tableOptions.any}
                        </SelectItem>
                        <SelectItem value="window">
                          {t.reservation.tableOptions.window}
                        </SelectItem>
                        <SelectItem value="private">
                          {t.reservation.tableOptions.private}
                        </SelectItem>
                        <SelectItem value="terrace">
                          {t.reservation.tableOptions.terrace}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">{t.reservation.form.notes}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    placeholder={
                      locale === "nl"
                        ? "Bijv. allergieën, speciale gelegenheden..."
                        : locale === "de"
                        ? "Z.B. Allergien, besondere Anlässe..."
                        : "E.g. allergies, special occasions..."
                    }
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6"
                >
                  {isSubmitting ? t.common.loading : t.reservation.form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info sidebar */}
          <div className="space-y-6">
            {/* Restaurant image */}
            <div
              className="h-64 rounded-2xl bg-cover bg-center shadow-xl"
              style={{
                backgroundImage:
                  "url(/table_reservation.jpeg)",
              }}
            />

            {/* Info cards */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-amber-900 mb-4">
                  {t.footer.openingHours}
                </h3>
                <ul className="space-y-2 text-sm">
                  {[
                    {
                      day: t.hours.monday,
                      hours: restaurantInfo.openingHours.monday,
                    },
                    {
                      day: t.hours.tuesday,
                      hours: restaurantInfo.openingHours.tuesday,
                    },
                    {
                      day: t.hours.wednesday,
                      hours: restaurantInfo.openingHours.wednesday,
                    },
                    {
                      day: t.hours.thursday,
                      hours: restaurantInfo.openingHours.thursday,
                    },
                    {
                      day: t.hours.friday,
                      hours: restaurantInfo.openingHours.friday,
                    },
                    {
                      day: t.hours.saturday,
                      hours: restaurantInfo.openingHours.saturday,
                    },
                    {
                      day: t.hours.sunday,
                      hours: restaurantInfo.openingHours.sunday,
                    },
                  ].map((item) => (
                    <li key={item.day} className="flex justify-between">
                      <span className="text-muted-foreground">{item.day}</span>
                      <span
                        className={
                          item.hours ? "text-amber-700" : "text-red-500"
                        }
                      >
                        {item.hours
                          ? `${item.hours[0]} - ${item.hours[1]}`
                          : t.hours.closed}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <p className="text-amber-800 text-sm">
                  {locale === "nl"
                    ? "Voor groepsreserveringen (meer dan 10 personen), neem telefonisch contact met ons op."
                    : locale === "de"
                    ? "Für Gruppenreservierungen (mehr als 10 Personen) kontaktieren Sie uns bitte telefonisch."
                    : "For group reservations (more than 10 people), please contact us by phone."}
                </p>
                <a
                  href={`tel:${restaurantInfo.contact.phone}`}
                  className="mt-2 inline-block text-amber-600 hover:text-amber-700 font-semibold"
                >
                  {restaurantInfo.contact.phoneFormatted}
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
