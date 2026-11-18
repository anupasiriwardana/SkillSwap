import { Card } from '../../components/ui';

export function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-gradient-to-b from-brand-50/60 to-white px-4 py-12 sm:items-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <Card className="p-6 sm:p-8">{children}</Card>
        {footer && <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>}
      </div>
    </div>
  );
}
