import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Avatar, Card } from '../../components/ui';
import { fullName, place } from '../../lib/format';
import { SkillChips } from '../skills/SkillBadges';
import { ConnectionAction } from './ConnectionAction';

/**
 * Card for a member. `primary` and `secondary` are labelled rows of skills, e.g.
 * "Can teach you" / "Wants to learn" on matches, or "Teaches" / "Learning" in the directory.
 */
export function MemberCard({ member, primary, secondary, onRequest, canRequest = true }) {
  return (
    <Card className="flex h-full flex-col p-5 transition-shadow hover:shadow-raised">
      <Link to={`/members/${member.id}`} className="focus-ring -m-1 flex items-start gap-3 rounded-lg p-1">
        <Avatar person={member} />
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{fullName(member)}</h3>
          {member.headline && <p className="line-clamp-1 text-sm text-slate-600">{member.headline}</p>}
          {(member.city || member.country) && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {place(member.city, member.country)}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-4 flex-1 space-y-3">
        <SkillRow label={primary.label} listings={primary.listings} tone="brand" />
        <SkillRow label={secondary.label} listings={secondary.listings} tone="neutral" />
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <Link to={`/members/${member.id}`} className="text-sm font-medium text-slate-600 hover:text-slate-900">
          View profile
        </Link>
        <ConnectionAction connection={member.connection} onRequest={onRequest} canRequest={canRequest} />
      </div>
    </Card>
  );
}

function SkillRow({ label, listings, tone }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <SkillChips listings={listings} tone={tone} />
    </div>
  );
}
