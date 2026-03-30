import { cn } from '../../lib/cn'

const variants = {
  primary: 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:brightness-110',
  ghost: 'bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-panel)]',
  success: 'bg-[var(--color-success)] text-[var(--color-bg)] hover:brightness-110',
  danger: 'bg-[var(--color-danger)] text-[var(--color-bg)] hover:brightness-110',
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40',
        size === 'md' ? 'h-11 px-5 text-xs' : 'h-9 px-4 text-[11px]',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
