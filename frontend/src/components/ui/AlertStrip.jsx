import { cn } from '../../lib/cn'

export function AlertStrip({ tone = 'neutral', children, className }) {
  const tones = {
    neutral: 'border-[var(--color-border)] text-[var(--color-text-muted)]',
    error: 'border-[var(--color-danger)] text-[var(--color-danger)]',
    success: 'border-[var(--color-success)] text-[var(--color-success)]',
  }

  return (
    <p
      className={cn(
        'border-l-2 bg-[color-mix(in_srgb,var(--color-panel)_90%,transparent)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em]',
        tones[tone],
        className,
      )}
      role="status"
    >
      {children}
    </p>
  )
}
