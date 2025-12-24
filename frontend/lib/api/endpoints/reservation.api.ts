import { apiClient, type ApiResponse } from "../client"

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface Reservation {
  _id: string
  date: string
  time: string
  guests: number
  customer: {
    name: string
    email: string
    phone: string
  }
  specialRequests?: string
  status: ReservationStatus
  createdAt: string
  updatedAt: string
}

export interface CreateReservationData {
  date: string
  time: string
  guests: number
  customer: {
    name: string
    email: string
    phone: string
  }
  specialRequests?: string
}

export async function createReservation(data: CreateReservationData): Promise<ApiResponse<Reservation>> {
  return apiClient.post<ApiResponse<Reservation>>("/reservations", data)
}

export async function getReservations(params?: {
  date?: string
  status?: ReservationStatus
  page?: number
  limit?: number
}): Promise<ApiResponse<{ reservations: Reservation[]; total: number }>> {
  const searchParams = new URLSearchParams()
  if (params?.date) searchParams.append("date", params.date)
  if (params?.status) searchParams.append("status", params.status)
  if (params?.page) searchParams.append("page", String(params.page))
  if (params?.limit) searchParams.append("limit", String(params.limit))
  return apiClient.get<ApiResponse<{ reservations: Reservation[]; total: number }>>(
    `/reservations?${searchParams.toString()}`,
  )
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<ApiResponse<Reservation>> {
  return apiClient.patch<ApiResponse<Reservation>>(`/reservations/${id}/status`, { status })
}

export async function getAvailableTimeSlots(date: string): Promise<ApiResponse<{ slots: string[] }>> {
  return apiClient.get<ApiResponse<{ slots: string[] }>>(`/reservations/available-slots?date=${date}`)
}
