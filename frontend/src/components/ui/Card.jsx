import { cn } from '../../lib/cn'

export function Card({ children, className }) {
  return (
    <section
      className={cn(
        'border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_90%,transparent)] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_30px_-24px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      {children}
    </section>
  )
}
