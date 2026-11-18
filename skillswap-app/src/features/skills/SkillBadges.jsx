import { Globe, MapPin } from 'lucide-react';
import { Badge } from '../../components/ui';
import { levelLabel, modeLabel, place } from '../../lib/format';

/** Level, meeting mode and place for one listing. */
export function SkillMeta({ listing }) {
  const inPerson = listing.mode !== 'ONLINE';
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge>{levelLabel(listing.level)}</Badge>
      <Badge tone={inPerson ? 'amber' : 'blue'}>
        {inPerson ? <MapPin className="h-3 w-3" aria-hidden="true" /> : <Globe className="h-3 w-3" aria-hidden="true" />}
        {modeLabel(listing.mode)}
      </Badge>
      {inPerson && listing.city && (
        <span className="text-xs text-slate-500">{place(listing.location, listing.city)}</span>
      )}
    </div>
  );
}

/** Compact list of skill names, e.g. on member cards. */
export function SkillChips({ listings, tone = 'neutral', limit = 4 }) {
  if (!listings?.length) return <span className="text-sm text-slate-400">None listed</span>;
  const shown = listings.slice(0, limit);
  const rest = listings.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((listing) => (
        <Badge key={listing.id} tone={tone}>
          {listing.skillName}
        </Badge>
      ))}
      {rest > 0 && <Badge>+{rest} more</Badge>}
    </div>
  );
}
