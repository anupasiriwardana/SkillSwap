import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ArrowLeftRight, GraduationCap, Search, Sparkles, Users } from 'lucide-react';
import {
  Button,
  CardSkeletons,
  EmptyState,
  ErrorState,
  Input,
  PageHeader,
  Pagination,
  Select,
  Tabs,
} from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { MODES } from '../../lib/constants';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { RequestSwapModal } from '../requests/RequestSwapModal';
import { discoverApi, discoverKeys } from './discoverApi';
import { MemberCard } from './MemberCard';

export default function DiscoverPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'members' ? 'members' : 'matches';
  const [requestTarget, setRequestTarget] = useState(null);

  return (
    <>
      <PageHeader
        title="Discover"
        description="People whose skills fit yours, and everyone else who is swapping on SkillSwap."
      />
      <Tabs
        className="mb-6"
        value={tab}
        onChange={(value) => setParams(value === 'members' ? { tab: 'members' } : {}, { replace: true })}
        tabs={[
          { value: 'matches', label: 'Your matches' },
          { value: 'members', label: 'All members' },
        ]}
      />
      {tab === 'matches' ? <Matches onRequest={setRequestTarget} /> : <Directory onRequest={setRequestTarget} />}

      {requestTarget && (
        <RequestSwapModal
          open
          onClose={() => setRequestTarget(null)}
          member={requestTarget.member}
          theirTeaching={requestTarget.theirTeaching}
          theyWantSkillIds={requestTarget.theyWantSkillIds}
        />
      )}
    </>
  );
}

function Matches({ onRequest }) {
  const [mode, setMode] = useState('');
  const [cityInput, setCityInput] = useState('');
  const city = useDebouncedValue(cityInput.trim(), 350);
  const filters = { mode, city };

  const query = useQuery({
    queryKey: discoverKeys.matches(filters),
    queryFn: () => discoverApi.matches(filters),
    placeholderData: keepPreviousData,
  });

  const filterBar = (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <Select value={mode} onChange={(e) => setMode(e.target.value)} className="sm:w-56" aria-label="Meeting preference">
        <option value="">Online or in person</option>
        {MODES.filter((m) => m.value !== 'BOTH').map((m) => (
          <option key={m.value} value={m.value}>
            {m.label} only
          </option>
        ))}
      </Select>
      <Input
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        placeholder="Filter by city"
        className="sm:w-64"
        aria-label="City"
      />
    </div>
  );

  if (query.isPending) return <>{filterBar}<CardSkeletons /></>;
  if (query.isError) return <ErrorState message={errorMessage(query.error)} onRetry={query.refetch} />;

  const { mutual, canTeachYou, wantToLearn, hasTeachSkills, hasLearnSkills } = query.data;

  if (!hasTeachSkills && !hasLearnSkills) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Add your skills to see matches"
        description="Tell us what you can teach and what you want to learn. We'll find people who fit."
        action={<Button as={Link} to="/skills">Add skills</Button>}
      />
    );
  }

  const total = mutual.length + canTeachYou.length + wantToLearn.length;
  const toTarget = (match) => ({
    member: match,
    theirTeaching: match.canTeachYou,
    theyWantSkillIds: match.wantsToLearn.map((l) => l.skillId),
  });

  return (
    <>
      {filterBar}
      {(!hasTeachSkills || !hasLearnSkills) && (
        <div className="mb-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          {hasTeachSkills
            ? 'Add something you want to learn to find people who can teach you.'
            : 'Add something you can teach to find mutual matches.'}{' '}
          <Link to="/skills" className="font-medium underline underline-offset-2">
            Go to My skills
          </Link>
        </div>
      )}

      {total === 0 ? (
        <EmptyState
          icon={Users}
          title="No matches yet"
          description={
            mode || city
              ? 'Nothing fits these filters. Try clearing them.'
              : 'Nobody fits your skills right now. New members join all the time, so check back soon or browse everyone.'
          }
          action={
            <Button as={Link} to="/discover?tab=members" variant="secondary">
              Browse all members
            </Button>
          }
        />
      ) : (
        <div className="space-y-10">
          <MatchSection
            icon={ArrowLeftRight}
            title="Mutual matches"
            description="They teach something you want to learn, and want to learn something you teach."
            matches={mutual}
            render={(match) => (
              <MemberCard
                member={match}
                primary={{ label: 'Can teach you', listings: match.canTeachYou }}
                secondary={{ label: 'Wants to learn from you', listings: match.wantsToLearn }}
                onRequest={() => onRequest(toTarget(match))}
              />
            )}
          />
          <MatchSection
            icon={GraduationCap}
            title="Can teach you"
            description="They teach something on your learning list."
            matches={canTeachYou}
            render={(match) => (
              <MemberCard
                member={match}
                primary={{ label: 'Can teach you', listings: match.canTeachYou }}
                secondary={{ label: 'Wants to learn from you', listings: match.wantsToLearn }}
                onRequest={() => onRequest(toTarget(match))}
              />
            )}
          />
          <MatchSection
            icon={Users}
            title="Want to learn from you"
            description="They want to learn something you teach. Open their profile to see what they offer."
            matches={wantToLearn}
            render={(match) => (
              <MemberCard
                member={match}
                primary={{ label: 'Wants to learn from you', listings: match.wantsToLearn }}
                secondary={{ label: 'Can teach you', listings: match.canTeachYou }}
                canRequest={false}
              />
            )}
          />
        </div>
      )}
    </>
  );
}

function MatchSection({ icon: Icon, title, description, matches, render }) {
  if (matches.length === 0) return null;
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 text-brand-600" aria-hidden="true" />
        <div>
          <h2 className="font-semibold text-slate-900">
            {title} <span className="ml-1 text-sm font-normal text-slate-400">{matches.length}</span>
          </h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <div key={match.id}>{render(match)}</div>
        ))}
      </div>
    </section>
  );
}

function Directory({ onRequest }) {
  const [skillInput, setSkillInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [page, setPage] = useState(0);
  const skill = useDebouncedValue(skillInput.trim(), 350);
  const city = useDebouncedValue(cityInput.trim(), 350);
  const filters = { skill, city, page, size: 12 };

  const query = useQuery({
    queryKey: discoverKeys.members(filters),
    queryFn: () => discoverApi.members(filters),
    placeholderData: keepPreviousData,
  });

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(0);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input value={skillInput} onChange={updateFilter(setSkillInput)} placeholder="Search by skill" className="pl-9" aria-label="Skill" />
        </div>
        <Input value={cityInput} onChange={updateFilter(setCityInput)} placeholder="Filter by city" className="sm:w-64" aria-label="City" />
      </div>

      {query.isPending ? (
        <CardSkeletons />
      ) : query.isError ? (
        <ErrorState message={errorMessage(query.error)} onRetry={query.refetch} />
      ) : query.data.content.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members found"
          description={skill || city ? 'Try a different skill or city.' : 'No other members have joined yet.'}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.content.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                primary={{ label: 'Teaches', listings: member.teaching }}
                secondary={{ label: 'Wants to learn', listings: member.learning }}
                canRequest={member.teaching.length > 0}
                onRequest={() =>
                  onRequest({
                    member,
                    theirTeaching: member.teaching,
                    theyWantSkillIds: member.learning.map((l) => l.skillId),
                  })
                }
              />
            ))}
          </div>
          <Pagination page={page} totalPages={query.data.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
