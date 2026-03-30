import { cn } from '../../lib/cn'

const steps = ['pending', 'approved', 'rejected']

function stateForStep(activeStatus, step) {
  if (activeStatus === 'pending') {
    return step === 'pending' ? 'active' : 'inactive'
  }

  if (activeStatus === 'approved') {
    return step === 'rejected' ? 'inactive' : step === 'approved' ? 'active' : 'done'
  }

  if (activeStatus === 'rejected') {
    return step === 'approved' ? 'inactive' : step === 'rejected' ? 'active' : 'done'
  }

  return 'inactive'
}

export function LoanTimeline({ status }) {
  return (
    <ol className="grid gap-4 md:grid-cols-3" aria-label="Loan progress">
      {steps.map((step) => {
        const state = stateForStep(status, step)

        return (
          <li
            key={step}
            className={cn(
              'relative overflow-hidden border p-4 transition-all duration-300',
              state === 'active' && 'border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]',
              state === 'done' && 'border-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_14%,transparent)]',
              state === 'inactive' && 'border-[var(--color-border)]',
            )}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Stage</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-text)]">{step}</p>
            <span
              className={cn(
                'absolute inset-x-0 bottom-0 h-[2px]',
                state === 'active' && 'bg-[var(--color-accent)]',
                state === 'done' && 'bg-[var(--color-success)]',
                state === 'inactive' && 'bg-[var(--color-border)]',
              )}
            />
          </li>
        )
      })}
    </ol>
  )
}
