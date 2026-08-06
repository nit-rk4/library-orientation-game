export function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp))
}

export function formatPoints(points: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(points)
}
