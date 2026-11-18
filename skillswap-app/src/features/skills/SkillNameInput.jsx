import { useId, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '../../components/ui';
import { cn } from '../../lib/cn';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { skillKeys, skillsApi } from './skillsApi';

/**
 * Free-text skill name with suggestions from skills other members already use,
 * so "guitar" and "Guitar" end up as the same skill.
 */
export function SkillNameInput({ value, onChange, onBlur, invalid, id, ...aria }) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const query = useDebouncedValue(value.trim(), 200);

  const { data: suggestions = [] } = useQuery({
    queryKey: skillKeys.suggest(query),
    queryFn: () => skillsApi.suggest(query),
    enabled: open && query.length >= 1,
    staleTime: 60_000,
  });

  const visible = open && suggestions.length > 0 &&
    !(suggestions.length === 1 && suggestions[0].name.toLowerCase() === value.trim().toLowerCase());

  const choose = (name) => {
    onChange(name);
    setOpen(false);
    setHighlight(-1);
  };

  const onKeyDown = (event) => {
    if (!visible) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
    } else if (event.key === 'Enter' && highlight >= 0) {
      event.preventDefault();
      choose(suggestions[highlight].name);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <Input
        id={id}
        {...aria}
        invalid={invalid}
        value={value}
        autoComplete="off"
        placeholder="e.g. Guitar, Mathematics, Spanish"
        role="combobox"
        aria-expanded={visible}
        aria-controls={listId}
        aria-autocomplete="list"
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Let a click on a suggestion land before closing
          setTimeout(() => setOpen(false), 120);
          onBlur?.();
        }}
        onKeyDown={onKeyDown}
      />
      {visible && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-raised"
        >
          {suggestions.map((skill, index) => (
            <li
              key={skill.id}
              role="option"
              aria-selected={index === highlight}
              onMouseDown={(event) => {
                event.preventDefault();
                choose(skill.name);
              }}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm text-slate-700',
                index === highlight ? 'bg-brand-50 text-brand-800' : 'hover:bg-slate-50',
              )}
            >
              {skill.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
