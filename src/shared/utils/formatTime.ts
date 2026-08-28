export function formatUpdateTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}.${minutes} WIB`;
}

// Manual month abbreviations rather than Intl/toLocaleDateString - Hermes' ICU
// data availability varies by build, so don't rely on locale-aware formatting.
const MONTH_ABBREVIATIONS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export function formatActivityDate(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getDate()} ${MONTH_ABBREVIATIONS[date.getMonth()]}`;
}

// Converts an hours count (e.g. MachineDetail.operationHours/downtimeHours,
// which may be fractional) into an "HH:MM:SS" duration string.
export function formatHoursDuration(totalHours: number): string {
  const totalSeconds = Math.max(0, Math.round(totalHours * 3600));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
