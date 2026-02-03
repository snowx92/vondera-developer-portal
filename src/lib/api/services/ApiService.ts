import { SessionManager } from "@/lib/utils/session";

export const printLogs = true; // Enable logging for debugging

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export class ApiService {
  private baseURL: string;
  protected sessionManager: SessionManager;

  constructor() {
    // Check if the environment variable is defined
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseURL) {
      throw new Error('API_BASE_URL is not defined in environment variables');
    }
    this.baseURL = baseURL;
    this.sessionManager = SessionManager.getInstance();
  }

  async request<T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body: Record<string, unknown> | null = null,
    queryParams: Record<string, string> = {},
    customHeaders: Record<string, string> = {}
  ): Promise<T | null> {
    const query = new URLSearchParams(queryParams).toString();
    const fullUrl = query ? `${url}?${query}` : url;

    // Get a fresh token (will refresh if needed) from session manager
    const token = await this.sessionManager.getCurrentToken();
    if (!token) {
      // Don't redirect here - let the layout handle authentication
      console.log('⚠️ ApiService: No token found, throwing error');
      throw new Error("Please log in to continue");
    }

    const staticHeaders = {
      Authorization: `Bearer ${token}`,
      Language: "en",
    };

    return this.makeRequest(fullUrl, method, body, staticHeaders, customHeaders);
  }

  private async makeRequest<T>(
    fullUrl: string,
    method: string,
    body: Record<string, unknown> | null,
    staticHeaders: Record<string, string>,
    customHeaders: Record<string, string>
  ): Promise<T | null> {
    if (printLogs) {
      console.log(`🌐 API Request: ${method} ${this.baseURL}${fullUrl}`);
      if (body) {
        console.log("📦 Request Body:", body);
      }
      console.log("📋 Request Headers:", { ...staticHeaders, ...customHeaders });
      // Log the full token being sent
      const authHeader = staticHeaders.Authorization || customHeaders.Authorization;
      if (authHeader) {
        console.log("🔑 Full Authorization Header:", authHeader);
        console.log("🔑 Token length:", authHeader.replace('Bearer ', '').length);
      }
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Client: "FETCH",
        ...customHeaders,
        ...staticHeaders,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${fullUrl}`, options);

      if (printLogs) {
        console.log(`📡 API Response: ${response.status} ${response.statusText}`);
      }

      if (response.status === 401) {
        // Log the error response before clearing session
        try {
          const errorBody = await response.clone().json();
          console.error('❌ 401 Error Response Body:', errorBody);
        } catch (e) {
          console.error('❌ 401 Error (no JSON body)');
        }

        // Clear the session but don't redirect - let the layout handle it
        console.log('❌ 401 Unauthorized - clearing session');
        this.sessionManager.clearSession();
        throw new Error("Authentication failed - please log in again");
      }

      // Handle 403 Forbidden errors with more detailed information
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({ message: "Access forbidden" }));
        const errorMessage = errorData.message || "You don't have permission to access this resource";
        
        // Create a custom error object with status code
        const error = new Error(errorMessage) as Error & { status?: number };
        error.status = 403;
        
        console.error(`Permission denied for ${method} ${fullUrl}: ${errorMessage}`);
        throw error;
      }

      if (response.status < 200 || response.status >= 300) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (printLogs) {
          console.warn(`API Error for ${fullUrl}: ${errorMessage}`);
        }
        
        // Create a custom error with status information
        const error = new Error(errorMessage) as Error & { status?: number; url?: string };
        error.status = response.status;
        error.url = fullUrl;
        
        throw error;
      }

      try {
        const jsonResponse = await response.json() as ApiResponse<T>;
        if (printLogs) {
          console.log(`API parsed response for ${fullUrl}:`, jsonResponse);
          console.log(`Returning data:`, jsonResponse.data);
        }
        return jsonResponse.data;
      } catch (parseError) {
        if (printLogs) {
          console.warn(`Failed to parse JSON response for ${fullUrl}:`, parseError);
        }
        throw new Error(`Invalid JSON response from ${fullUrl}. This usually means the API endpoint doesn't exist or returned HTML.`);
      }
          } catch (error) {
      if (printLogs) {
        console.error("API request failed:", error, "URL : ", fullUrl);
      }
      throw error;
    }
  }

  // GET request with query params and custom headers
  async get<T>(
    endpoint: string,
    queryParams: Record<string, unknown> = {},
    customHeaders: Record<string, string> = {}
  ): Promise<T | null> {
    const filteredQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(([, value]) => value !== undefined)
    ) as Record<string, string>;

    try {
      return await this.request<T>(
        endpoint,
        "GET",
        null,
        filteredQueryParams,
        customHeaders
      );
    } catch (error) {
      // Re-throw the error to be handled by the calling method
      throw error;
    }
  }

  // POST request with optional body and custom headers
  async post<T>(
    endpoint: string,
    body: Record<string, unknown> = {},
    customHeaders: Record<string, string> = {}
  ): Promise<T | null> {
    const filterBody = Object.fromEntries(
      Object.entries(body).filter(([, value]) => value !== undefined)
    );
    return this.request<T>(endpoint, "POST", filterBody, {}, customHeaders);
  }

  // PUT request with optional body and custom headers
  async put<T>(
    endpoint: string,
    body: Record<string, unknown> | null = null,
    customHeaders: Record<string, string> = {}
  ): Promise<T | null> {
    return this.request<T>(endpoint, "PUT", body, {}, customHeaders);
  }

  // DELETE request with optional body and custom headers
  async delete<T>(
    endpoint: string,
    body: Record<string, unknown> | null = null,
    customHeaders: Record<string, string> = {}
  ): Promise<T | null> {
    return this.request<T>(endpoint, "DELETE", body, {}, customHeaders);
  }
} 