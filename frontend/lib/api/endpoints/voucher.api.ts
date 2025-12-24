import { apiClient, type ApiResponse } from "../client"

export interface Voucher {
  _id: string
  code: string
  amount: number
  balance: number
  isActive: boolean
  expiresAt: string
  createdAt: string
}

export interface CreateVoucherData {
  amount: number
  recipientEmail: string
  personalMessage?: string
}

export interface ValidateVoucherResponse {
  valid: boolean
  voucher?: Voucher
  message?: string
}

export async function createVoucher(data: CreateVoucherData): Promise<ApiResponse<Voucher>> {
  return apiClient.post<ApiResponse<Voucher>>("/vouchers", data)
}

export async function validateVoucher(code: string): Promise<ApiResponse<ValidateVoucherResponse>> {
  return apiClient.get<ApiResponse<ValidateVoucherResponse>>(`/vouchers/validate/${encodeURIComponent(code)}`)
}

export async function redeemVoucher(code: string, amount: number): Promise<ApiResponse<{ remaining: number }>> {
  return apiClient.post<ApiResponse<{ remaining: number }>>("/vouchers/redeem", { code, amount })
}
