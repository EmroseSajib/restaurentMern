import { apiClient, type ApiResponse } from "../client"

export type CateringStatus = "pending" | "contacted" | "confirmed" | "completed" | "cancelled"
export type EventType = "corporate" | "wedding" | "birthday" | "other"

export interface CateringRequest {
  _id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  eventType: EventType
  eventDate: string
  expectedGuests: number
  additionalInfo?: string
  status: CateringStatus
  createdAt: string
  updatedAt: string
}

export interface CreateCateringRequestData {
  customer: {
    name: string
    email: string
    phone: string
  }
  eventType: EventType
  eventDate: string
  expectedGuests: number
  additionalInfo?: string
}

export async function createCateringRequest(data: CreateCateringRequestData): Promise<ApiResponse<CateringRequest>> {
  return apiClient.post<ApiResponse<CateringRequest>>("/catering", data)
}

export async function getCateringRequests(params?: {
  status?: CateringStatus
  page?: number
  limit?: number
}): Promise<ApiResponse<{ requests: CateringRequest[]; total: number }>> {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.append("status", params.status)
  if (params?.page) searchParams.append("page", String(params.page))
  if (params?.limit) searchParams.append("limit", String(params.limit))
  return apiClient.get<ApiResponse<{ requests: CateringRequest[]; total: number }>>(
    `/catering?${searchParams.toString()}`,
  )
}

export async function updateCateringStatus(id: string, status: CateringStatus): Promise<ApiResponse<CateringRequest>> {
  return apiClient.patch<ApiResponse<CateringRequest>>(`/catering/${id}/status`, { status })
}
