import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Tags, Users } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Badge } from '../ui';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

const links = [
  { to: '/admin', label: 'Overview', icon: BarChart3, end: true },
  { to: '/admin/users', label: 'Members', icon: Users },
  { to: '/admin/skills', label: 'Skills', icon: Tags },
];

export function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="page flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo to="/admin" />
            <Badge tone="brand">Admin</Badge>
          </div>
          <UserMenu showProfileLinks={false} />
        </div>
        <nav className="page flex gap-1 overflow-x-auto pb-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'focus-ring flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="page flex-1 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
