"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { CalendarDays, Users, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { createReservation, getAvailableTimeSlots } from "@/lib/api"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function ReservationsPageContent() {
  const t = useTranslations("reservations")
  const tContact = useTranslations("contact")
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState("")
  const [guests, setGuests] = useState("2")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (date) {
      const fetchSlots = async () => {
        setIsLoadingSlots(true)
        try {
          const response = await getAvailableTimeSlots(format(date, "yyyy-MM-dd"))
          setAvailableSlots(response.data.slots)
          setTime("")
        } catch {
          setAvailableSlots([])
        } finally {
          setIsLoadingSlots(false)
        }
      }
      fetchSlots()
    }
  }, [date])

  const handleSubmit = async () => {
    if (!date || !time || !name || !email || !phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createReservation({
        date: format(date, "yyyy-MM-dd"),
        time,
        guests: Number(guests),
        customer: { name, email, phone },
        specialRequests: specialRequests || undefined,
      })
      setIsSuccess(true)
      toast({
        title: t("success"),
      })
    } catch {
      toast({
        title: "Reservation failed",
        description: "Please try again or contact us directly",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="font-sans text-3xl font-bold text-foreground">{t("success")}</h1>
          <p className="mt-2 text-muted-foreground">
            {format(date!, "EEEE, MMMM d")} at {time} for {guests} {t("guestsSuffix")}
          </p>
        </div>
        <div className="pt-4 text-sm text-muted-foreground">
          <p>
            Questions? Contact us at{" "}
            <a href={`tel:${tContact("phone")}`} className="text-primary hover:underline">
              {tContact("phone")}
            </a>
          </p>
        </div>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Make Another Reservation
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <CalendarDays className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-sans text-4xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>

      {/* Reservation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Details</CardTitle>
          <CardDescription>Select your preferred date, time, and party size</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-transparent",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t("time")}</Label>
              <Select value={time} onValueChange={setTime} disabled={!date || isLoadingSlots}>
                <SelectTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={isLoadingSlots ? "Loading..." : "Select time"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label>{t("guests")}</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger>
                <Users className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num} {num === 1 ? "guest" : t("guestsSuffix")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">{t("specialRequests")}</Label>
            <Textarea
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder={t("requestsPlaceholder")}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || !date || !time || !name || !email || !phone}
          >
            {isSubmitting ? "Booking..." : t("confirmReservation")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
