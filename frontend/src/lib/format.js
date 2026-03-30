export function currency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function compactId(value) {
  if (!value) return 'N/A'
  const input = String(value)
  if (input.length <= 12) return input
  return `${input.slice(0, 6)}...${input.slice(-4)}`
}

export function titleCase(value) {
  if (!value) return ''
  return String(value)
    .split('_')
    .join(' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
}
