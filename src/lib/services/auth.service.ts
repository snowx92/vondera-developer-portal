import { exchangeCustomTokenForIdToken, firebaseSignOut, getIdToken } from '../config/firebase';

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
      console.log('🔐 Login attempt with:', { email: data.email });
      console.log('🔐 API URL:', `${API_BASE_URL}/auth/login`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('🔐 Response status:', response.status, response.statusText);

      const result = await response.json();
      console.log('🔐 Response body:', JSON.stringify(result, null, 2));

      if (!response.ok) {
        console.error('🔐 Login failed:', result.message);
        throw new Error(result.message || 'Login failed');
      }

      // Get the custom token from the response
      const customToken = result.data?.token || result.token || result.data?.data?.token;

      console.log('🔐 Extracted custom token:', customToken ? `TOKEN_EXISTS (${customToken.substring(0, 20)}...)` : 'NO_TOKEN');

      if (!customToken) {
        console.error('⚠️ No custom token found in response!');
        console.error('⚠️ Response structure:', result);
        throw new Error('No authentication token received from server');
      }

      // Exchange the custom token for a Firebase ID token
      console.log('🔐 Exchanging custom token for Firebase ID token...');
      const idToken = await exchangeCustomTokenForIdToken(customToken);
      
      console.log('🔐 ID token obtained:', idToken ? `TOKEN_EXISTS (${idToken.substring(0, 20)}...)` : 'NO_TOKEN');

      // Store the ID token (not the custom token)
      localStorage.setItem('auth_token', idToken);
      console.log('✅ ID Token stored successfully in localStorage');

      // Verify it was stored
      const storedToken = localStorage.getItem('auth_token');
      console.log('✅ Verification - token from storage:', storedToken ? `EXISTS (${storedToken.substring(0, 20)}...)` : 'MISSING');

      return {
        success: true,
        data: result.data || result,
        token: idToken,
        message: result.message || 'Login successful',
      };
    } catch (error) {
      console.error('🔐 Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during login',
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      // Sign out from Firebase
      await firebaseSignOut();
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    }
    localStorage.removeItem('auth_token');
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Get a fresh token (refreshes if needed)
   * Use this when making API calls to ensure the token is valid
   */
  static async getFreshToken(): Promise<string | null> {
    try {
      // Try to get a fresh token from Firebase
      const freshToken = await getIdToken(false);
      if (freshToken) {
        // Update stored token
        localStorage.setItem('auth_token', freshToken);
        return freshToken;
      }
    } catch (error) {
      console.error('Error getting fresh token:', error);
    }
    
    // Fall back to stored token
    return this.getToken();
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
