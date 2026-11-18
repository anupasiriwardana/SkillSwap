import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';

export default function NotFoundPage() {
  return (
    <div className="page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-slate-500">The link may be broken, or the page may have moved.</p>
      <Button as={Link} to="/" variant="secondary" className="mt-6">
        Back to home
      </Button>
    </div>
  );
}
