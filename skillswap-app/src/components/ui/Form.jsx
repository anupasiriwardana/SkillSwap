import { useId, cloneElement, isValidElement } from 'react';
import { cn } from '../../lib/cn';

const control =
  'block w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 ' +
  'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:bg-slate-50';

const stateClass = (invalid) =>
  invalid ? 'border-red-300 focus:border-red-400' : 'border-slate-200 hover:border-slate-300 focus:border-brand-500';

export function Input({ className, invalid, ...props }) {
  return <input className={cn(control, 'h-10', stateClass(invalid), className)} {...props} />;
}

export function Textarea({ className, invalid, rows = 4, ...props }) {
  return <textarea rows={rows} className={cn(control, 'py-2 leading-relaxed', stateClass(invalid), className)} {...props} />;
}

export function Select({ className, invalid, children, ...props }) {
  return (
    <select className={cn(control, 'h-10 pr-8', stateClass(invalid), className)} {...props}>
      {children}
    </select>
  );
}

/**
 * Label + control + hint/error. The single child control receives the generated id
 * and aria attributes automatically.
 */
export function Field({ label, hint, error, optional, className, children }) {
  const id = useId();
  const messageId = `${id}-message`;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        invalid: Boolean(error),
        'aria-invalid': Boolean(error) || undefined,
        'aria-describedby': error || hint ? messageId : undefined,
      })
    : children;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-slate-700">
          {label}
          {optional && <span className="text-xs font-normal text-slate-400">Optional</span>}
        </label>
      )}
      {control}
      {(error || hint) && (
        <p id={messageId} className={cn('text-xs', error ? 'text-red-600' : 'text-slate-500')}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      {message}
    </div>
  );
}

/** Pill-style radio group used for small choices such as teaching mode. */
export function ChoiceGroup({ options, value, onChange, name }) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            name={name}
            onClick={() => onChange(option.value)}
            className={cn(
              'focus-ring rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              selected
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
