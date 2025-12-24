"use client"

import type { ReactNode } from "react"
import { RealtimeToast } from "@/components/admin/realtime-toast"

export function RealtimeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <RealtimeToast enabled={true} />
    </>
  )
}
