import { Link, Outlet } from 'react-router-dom';
import { useAuth, homePathFor } from '../../features/auth/authContext';
import { Button } from '../ui';
import { Logo } from './Logo';

/** Shell for the marketing page and the sign-in screens. */
export function PublicLayout() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="page flex h-16 items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-2">
            <a href="/#how-it-works" className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline">
              How it works
            </a>
            {isAuthenticated ? (
              <Button as={Link} to={homePathFor(user)} size="sm">
                Open SkillSwap
              </Button>
            ) : (
              <>
                <Button as={Link} to="/login" variant="ghost" size="sm">
                  Log in
                </Button>
                <Button as={Link} to="/signup" size="sm">
                  Get started
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-100">
        <div className="page flex flex-col items-center justify-between gap-3 py-8 text-sm text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} SkillSwap</p>
          <p>Teach what you know. Learn what you don&apos;t.</p>
        </div>
      </footer>
    </div>
  );
}
