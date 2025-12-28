const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    // normalize: no trailing slash
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!response.ok) {
      const error: ApiError = isJson
        ? await response.json().catch(() => ({
            message: "An unexpected error occurred",
            statusCode: response.status,
          }))
        : {
            message: await response
              .text()
              .catch(() => "An unexpected error occurred"),
            statusCode: response.status,
          };

      throw error;
    }

    return isJson ? response.json() : ((await response.text()) as unknown as T);
  }

  private mergeHeaders(options?: RequestInit) {
    const fromOptions =
      options?.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : options?.headers ?? {};

    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...fromOptions,
    } as Record<string, string>;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      credentials: "include",
      ...options,
      headers: this.mergeHeaders(options), // ✅ last
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      credentials: "include",
      ...options,
      headers: this.mergeHeaders(options), // ✅ last
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      credentials: "include",
      ...options,
      headers: this.mergeHeaders(options), // ✅ last
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      credentials: "include",
      ...options,
      headers: this.mergeHeaders(options), // ✅ last
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      credentials: "include",
      ...options,
      headers: this.mergeHeaders(options), // ✅ last
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
