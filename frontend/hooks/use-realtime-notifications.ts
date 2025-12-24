"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Pusher from "pusher-js"

export interface Notification {
  id: string
  type: "order:new" | "reservation:new" | "catering:new"
  title: string
  message: string
  data?: Record<string, unknown>
  timestamp: Date
  read: boolean
}

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || ""
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu"

export function useRealtimeNotifications(enabled = false) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      })
    }
  }, [])

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])
      playSound()
    },
    [playSound],
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  useEffect(() => {
    if (!enabled || !PUSHER_KEY) return

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    })

    const channel = pusher.subscribe("private-admin")

    channel.bind("order:new", (data: { orderNumber: string; total: number }) => {
      addNotification({
        type: "order:new",
        title: "New Order",
        message: `Order #${data.orderNumber} - €${data.total.toFixed(2)}`,
        data,
      })
    })

    channel.bind("reservation:new", (data: { name: string; date: string; guests: number }) => {
      addNotification({
        type: "reservation:new",
        title: "New Reservation",
        message: `${data.name} - ${data.date} for ${data.guests} guests`,
        data,
      })
    })

    channel.bind("catering:new", (data: { name: string; eventType: string; eventDate: string }) => {
      addNotification({
        type: "catering:new",
        title: "New Catering Request",
        message: `${data.name} - ${data.eventType} on ${data.eventDate}`,
        data,
      })
    })

    pusher.connection.bind("connected", () => setIsConnected(true))
    pusher.connection.bind("disconnected", () => setIsConnected(false))

    return () => {
      channel.unbind_all()
      pusher.unsubscribe("private-admin")
      pusher.disconnect()
    }
  }, [enabled, addNotification])

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notification.mp3")
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearAll,
  }
}
