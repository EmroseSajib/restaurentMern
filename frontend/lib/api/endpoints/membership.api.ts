import { apiClient, type ApiResponse } from "../client"

export interface Membership {
  _id: string
  memberId: string
  name: string
  email: string
  phone: string
  points: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  discountPercentage: number
  isActive: boolean
  createdAt: string
}

export interface ValidateMembershipResponse {
  valid: boolean
  membership?: Membership
  discount?: number
  message?: string
}

export async function validateMembership(memberId: string): Promise<ApiResponse<ValidateMembershipResponse>> {
  return apiClient.get<ApiResponse<ValidateMembershipResponse>>(`/membership/validate/${encodeURIComponent(memberId)}`)
}

export async function getMembershipDetails(memberId: string): Promise<ApiResponse<Membership>> {
  return apiClient.get<ApiResponse<Membership>>(`/membership/${encodeURIComponent(memberId)}`)
}
