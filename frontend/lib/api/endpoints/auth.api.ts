import { apiClient, type ApiResponse } from "../client"

export interface AdminUser {
  _id: string
  username: string
  role: "admin" | "staff"
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: AdminUser
  token: string
}

export async function loginAdmin(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
  return apiClient.post<ApiResponse<AuthResponse>>("/auth/admin/login", credentials)
}

export async function logoutAdmin(): Promise<ApiResponse<null>> {
  return apiClient.post<ApiResponse<null>>("/auth/admin/logout")
}

export async function getCurrentAdmin(): Promise<ApiResponse<AdminUser>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
  return apiClient.get<ApiResponse<AdminUser>>("/auth/admin/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export async function verifyAdminToken(token: string): Promise<ApiResponse<AdminUser>> {
  return apiClient.post<ApiResponse<AdminUser>>("/auth/admin/verify", { token })
}
