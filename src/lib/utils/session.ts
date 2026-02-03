import { getIdToken } from '../config/firebase';

export class SessionManager {
  private static instance: SessionManager;
  private readonly TOKEN_KEY = 'auth_token';

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  async getCurrentToken(): Promise<string | null> {
    try {
      // Try to get a fresh token from Firebase (will auto-refresh if needed)
      const freshToken = await getIdToken(false);
      if (freshToken) {
        // Update stored token
        this.setToken(freshToken);
        return freshToken;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }

    // Fall back to stored token if refresh fails
    return this.getToken();
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      // Clear any other session data as needed
    }
  }
}