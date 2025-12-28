// "use client"

// import { useState, useEffect } from "react"
// import { useTranslations } from "next-intl"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { SkeletonLoader } from "@/components/ui/skeleton-loader"
// import { settingsApi, type RestaurantSettings } from "@/lib/api/endpoints/settings.api"
// import { Loader2, Save } from "lucide-react"

// export default function AdminSettingsPage() {
//   const t = useTranslations("admin")
//   const [settings, setSettings] = useState<RestaurantSettings | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const data = await settingsApi.getSettings()
//         setSettings(data)
//       } catch (error) {
//         console.error("Failed to fetch settings:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchSettings()
//   }, [])

//   const handleSave = async () => {
//     if (!settings) return
//     setIsSaving(true)
//     try {
//       await settingsApi.updateSettings(settings)
//     } catch (error) {
//       console.error("Failed to save settings:", error)
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   if (isLoading || !settings) {
//     return (
//       <div className="flex flex-col gap-6">
//         <h1 className="text-2xl font-bold">{t("settings")}</h1>
//         <SkeletonLoader className="h-96" />
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">{t("settings")}</h1>
//         <Button onClick={handleSave} disabled={isSaving}>
//           {isSaving ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               {t("saving")}
//             </>
//           ) : (
//             <>
//               <Save className="mr-2 h-4 w-4" />
//               {t("saveChanges")}
//             </>
//           )}
//         </Button>
//       </div>

//       <Tabs defaultValue="general" className="w-full">
//         <TabsList className="grid w-full max-w-md grid-cols-3">
//           <TabsTrigger value="general">{t("general")}</TabsTrigger>
//           <TabsTrigger value="delivery">{t("delivery")}</TabsTrigger>
//           <TabsTrigger value="hours">{t("hours")}</TabsTrigger>
//         </TabsList>

//         <TabsContent value="general" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>{t("generalSettings")}</CardTitle>
//               <CardDescription>{t("generalSettingsDescription")}</CardDescription>
//             </CardHeader>
//             <CardContent className="flex flex-col gap-4">
//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="restaurantName">{t("restaurantName")}</Label>
//                 <Input
//                   id="restaurantName"
//                   value={settings.restaurantName}
//                   onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="email">{t("contactEmail")}</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={settings.contactEmail}
//                   onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="phone">{t("contactPhone")}</Label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   value={settings.contactPhone}
//                   onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
//                 />
//               </div>

//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div>
//                   <Label>{t("acceptingOrders")}</Label>
//                   <p className="text-sm text-muted-foreground">{t("acceptingOrdersDescription")}</p>
//                 </div>
//                 <Switch
//                   checked={settings.acceptingOrders}
//                   onCheckedChange={(checked) => setSettings({ ...settings, acceptingOrders: checked })}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="delivery" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>{t("deliverySettings")}</CardTitle>
//               <CardDescription>{t("deliverySettingsDescription")}</CardDescription>
//             </CardHeader>
//             <CardContent className="flex flex-col gap-4">
//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="minOrder">{t("minimumOrderAmount")}</Label>
//                 <Input
//                   id="minOrder"
//                   type="number"
//                   min={0}
//                   step={0.01}
//                   value={settings.minimumOrderAmount}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       minimumOrderAmount: Number.parseFloat(e.target.value) || 0,
//                     })
//                   }
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="deliveryFee">{t("deliveryFee")}</Label>
//                 <Input
//                   id="deliveryFee"
//                   type="number"
//                   min={0}
//                   step={0.01}
//                   value={settings.deliveryFee}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       deliveryFee: Number.parseFloat(e.target.value) || 0,
//                     })
//                   }
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="freeDeliveryThreshold">{t("freeDeliveryThreshold")}</Label>
//                 <Input
//                   id="freeDeliveryThreshold"
//                   type="number"
//                   min={0}
//                   step={0.01}
//                   value={settings.freeDeliveryThreshold}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       freeDeliveryThreshold: Number.parseFloat(e.target.value) || 0,
//                     })
//                   }
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="estimatedDeliveryTime">{t("estimatedDeliveryTime")}</Label>
//                 <Input
//                   id="estimatedDeliveryTime"
//                   value={settings.estimatedDeliveryTime}
//                   onChange={(e) => setSettings({ ...settings, estimatedDeliveryTime: e.target.value })}
//                   placeholder="30-45 min"
//                 />
//               </div>

//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div>
//                   <Label>{t("deliveryEnabled")}</Label>
//                   <p className="text-sm text-muted-foreground">{t("deliveryEnabledDescription")}</p>
//                 </div>
//                 <Switch
//                   checked={settings.deliveryEnabled}
//                   onCheckedChange={(checked) => setSettings({ ...settings, deliveryEnabled: checked })}
//                 />
//               </div>

//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div>
//                   <Label>{t("pickupEnabled")}</Label>
//                   <p className="text-sm text-muted-foreground">{t("pickupEnabledDescription")}</p>
//                 </div>
//                 <Switch
//                   checked={settings.pickupEnabled}
//                   onCheckedChange={(checked) => setSettings({ ...settings, pickupEnabled: checked })}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="hours" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>{t("openingHours")}</CardTitle>
//               <CardDescription>{t("openingHoursDescription")}</CardDescription>
//             </CardHeader>
//             <CardContent className="flex flex-col gap-4">
//               {settings.openingHours.map((day, index) => (
//                 <div
//                   key={day.day}
//                   className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
//                 >
//                   <div className="flex items-center gap-4">
//                     <Switch
//                       checked={!day.closed}
//                       onCheckedChange={(checked) => {
//                         const newHours = [...settings.openingHours]
//                         newHours[index] = { ...day, closed: !checked }
//                         setSettings({ ...settings, openingHours: newHours })
//                       }}
//                     />
//                     <span className="w-24 font-medium capitalize">{t(`days.${day.day}`)}</span>
//                   </div>

//                   {!day.closed && (
//                     <div className="flex items-center gap-2">
//                       <Input
//                         type="time"
//                         value={day.open}
//                         onChange={(e) => {
//                           const newHours = [...settings.openingHours]
//                           newHours[index] = { ...day, open: e.target.value }
//                           setSettings({ ...settings, openingHours: newHours })
//                         }}
//                         className="w-32"
//                       />
//                       <span className="text-muted-foreground">-</span>
//                       <Input
//                         type="time"
//                         value={day.close}
//                         onChange={(e) => {
//                           const newHours = [...settings.openingHours]
//                           newHours[index] = { ...day, close: e.target.value }
//                           setSettings({ ...settings, openingHours: newHours })
//                         }}
//                         className="w-32"
//                       />
//                     </div>
//                   )}

//                   {day.closed && <span className="text-muted-foreground">{t("closed")}</span>}
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

export default function AdminSettingsPage() {
  return <div>Admin Settings Page</div>;
}
