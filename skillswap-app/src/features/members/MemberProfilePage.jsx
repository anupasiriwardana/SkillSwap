import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, CalendarDays, GraduationCap, Lock, Mail, MapPin, Phone, Pencil } from 'lucide-react';
import { Avatar, Button, Card, EmptyState, ErrorState, FullPageSpinner } from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { formatMonth, fullName, place } from '../../lib/format';
import { useAuth } from '../auth/authContext';
import { ConnectionAction } from '../discover/ConnectionAction';
import { discoverApi, discoverKeys } from '../discover/discoverApi';
import { RequestSwapModal } from '../requests/RequestSwapModal';
import { SkillMeta } from '../skills/SkillBadges';

export default function MemberProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [requesting, setRequesting] = useState(false);
  const query = useQuery({ queryKey: discoverKeys.member(id), queryFn: () => discoverApi.member(id) });

  if (query.isPending) return <FullPageSpinner />;
  if (query.isError) {
    if (query.error?.response?.status === 404) {
      return (
        <EmptyState
          title="Member not found"
          description="This profile may have been removed or is not available."
          action={<Button as={Link} to="/discover" variant="secondary">Back to Discover</Button>}
        />
      );
    }
    return <ErrorState message={errorMessage(query.error)} onRetry={query.refetch} />;
  }

  const member = query.data;
  const isSelf = member.id === user.id;

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/discover" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Discover
      </Link>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar person={member} size="xl" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{fullName(member)}</h1>
              {member.headline && <p className="mt-1 text-slate-600">{member.headline}</p>}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                {(member.city || member.country) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden="true" /> {place(member.city, member.country)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" /> Joined {formatMonth(member.memberSince)}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            {isSelf ? (
              <Button as={Link} to="/settings" variant="secondary" size="sm">
                <Pencil className="h-4 w-4" /> Edit profile
              </Button>
            ) : (
              <ConnectionAction
                size="md"
                connection={member.connection}
                canRequest={member.teaching.length > 0}
                onRequest={() => setRequesting(true)}
              />
            )}
          </div>
        </div>

        {member.about && (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold text-slate-900">About</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-600">{member.about}</p>
          </div>
        )}

        <ContactSection member={member} isSelf={isSelf} />
      </Card>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ListingColumn icon={GraduationCap} title="Teaches" listings={member.teaching} empty="No teaching skills listed yet." />
        <ListingColumn icon={BookOpen} title="Wants to learn" listings={member.learning} empty="No learning goals listed yet." />
      </div>

      {requesting && (
        <RequestSwapModal
          open
          onClose={() => setRequesting(false)}
          member={member}
          theirTeaching={member.teaching}
          theyWantSkillIds={member.learning.map((l) => l.skillId)}
        />
      )}
    </div>
  );
}

function ContactSection({ member, isSelf }) {
  if (member.contact) {
    const { email, phone, address } = member.contact;
    return (
      <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
        <h2 className="text-sm font-semibold text-emerald-900">{isSelf ? 'Your contact details' : 'Contact details'}</h2>
        {!isSelf && (
          <p className="mt-0.5 text-xs text-emerald-800">You are connected, so you can reach {member.firstName} directly.</p>
        )}
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          <ContactItem icon={Mail} value={email} href={`mailto:${email}`} />
          {phone && <ContactItem icon={Phone} value={phone} href={`tel:${phone.replace(/\s/g, '')}`} />}
          {address && <ContactItem icon={MapPin} value={address} />}
        </dl>
      </div>
    );
  }
  return (
    <div className="mt-6 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
      <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
      Contact details are shared once a swap request is accepted.
    </div>
  );
}

function ContactItem({ icon: Icon, value, href }) {
  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
      <span className="truncate">{value}</span>
    </>
  );
  return (
    <dd className="flex min-w-0 items-center gap-2 text-slate-700">
      {href ? (
        <a href={href} className="flex min-w-0 items-center gap-2 hover:text-slate-900 hover:underline">
          {content}
        </a>
      ) : (
        content
      )}
    </dd>
  );
}

function ListingColumn({ icon: Icon, title, listings, empty }) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-brand-600" aria-hidden="true" /> {title}
        <span className="text-sm font-normal text-slate-400">{listings.length}</span>
      </h2>
      {listings.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {listings.map((listing) => (
            <li key={listing.id}>
              <Card className="space-y-2 p-4">
                <h3 className="font-medium text-slate-900">{listing.skillName}</h3>
                <SkillMeta listing={listing} />
                {listing.description && (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{listing.description}</p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
