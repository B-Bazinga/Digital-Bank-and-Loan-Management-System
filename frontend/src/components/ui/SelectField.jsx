import { cn } from '../../lib/cn'

export function SelectField({ id, label, options, className, ...props }) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {label}
      </label>
      <select
        id={id}
        className="h-12 w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
        {...props}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
