import { StyleSheet, Text, View } from 'react-native';
import {
  getCondition,
  type ConditionCounts,
  type ConditionLevel,
} from '@/features/machine/utils/machineCondition';

// English labels here match the design; getConditionLabel elsewhere is
// Indonesian (Kritis/Waspada/...) for the machine-detail health badge.
const SUMMARY_ORDER: { level: ConditionLevel; label: string }[] = [
  { level: 'critical', label: 'Critical' },
  { level: 'major', label: 'Major' },
  { level: 'minor', label: 'Minor' },
  { level: 'routine', label: 'Routine' },
];

type ConditionSummaryProps = {
  counts: ConditionCounts;
};

export function ConditionSummary({ counts }: ConditionSummaryProps) {
  return (
    <View style={styles.row}>
      {SUMMARY_ORDER.map(({ level, label }) => {
        const { color, background } = getCondition(level);
        return (
          <View key={level} style={[styles.box, { backgroundColor: background, borderColor: color }]}>
            <Text style={[styles.count, { color }]}>{counts[level]}</Text>
            <Text style={styles.label}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 21,
  },
  box: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  count: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#000',
  },
});
