"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChefHat, CalendarDays, Users, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { createCateringRequest, type EventType } from "@/lib/api"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const eventTypes: { value: EventType; label: string }[] = [
  { value: "corporate", label: "Corporate Event" },
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday Party" },
  { value: "other", label: "Other" },
]

export function CateringPageContent() {
  const t = useTranslations("catering")
  const tContact = useTranslations("contact")
  const { toast } = useToast()

  const [eventType, setEventType] = useState<EventType>("corporate")
  const [eventDate, setEventDate] = useState<Date | undefined>()
  const [expectedGuests, setExpectedGuests] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!eventDate || !expectedGuests || !name || !email || !phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createCateringRequest({
        eventType,
        eventDate: format(eventDate, "yyyy-MM-dd"),
        expectedGuests: Number(expectedGuests),
        customer: { name, email, phone },
        additionalInfo: additionalInfo || undefined,
      })
      setIsSuccess(true)
      toast({
        title: "Request submitted!",
        description: "Our team will contact you shortly",
      })
    } catch {
      toast({
        title: "Submission failed",
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
          <h1 className="font-sans text-3xl font-bold text-foreground">Request Submitted!</h1>
          <p className="mt-2 text-muted-foreground">
            Our catering team will review your request and contact you within 24 hours.
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
          Submit Another Request
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <ChefHat className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-sans text-4xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>

      {/* Description */}
      <p className="text-center text-muted-foreground max-w-xl mx-auto">{t("description")}</p>

      {/* Catering Form */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Tell us about your event and we&apos;ll create a custom menu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Type */}
          <div className="space-y-2">
            <Label>{t("eventType")}</Label>
            <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {t(`eventTypes.${type.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event Date & Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("eventDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-transparent",
                      !eventDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    disabled={(date) => date < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // At least 1 week ahead
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t("expectedGuests")}</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min={10}
                  value={expectedGuests}
                  onChange={(e) => setExpectedGuests(e.target.value)}
                  className="pl-10"
                  placeholder="Number of guests"
                />
              </div>
            </div>
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

          {/* Additional Info */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">{t("additionalInfo")}</Label>
            <Textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Dietary requirements, venue details, preferred menu items..."
              rows={4}
            />
          </div>

          {/* Note */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t("note")}</AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || !eventDate || !expectedGuests || !name || !email || !phone}
          >
            {isSubmitting ? "Submitting..." : t("submitRequest")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
