import { cn } from '../../lib/cn'

export function TextField({
  id,
  label,
  error,
  className,
  description,
  inputMode,
  ...props
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {label}
      </label>
      <input
        id={id}
        inputMode={inputMode}
        className={cn(
          'h-12 w-full border border-[var(--color-border)] bg-transparent px-4 text-sm text-[var(--color-text)] transition-colors duration-200',
          'focus:border-[var(--color-accent)] focus:outline-none',
          error && 'border-[var(--color-danger)]',
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {description ? <p className="text-xs text-[var(--color-text-muted)]">{description}</p> : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-semibold text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  )
}
