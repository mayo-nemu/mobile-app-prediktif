import type { MachineHistoryItem } from '../types';

// "Service" events (event === 'Service', event_id 1 on the backend) mark a
// preventive maintenance visit. Returns days since the most recent one, or
// null if the machine has no service history on record yet.
export function daysSinceLastService(history: MachineHistoryItem[]): number | null {
  const serviceTimestamps = history
    .filter((item) => item.event === 'Service')
    .map((item) => new Date(item.createdAt).getTime());

  if (serviceTimestamps.length === 0) {
    return null;
  }

  const mostRecent = Math.max(...serviceTimestamps);
  const diffMs = Date.now() - mostRecent;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
