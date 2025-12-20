const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  phoneCountryCode: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  token?: string;
}

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return {
        success: true,
        data: result,
        message: 'Registration successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during registration',
      };
    }
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store token if present
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
      }

      return {
        success: true,
        data: result,
        token: result.token,
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during login',
      };
    }
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
