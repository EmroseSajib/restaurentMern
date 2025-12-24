"use client"

import { useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications"

interface RealtimeToastProps {
  enabled?: boolean
}

export function RealtimeToast({ enabled = true }: RealtimeToastProps) {
  const { toast } = useToast()
  const { notifications } = useRealtimeNotifications(enabled)
  const lastNotificationId = useRef<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
    audioRef.current.volume = 0.5
  }, [])

  useEffect(() => {
    if (notifications.length === 0) return

    const latest = notifications[0]
    if (latest.id !== lastNotificationId.current) {
      lastNotificationId.current = latest.id

      audioRef.current?.play().catch(() => {
        // Audio playback may fail due to autoplay policies
      })

      toast({
        title: latest.title,
        description: latest.message,
      })
    }
  }, [notifications, toast])

  return null
}
