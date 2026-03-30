import { cn } from '../../lib/cn'
import { titleCase } from '../../lib/format'

const statusStyles = {
  approved: 'bg-[color-mix(in_srgb,var(--color-success)_22%,transparent)] text-[var(--color-success)] border-[color-mix(in_srgb,var(--color-success)_60%,var(--color-border))]',
  rejected: 'bg-[color-mix(in_srgb,var(--color-danger)_22%,transparent)] text-[var(--color-danger)] border-[color-mix(in_srgb,var(--color-danger)_60%,var(--color-border))]',
  pending: 'bg-[color-mix(in_srgb,var(--color-warning)_22%,transparent)] text-[var(--color-warning)] border-[color-mix(in_srgb,var(--color-warning)_60%,var(--color-border))]',
}

export function StatusBadge({ status, className }) {
  const safe = status || 'pending'

  return (
    <span
      className={cn(
        'inline-flex min-w-24 justify-center border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-300',
        statusStyles[safe] || statusStyles.pending,
        className,
      )}
    >
      {titleCase(safe)}
    </span>
  )
}
