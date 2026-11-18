import { useQuery } from '@tanstack/react-query';
import { BookOpen, Check, Clock, GraduationCap, Tags, UserX, Users } from 'lucide-react';
import { Card, ErrorState, PageHeader, Skeleton } from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { adminApi, adminKeys } from './adminApi';

export default function AdminOverviewPage() {
  const query = useQuery({ queryKey: adminKeys.stats, queryFn: adminApi.stats });

  const stats = query.data && [
    { label: 'Members', value: query.data.members, icon: Users },
    { label: 'Deactivated', value: query.data.deactivatedMembers, icon: UserX },
    { label: 'Skills in catalogue', value: query.data.skills, icon: Tags },
    { label: 'Teaching listings', value: query.data.teachListings, icon: GraduationCap },
    { label: 'Learning listings', value: query.data.learnListings, icon: BookOpen },
    { label: 'Pending requests', value: query.data.pendingRequests, icon: Clock },
    { label: 'Accepted swaps', value: query.data.acceptedRequests, icon: Check },
  ];

  return (
    <>
      <PageHeader title="Overview" description="A snapshot of activity on SkillSwap." />
      {query.isError ? (
        <ErrorState message={errorMessage(query.error)} onRetry={query.refetch} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {query.isPending
            ? Array.from({ length: 7 }, (_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
            : stats.map(({ label, value, icon: Icon }) => (
                <Card key={label} className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{label}</p>
                    <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold tabular-nums text-slate-900">{value.toLocaleString()}</p>
                </Card>
              ))}
        </div>
      )}
    </>
  );
}
