import { cn } from '../../lib/cn'

export function DataTable({ columns, rows, renderActions, onRowClick }) {
  const hasActions = typeof renderActions === 'function'
  const isClickable = typeof onRowClick === 'function'

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_82%,var(--color-panel))] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
              >
                {column.label}
              </th>
            ))}
            {hasActions ? (
              <th
                scope="col"
                className="border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_82%,var(--color-panel))] px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
              >
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              tabIndex={isClickable ? 0 : -1}
              onClick={() => onRowClick?.(row)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onRowClick?.(row)
                }
              }}
              className={cn(
                'group outline-none transition-colors duration-200',
                isClickable ? 'cursor-pointer' : 'cursor-default',
                'hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)]',
                'focus-visible:bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)]',
              )}
            >
              {columns.map((column) => (
                <td
                  key={`${row.id}-${column.key}`}
                  className="border-b border-[color-mix(in_srgb,var(--color-border)_80%,transparent)] px-4 py-4 text-sm text-[var(--color-text)]"
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {hasActions ? <td className="border-b border-[color-mix(in_srgb,var(--color-border)_80%,transparent)] px-4 py-4 text-right">{renderActions?.(row)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
