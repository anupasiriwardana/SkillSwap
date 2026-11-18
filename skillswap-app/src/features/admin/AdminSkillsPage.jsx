import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { GitMerge, Trash2 } from 'lucide-react';
import { Button, ErrorState, Field, FormError, Modal, PageHeader, Pagination, Select } from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { adminApi, adminKeys } from './adminApi';
import { AdminTable, SearchBox } from './AdminTable';

export default function AdminSkillsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [merging, setMerging] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const q = useDebouncedValue(search.trim(), 300);
  const params = { q, page, size: 20 };

  const query = useQuery({
    queryKey: adminKeys.skills(params),
    queryFn: () => adminApi.skills(params),
    placeholderData: keepPreviousData,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin'] });

  const deleteMutation = useMutation({
    mutationFn: (skill) => adminApi.deleteSkill(skill.id),
    onSuccess: (_, skill) => {
      toast.success(`${skill.name} deleted`);
      setDeleting(null);
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const columns = [
    { key: 'name', label: 'Skill', render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
    { key: 'teach', label: 'Teaching', className: 'text-right tabular-nums', render: (row) => row.teachCount },
    { key: 'learn', label: 'Learning', className: 'text-right tabular-nums', render: (row) => row.learnCount },
    { key: 'created', label: 'Added', render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions',
      label: <span className="sr-only">Actions</span>,
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => setMerging(row)}>
            <GitMerge className="h-4 w-4" /> Merge
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleting(row)} aria-label={`Delete ${row.name}`}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Skills"
        description="Members create skills as they list them. Merge duplicates such as “Guitar lessons” into “Guitar” to keep matching accurate."
      />
      <SearchBox
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        placeholder="Search skills"
      />
      {query.isError ? (
        <ErrorState message={errorMessage(query.error)} onRetry={query.refetch} />
      ) : (
        <>
          <AdminTable columns={columns} rows={query.data?.content ?? []} loading={query.isPending} empty="No skills found." />
          <Pagination page={page} totalPages={query.data?.totalPages ?? 0} onChange={setPage} />
        </>
      )}

      {merging && (
        <MergeSkillModal
          source={merging}
          onClose={() => setMerging(null)}
          onMerged={() => {
            setMerging(null);
            refresh();
          }}
        />
      )}

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={`Delete ${deleting?.name}?`}
        description={
          deleting &&
          `This removes the skill and ${deleting.teachCount + deleting.learnCount} member listing(s) that use it. This cannot be undone.`
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleting)}>
              Delete skill
            </Button>
          </>
        }
      />
    </>
  );
}

function MergeSkillModal({ source, onClose, onMerged }) {
  const [search, setSearch] = useState('');
  const [targetId, setTargetId] = useState('');
  const q = useDebouncedValue(search.trim(), 250);
  const options = useQuery({
    queryKey: adminKeys.skills({ q, page: 0, size: 50, purpose: 'merge' }),
    queryFn: () => adminApi.skills({ q, page: 0, size: 50 }),
  });
  const candidates = (options.data?.content ?? []).filter((skill) => skill.id !== source.id);

  const mutation = useMutation({
    mutationFn: () => adminApi.mergeSkill(source.id, Number(targetId)),
    onSuccess: () => {
      toast.success(`${source.name} merged`);
      onMerged();
    },
  });

  return (
    <Modal
      open
      onClose={onClose}
      title={`Merge ${source.name}`}
      description="All listings and requests move to the skill you choose, and this skill is removed."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!targetId}>
            Merge
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormError message={mutation.isError ? errorMessage(mutation.error) : null} />
        <SearchBox value={search} onChange={setSearch} placeholder="Find the skill to keep" />
        <Field label="Merge into">
          <Select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
            <option value="">Choose a skill</option>
            {candidates.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name} ({skill.teachCount + skill.learnCount} listings)
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
