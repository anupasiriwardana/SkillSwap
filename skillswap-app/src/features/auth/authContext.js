import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const ME_QUERY_KEY = ['auth', 'me'];

/**
 * { user, isAuthenticated, isLoading, signIn(authResponse), signOut(), refreshUser() }
 * `user` = { id, email, firstName, lastName, role, profileCompleted, pendingIncomingRequests }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}

/** Where a signed-in user belongs by default. */
export function homePathFor(user) {
  if (!user) return '/login';
  if (user.role === 'ADMIN') return '/admin';
  if (!user.profileCompleted) return '/onboarding';
  return '/discover';
}
