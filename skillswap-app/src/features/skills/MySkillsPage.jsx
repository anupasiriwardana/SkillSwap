import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowRight, BookOpen, GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Card, EmptyState, ErrorState, Modal, PageHeader, Skeleton } from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { SKILL_TYPES } from '../../lib/constants';
import { discoverKeys } from '../discover/discoverApi';
import { profileApi, profileKeys } from '../profile/profileApi';
import { SkillFormModal } from './SkillFormModal';
import { SkillMeta } from './SkillBadges';
import { skillKeys, skillsApi } from './skillsApi';

const sections = [
  {
    type: SKILL_TYPES.TEACH,
    title: 'Skills I teach',
    description: 'What you can help others learn.',
    icon: GraduationCap,
    empty: 'Add something you know well. It can be an instrument, a language, a subject, or a hobby.',
  },
  {
    type: SKILL_TYPES.LEARN,
    title: 'Skills I want to learn',
    description: 'What you would like someone to teach you.',
    icon: BookOpen,
    empty: 'Add something you want to pick up. We will look for people who teach it.',
  },
];

export default function MySkillsPage() {
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState(null); // { type, listing? }
  const [pendingDelete, setPendingDelete] = useState(null);

  const skillsQuery = useQuery({ queryKey: skillKeys.mine, queryFn: skillsApi.listMine });
  const profileQuery = useQuery({ queryKey: profileKeys.mine, queryFn: profileApi.getMine });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: skillKeys.mine });
    queryClient.invalidateQueries({ queryKey: discoverKeys.all });
  };

  const deleteMutation = useMutation({
    mutationFn: (listing) => skillsApi.remove(listing.id),
    onSuccess: (_, listing) => {
      toast.success(`${listing.skillName} removed`);
      setPendingDelete(null);
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const saveListing = async (values) => {
    if (editor.listing) {
      await skillsApi.update(editor.listing.id, values);
      toast.success('Skill updated');
    } else {
      const added = await skillsApi.add(values);
      toast.success(`${added.skillName} added`);
    }
    refresh();
  };

  const listings = skillsQuery.data ?? [];
  const hasBoth =
    listings.some((l) => l.type === SKILL_TYPES.TEACH) && listings.some((l) => l.type === SKILL_TYPES.LEARN);

  return (
    <>
      <PageHeader
        title="My skills"
        description="Your listings decide who you match with. Add as many as you like."
        actions={
          hasBoth && (
            <Button as={Link} to="/discover" variant="secondary">
              See matches <ArrowRight className="h-4 w-4" />
            </Button>
          )
        }
      />

      {skillsQuery.isError ? (
        <ErrorState message={errorMessage(skillsQuery.error)} onRetry={skillsQuery.refetch} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {sections.map((section) => (
            <SkillSection
              key={section.type}
              section={section}
              loading={skillsQuery.isPending}
              listings={listings.filter((l) => l.type === section.type)}
              onAdd={() => setEditor({ type: section.type })}
              onEdit={(listing) => setEditor({ type: listing.type, listing })}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      {editor && (
        <SkillFormModal
          open
          type={editor.type}
          listing={editor.listing}
          defaultCity={profileQuery.data?.city}
          onClose={() => setEditor(null)}
          onSubmit={saveListing}
        />
      )}

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Remove this skill?"
        description={pendingDelete && `${pendingDelete.skillName} will no longer appear on your profile or in matches.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(pendingDelete)}
            >
              Remove
            </Button>
          </>
        }
      />
    </>
  );
}

function SkillSection({ section, listings, loading, onAdd, onEdit, onDelete }) {
  const Icon = section.icon;
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-slate-900">{section.title}</h2>
            <p className="text-sm text-slate-500">{section.description}</p>
          </div>
        </div>
        {listings.length > 0 && (
          <Button variant="secondary" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          icon={Icon}
          title="Nothing here yet"
          description={section.empty}
          action={
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4" /> Add a skill
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {listings.map((listing) => (
            <li key={listing.id}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <h3 className="font-medium text-slate-900">{listing.skillName}</h3>
                    <SkillMeta listing={listing} />
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(listing)} aria-label={`Edit ${listing.skillName}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(listing)} aria-label={`Remove ${listing.skillName}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {listing.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">{listing.description}</p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
