export function getCongestionColor(level: number): string {
  if (level <= 25) return '#4caf50';
  if (level <= 50) return '#ffeb3b';
  if (level <= 75) return '#ff9800';
  return '#f44336';
}

export function getCongestionPane(level: number): string {
  if (level <= 25) return 'segments-green';
  if (level <= 50) return 'segments-yellow';
  if (level <= 75) return 'segments-orange';
  return 'segments-red';
}

export function getCongestionLabel(level: number): string {
  if (level <= 25) return 'Free Flow';
  if (level <= 50) return 'Moderate';
  if (level <= 75) return 'Slow';
  return 'Stopped';
}
