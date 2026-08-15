type ConditionLevel = 'critical' | 'major' | 'minor' | 'routine';

const CONDITION_COLORS: Record<ConditionLevel, string> = {
  critical: '#FF0A0A',
  major: '#E67E22',
  minor: '#FACC15',
  routine: '#22A06B',
};

export function getConditionColor(score: number): string {
  if (score <= 39) return CONDITION_COLORS.critical;
  if (score <= 59) return CONDITION_COLORS.major;
  if (score <= 79) return CONDITION_COLORS.minor;
  return CONDITION_COLORS.routine;
}
