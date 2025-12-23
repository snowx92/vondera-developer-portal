import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signOut, onAuthStateChanged, User } from 'firebase/auth';

// Firebase configuration - the project ID is extracted from the custom token
// You should move these to environment variables in production
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'brands-61c3d.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'brands-61c3d',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'brands-61c3d.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase (prevent duplicate initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

/**
 * Exchange a Firebase Custom Token for an ID Token
 * @param customToken - The custom token received from the login API
 * @returns Promise containing the ID token
 */
export async function exchangeCustomTokenForIdToken(customToken: string): Promise<string> {
  try {
    console.log('🔥 Firebase: Signing in with custom token...');
    
    // Sign in with the custom token
    const userCredential = await signInWithCustomToken(auth, customToken);
    
    console.log('🔥 Firebase: Successfully signed in, getting ID token...');
    
    // Get the ID token
    const idToken = await userCredential.user.getIdToken();
    
    console.log('🔥 Firebase: ID token obtained successfully');
    
    return idToken;
  } catch (error) {
    console.error('🔥 Firebase: Error exchanging custom token:', error);
    throw error;
  }
}

/**
 * Get a fresh ID token (useful for token refresh)
 * @param forceRefresh - Whether to force a token refresh
 * @returns Promise containing the ID token or null if not signed in
 */
export async function getIdToken(forceRefresh: boolean = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    console.log('🔥 Firebase: No current user');
    return null;
  }
  
  try {
    const token = await user.getIdToken(forceRefresh);
    return token;
  } catch (error) {
    console.error('🔥 Firebase: Error getting ID token:', error);
    return null;
  }
}

/**
 * Sign out from Firebase
 */
export async function firebaseSignOut(): Promise<void> {
  try {
    await signOut(auth);
    console.log('🔥 Firebase: Signed out successfully');
  } catch (error) {
    console.error('🔥 Firebase: Error signing out:', error);
    throw error;
  }
}

/**
 * Get the current Firebase user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export { auth, app };
