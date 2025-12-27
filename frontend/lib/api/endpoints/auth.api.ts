import { apiClient, type ApiResponse } from "../client";

export interface AdminUser {
  id: string;
  username: string;
  role: "admin";
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponseData {
  admin: AdminUser;
  accessToken: string;
}

const TOKEN_KEY = "adminAccessToken";

export function getStoredAccessToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}

export function storeAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function loginAdmin(
  credentials: LoginCredentials
): Promise<ApiResponse<LoginResponseData>> {
  return apiClient.post<ApiResponse<LoginResponseData>>("/admin/auth/login", credentials);
}

export async function refreshAdmin(): Promise<ApiResponse<LoginResponseData>> {
  // refresh token is sent via httpOnly cookie (credentials: include in client)
  return apiClient.post<ApiResponse<LoginResponseData>>("/admin/auth/refresh");
}

export async function logoutAdmin(): Promise<ApiResponse<{ ok: true }>> {
  return apiClient.post<ApiResponse<{ ok: true }>>("/admin/auth/logout");
}

export async function getCurrentAdmin(
  accessToken?: string | null
): Promise<ApiResponse<{ admin: AdminUser }>> {
  const token = accessToken ?? getStoredAccessToken();
  return apiClient.get<ApiResponse<{ admin: AdminUser }>>("/admin/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
