import { useSearchParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeftRight, Inbox, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Avatar, Badge, Button, Card, EmptyState, ErrorState, PageHeader, Skeleton, Tabs } from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { REQUEST_STATUS } from '../../lib/constants';
import { fullName, timeAgo } from '../../lib/format';
import { ME_QUERY_KEY } from '../auth/authContext';
import { discoverKeys } from '../discover/discoverApi';
import { requestKeys, requestsApi } from './requestsApi';

const statusBadge = {
  PENDING: { tone: 'amber', label: 'Pending' },
  ACCEPTED: { tone: 'green', label: 'Accepted' },
  DECLINED: { tone: 'neutral', label: 'Declined' },
  CANCELLED: { tone: 'neutral', label: 'Cancelled' },
};

export default function RequestsPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'sent' ? 'sent' : 'received';

  const incoming = useQuery({ queryKey: requestKeys.incoming, queryFn: requestsApi.incoming });
  const outgoing = useQuery({ queryKey: requestKeys.outgoing, queryFn: requestsApi.outgoing });
  const pendingIncoming = incoming.data?.filter((r) => r.status === REQUEST_STATUS.PENDING).length;

  const active = tab === 'received' ? incoming : outgoing;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Requests" description="Swap requests you have received and sent." />
      <Tabs
        className="mb-6"
        value={tab}
        onChange={(value) => setParams(value === 'sent' ? { tab: 'sent' } : {}, { replace: true })}
        tabs={[
          { value: 'received', label: 'Received', count: pendingIncoming || null },
          { value: 'sent', label: 'Sent' },
        ]}
      />

      {active.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      ) : active.isError ? (
        <ErrorState message={errorMessage(active.error)} onRetry={active.refetch} />
      ) : active.data.length === 0 ? (
        tab === 'received' ? (
          <EmptyState
            icon={Inbox}
            title="No requests yet"
            description="When someone wants to swap skills with you, it will show up here."
          />
        ) : (
          <EmptyState
            icon={Send}
            title="You haven't sent any requests"
            description="Find someone whose skills fit yours and ask for a swap."
            action={<Button as={Link} to="/discover">Find matches</Button>}
          />
        )
      ) : (
        <ul className="space-y-3">
          {active.data.map((request) => (
            <li key={request.id}>
              <RequestCard request={request} direction={tab} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RequestCard({ request, direction }) {
  const queryClient = useQueryClient();
  const received = direction === 'received';
  const other = received ? request.sender : request.recipient;
  const badge = statusBadge[request.status];

  const mutation = useMutation({
    mutationFn: (action) => requestsApi[action](request.id),
    onSuccess: (_, action) => {
      const messages = {
        accept: `You're connected with ${other.firstName}`,
        decline: 'Request declined',
        cancel: 'Request cancelled',
      };
      toast.success(messages[action]);
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: discoverKeys.all });
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const learner = received ? other.firstName : 'You';
  const teacher = received ? 'you' : other.firstName;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <Link to={`/members/${other.id}`} className="flex min-w-0 items-center gap-3">
          <Avatar person={other} />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 hover:underline">{fullName(other)}</p>
            <p className="text-xs text-slate-500">{timeAgo(request.createdAt)}</p>
          </div>
        </Link>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-700">
        <span>
          {learner} {received ? 'wants' : 'want'} to learn{' '}
          <strong className="font-medium text-slate-900">{request.requestedSkill?.name ?? 'a removed skill'}</strong> from {teacher}
        </span>
        {request.offeredSkill && (
          <span className="flex items-center gap-1.5 text-slate-500">
            <ArrowLeftRight className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            offering <strong className="font-medium text-slate-900">{request.offeredSkill.name}</strong> in return
          </span>
        )}
      </div>

      {request.message && (
        <p className="mt-3 whitespace-pre-line rounded-lg bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
          {request.message}
        </p>
      )}

      {request.status === REQUEST_STATUS.ACCEPTED && request.contact && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-slate-700">
          <a href={`mailto:${request.contact.email}`} className="flex items-center gap-1.5 hover:underline">
            <Mail className="h-4 w-4 text-emerald-700" aria-hidden="true" /> {request.contact.email}
          </a>
          {request.contact.phone && (
            <a href={`tel:${request.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:underline">
              <Phone className="h-4 w-4 text-emerald-700" aria-hidden="true" /> {request.contact.phone}
            </a>
          )}
          {request.contact.address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-700" aria-hidden="true" /> {request.contact.address}
            </span>
          )}
        </div>
      )}

      {request.status === REQUEST_STATUS.PENDING && (
        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
          {received ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                loading={mutation.isPending && mutation.variables === 'decline'}
                disabled={mutation.isPending}
                onClick={() => mutation.mutate('decline')}
              >
                Decline
              </Button>
              <Button
                size="sm"
                loading={mutation.isPending && mutation.variables === 'accept'}
                disabled={mutation.isPending}
                onClick={() => mutation.mutate('accept')}
              >
                Accept
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" loading={mutation.isPending} onClick={() => mutation.mutate('cancel')}>
              Cancel request
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
