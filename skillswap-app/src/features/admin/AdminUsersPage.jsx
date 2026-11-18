import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Avatar, Badge, Button, ErrorState, Modal, PageHeader, Pagination } from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { formatDate, fullName } from '../../lib/format';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { useAuth } from '../auth/authContext';
import { adminApi, adminKeys } from './adminApi';
import { AdminTable, SearchBox } from './AdminTable';

export default function AdminUsersPage() {
  const { user: admin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [target, setTarget] = useState(null);
  const q = useDebouncedValue(search.trim(), 300);
  const params = { q, page, size: 20 };

  const query = useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminApi.users(params),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({ id, active }) => adminApi.setUserStatus(id, active),
    onSuccess: (updated) => {
      toast.success(`${fullName(updated)} ${updated.active ? 'reactivated' : 'deactivated'}`);
      setTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const columns = [
    {
      key: 'name',
      label: 'Member',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar person={row} size="sm" />
          <div>
            <p className="font-medium text-slate-900">{fullName(row)}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Role', render: (row) => <Badge tone={row.role === 'ADMIN' ? 'brand' : 'neutral'}>{row.role === 'ADMIN' ? 'Admin' : 'Member'}</Badge> },
    { key: 'status', label: 'Status', render: (row) => <Badge tone={row.active ? 'green' : 'red'}>{row.active ? 'Active' : 'Deactivated'}</Badge> },
    { key: 'joined', label: 'Joined', render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions',
      label: <span className="sr-only">Actions</span>,
      className: 'text-right',
      render: (row) =>
        row.id === admin.id ? (
          <span className="text-xs text-slate-400">You</span>
        ) : (
          <Button variant={row.active ? 'danger' : 'secondary'} size="sm" onClick={() => setTarget(row)}>
            {row.active ? 'Deactivate' : 'Reactivate'}
          </Button>
        ),
    },
  ];

  return (
    <>
      <PageHeader title="Members" description="Deactivated members cannot sign in and are hidden from everyone else." />
      <SearchBox
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        placeholder="Search by name or email"
      />
      {query.isError ? (
        <ErrorState message={errorMessage(query.error)} onRetry={query.refetch} />
      ) : (
        <>
          <AdminTable columns={columns} rows={query.data?.content ?? []} loading={query.isPending} empty="No members found." />
          <Pagination page={page} totalPages={query.data?.totalPages ?? 0} onChange={setPage} />
        </>
      )}

      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title={target?.active ? `Deactivate ${fullName(target)}?` : `Reactivate ${fullName(target)}?`}
        description={
          target?.active
            ? 'They will be signed out, will not be able to log in, and will disappear from matches and the directory.'
            : 'They will be able to sign in again and will reappear in matches and the directory.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button
              variant={target?.active ? 'danger' : 'primary'}
              loading={mutation.isPending}
              onClick={() => mutation.mutate({ id: target.id, active: !target.active })}
            >
              {target?.active ? 'Deactivate' : 'Reactivate'}
            </Button>
          </>
        }
      />
    </>
  );
}
