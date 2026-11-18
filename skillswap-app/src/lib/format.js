import { LEVELS, MODES } from './constants';

const levelLabels = Object.fromEntries(LEVELS.map((l) => [l.value, l.label]));
const modeLabels = Object.fromEntries(MODES.map((m) => [m.value, m.label]));

export const levelLabel = (value) => levelLabels[value] ?? value;
export const modeLabel = (value) => modeLabels[value] ?? value;

export const fullName = (person) => [person?.firstName, person?.lastName].filter(Boolean).join(' ');

export const initials = (person) =>
  [person?.firstName, person?.lastName]
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join('');

export const place = (...parts) => parts.filter(Boolean).join(', ');

const dateFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });
const relative = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

export const formatDate = (iso) => (iso ? dateFormat.format(new Date(iso)) : '');
export const formatMonth = (iso) => (iso ? monthFormat.format(new Date(iso)) : '');

/** "3 hours ago", "yesterday", or a date for anything older than a week. */
export function timeAgo(iso) {
  if (!iso) return '';
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return 'just now';
  if (abs < 3600) return relative.format(Math.round(seconds / 60), 'minute');
  if (abs < 86400) return relative.format(Math.round(seconds / 3600), 'hour');
  if (abs < 604800) return relative.format(Math.round(seconds / 86400), 'day');
  return formatDate(iso);
}
