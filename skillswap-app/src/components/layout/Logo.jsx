import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';

export function Logo({ to = '/' }) {
  return (
    <Link to={to} className="focus-ring flex items-center gap-2 rounded-md">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
        <ArrowLeftRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-slate-900">SkillSwap</span>
    </Link>
  );
}
