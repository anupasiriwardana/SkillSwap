import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { useAuth } from '../../features/auth/authContext';
import { fullName } from '../../lib/format';
import { Avatar } from '../ui';

export function UserMenu({ showProfileLinks = true }) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (event.type === 'keydown' ? event.key === 'Escape' : !ref.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  if (!user) return null;

  const item = 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="focus-ring flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar person={user} size="sm" />
        <span className="hidden text-sm font-medium text-slate-700 md:inline">{user.firstName}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-raised">
          <div className="border-b border-slate-100 px-3 pb-2.5 pt-1.5">
            <p className="truncate text-sm font-medium text-slate-900">{fullName(user)}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <div className="pt-1.5" onClick={() => setOpen(false)}>
            {showProfileLinks && (
              <>
                <Link role="menuitem" to={`/members/${user.id}`} className={item}>
                  <UserRound className="h-4 w-4 text-slate-400" /> View my profile
                </Link>
                <Link role="menuitem" to="/settings" className={item}>
                  <Settings className="h-4 w-4 text-slate-400" /> Profile settings
                </Link>
              </>
            )}
            <button role="menuitem" type="button" onClick={signOut} className={item}>
              <LogOut className="h-4 w-4 text-slate-400" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
