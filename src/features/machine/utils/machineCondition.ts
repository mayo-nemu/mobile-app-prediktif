export type ConditionLevel = 'critical' | 'major' | 'minor' | 'routine';

const CONDITION_COLORS: Record<ConditionLevel, string> = {
  critical: '#FF0A0A',
  major: '#E67E22',
  minor: '#FACC15',
  routine: '#22A06B',
};

const CONDITION_LABELS: Record<ConditionLevel, string> = {
  critical: 'Kritis',
  major: 'Waspada',
  minor: 'Perhatian',
  routine: 'Sehat',
};

// Pale tints of CONDITION_COLORS, for card backgrounds behind the solid text/badge color.
const CONDITION_BACKGROUNDS: Record<ConditionLevel, string> = {
  critical: '#FDECEC',
  major: '#FCF1E6',
  minor: '#FEF9E7',
  routine: '#E9F7F0',
};

export function getConditionLevel(score: number): ConditionLevel {
  if (score <= 39) return 'critical';
  if (score <= 59) return 'major';
  if (score <= 79) return 'minor';
  return 'routine';
}

export function getConditionColor(score: number): string {
  return CONDITION_COLORS[getConditionLevel(score)];
}

export function getConditionLabel(score: number): string {
  return CONDITION_LABELS[getConditionLevel(score)];
}

export function getConditionBackground(score: number): string {
  return CONDITION_BACKGROUNDS[getConditionLevel(score)];
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

export function getConditionColorForLevel(level: ConditionLevel): string {
  return CONDITION_COLORS[level];
}

export function getConditionBackgroundForLevel(level: ConditionLevel): string {
  return CONDITION_BACKGROUNDS[level];
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
