export type ConditionLevel = 'critical' | 'major' | 'minor' | 'routine';

type Condition = {
  level: ConditionLevel;
  color: string; // solid - text, borders, badges
  background: string; // pale tint of `color` - card fills
  label: string; // Indonesian: Kritis / Waspada / Perhatian / Sehat
};

const CONDITIONS: Record<ConditionLevel, Omit<Condition, 'level'>> = {
  critical: { color: '#FF0A0A', background: '#FDECEC', label: 'Kritis' },
  major: { color: '#E67E22', background: '#FCF1E6', label: 'Waspada' },
  minor: { color: '#FACC15', background: '#FEF9E7', label: 'Perhatian' },
  routine: { color: '#22A06B', background: '#E9F7F0', label: 'Sehat' },
};

export function getConditionLevel(score: number): ConditionLevel {
  if (score <= 39) return 'critical';
  if (score <= 59) return 'major';
  if (score <= 79) return 'minor';
  return 'routine';
}

// Accepts an AHS score or a level directly, and returns the colour / tint / label
// for it. Use `.color` for text and borders, `.background` for card fills.
export function getCondition(scoreOrLevel: number | ConditionLevel): Condition {
  const level = typeof scoreOrLevel === 'number' ? getConditionLevel(scoreOrLevel) : scoreOrLevel;
  return { level, ...CONDITIONS[level] };
}

// machine_status seed data: 1 Critical, 2 Major, 3 Minor, 4 Routine. The under-maintenance
// endpoints only return status_name, so map back to the id when the API needs one.
const STATUS_NAME_TO_ID: Record<string, number> = {
  Critical: 1,
  Major: 2,
  Minor: 3,
  Routine: 4,
};

export function statusIdFromName(statusName: string): number {
  return STATUS_NAME_TO_ID[statusName] ?? 4;
}

export type ConditionCounts = Record<ConditionLevel, number>;

// Machines with no AHS score yet are excluded rather than bucketed as
// "critical" - missing data isn't the same as a bad score (see sortByUrgency).
export function countByCondition(machines: { ahs: number | null }[]): ConditionCounts {
  const counts: ConditionCounts = { critical: 0, major: 0, minor: 0, routine: 0 };
  for (const machine of machines) {
    if (machine.ahs === null) continue;
    counts[getConditionLevel(machine.ahs)] += 1;
  }
  return counts;
}
