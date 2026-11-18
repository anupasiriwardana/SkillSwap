import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { setUnauthorizedHandler, tokenStore } from '../../lib/api';
import { authApi } from './authApi';
import { AuthContext, ME_QUERY_KEY } from './authContext';

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => tokenStore.get());

  const meQuery = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: authApi.me,
    enabled: Boolean(token),
    staleTime: 30_000,
    retry: false,
  });

  const signOut = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  /** Stores the session from a login/register response. */
  const signIn = useCallback(
    (auth) => {
      tokenStore.set(auth.token);
      queryClient.setQueryData(ME_QUERY_KEY, auth.user);
      setToken(auth.token);
    },
    [queryClient],
  );

  const refreshUser = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY }),
    [queryClient],
  );

  useEffect(() => {
    setUnauthorizedHandler(signOut);
  }, [signOut]);

  const value = useMemo(
    () => ({
      user: token ? (meQuery.data ?? null) : null,
      isAuthenticated: Boolean(token && meQuery.data),
      isLoading: Boolean(token) && meQuery.isPending,
      signIn,
      signOut,
      refreshUser,
    }),
    [token, meQuery.data, meQuery.isPending, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
