import { NavLink, Outlet } from 'react-router-dom';
import { Compass, Inbox, Layers } from 'lucide-react';
import { useAuth } from '../../features/auth/authContext';
import { cn } from '../../lib/cn';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

/** Shell for signed-in members. */
export function AppLayout() {
  const { user } = useAuth();
  const pending = user?.pendingIncomingRequests ?? 0;

  const links = [
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/skills', label: 'My skills', icon: Layers },
    { to: '/requests', label: 'Requests', icon: Inbox, count: pending },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="page flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Logo to="/discover" />
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <AppNavLink key={link.to} {...link} />
              ))}
            </nav>
          </div>
          <UserMenu />
        </div>
        <nav className="page flex gap-1 overflow-x-auto pb-2 md:hidden">
          {links.map((link) => (
            <AppNavLink key={link.to} {...link} />
          ))}
        </nav>
      </header>

      <main className="page flex-1 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}

function AppNavLink({ to, label, icon: Icon, count }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'focus-ring flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        )
      }
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
      {count > 0 && (
        <span className="min-w-5 rounded-full bg-brand-600 px-1.5 text-center text-xs font-semibold leading-5 text-white">
          {count}
        </span>
      )}
    </NavLink>
  );
}
