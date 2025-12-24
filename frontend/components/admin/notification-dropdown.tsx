"use client"

import { useTranslations } from "next-intl"
import { Bell, ShoppingBag, CalendarDays, ChefHat } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRealtimeNotifications, type Notification } from "@/hooks/use-realtime-notifications"
import { cn } from "@/lib/utils"

const notificationIcons: Record<Notification["type"], typeof ShoppingBag> = {
  "order:new": ShoppingBag,
  "reservation:new": CalendarDays,
  "catering:new": ChefHat,
}

export function NotificationDropdown() {
  const t = useTranslations("admin")
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useRealtimeNotifications(true)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="font-semibold">{t("notifications")}</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              {t("markAsRead")}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            notifications.slice(0, 10).map((notification) => {
              const Icon = notificationIcons[notification.type]
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn("flex gap-3 py-3 cursor-pointer", !notification.read && "bg-muted/50")}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.timestamp.toLocaleTimeString()}</p>
                  </div>
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                </DropdownMenuItem>
              )
            })
          )}
        </div>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAll} className="justify-center text-sm">
              {t("clearAll")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
