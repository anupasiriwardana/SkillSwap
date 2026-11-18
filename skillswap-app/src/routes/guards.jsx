import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { homePathFor, useAuth } from '../features/auth/authContext';
import { FullPageSpinner } from '../components/ui';

/** Signed-in users only. Remembers where they were heading. */
export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

/** Members who have finished onboarding. Admins go to their own area. */
export function RequireMember() {
  const { user } = useAuth();
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (!user.profileCompleted) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

/**
 * Onboarding is only for members who have not completed their profile yet.
 * Once it is saved, the next step is adding skills.
 */
export function RequireIncompleteProfile() {
  const { user } = useAuth();
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.profileCompleted) return <Navigate to="/skills" replace />;
  return <Outlet />;
}

export function RequireAdmin() {
  const { user } = useAuth();
  if (user.role !== 'ADMIN') return <Navigate to={homePathFor(user)} replace />;
  return <Outlet />;
}

/** Login and signup: send signed-in users on to the app. */
export function GuestOnly() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <FullPageSpinner />;
  if (isAuthenticated) {
    const from = location.state?.from?.pathname;
    return <Navigate to={from && from !== '/' ? from : homePathFor(user)} replace />;
  }
  return <Outlet />;
}
