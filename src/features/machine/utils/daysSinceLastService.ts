import type { CompletedMaintenanceItem } from '../types';

// "Service" events (event === 'Service', event_id 1 on the backend) mark a
// preventive maintenance visit. Returns days since the most recently *completed*
// one, or null if the machine has no closed service history on record yet.
export function daysSinceLastService(history: CompletedMaintenanceItem[]): number | null {
  const serviceTimestamps = history
    .filter((item) => item.event === 'Service')
    .map((item) => new Date(item.lastUpdate).getTime())
    // um.last_update can be unset, coming back as "0001-01-01T00:00:00" - ignore those.
    .filter((time) => Number.isFinite(time) && time > 0);

  if (serviceTimestamps.length === 0) {
    return null;
  }

  const mostRecent = Math.max(...serviceTimestamps);
  const diffMs = Date.now() - mostRecent;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
