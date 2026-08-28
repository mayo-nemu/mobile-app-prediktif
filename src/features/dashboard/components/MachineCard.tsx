import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MachineDetail } from '@/features/machine/types';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { getConditionColor } from '@/features/machine/utils/machineCondition';
import { formatUpdateTime } from '@/shared/utils/formatTime';

type MachineCardProps = {
  machine: MachineDetail;
  onPress: () => void;
};

export const MachineCard = memo(function MachineCard({ machine, onPress }: MachineCardProps) {
  const ahs = machine.ahs ?? 0;
  const conditionColor = getConditionColor(ahs);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.iconGroup}>
        <FontAwesome6 name="clock" iconStyle="regular" size={24} color={conditionColor} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{machine.machineName}</Text>
          <Text style={styles.detail}>{machine.location}</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.condition, { color: conditionColor }]}>AHS {ahs}%</Text>
        <Text style={styles.detail}>{formatUpdateTime(machine.lastUpdate)}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 21,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    elevation: 1
  },
  pressed: {
    opacity: 0.7,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  condition: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#000',
  },
});
