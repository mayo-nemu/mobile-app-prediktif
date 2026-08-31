import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MaintenanceItem } from '@/features/machine/types';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { getCondition } from '@/features/machine/utils/machineCondition';
import { MaintenanceTypeText } from '@/features/machine/components/MaintenanceTypeText';
import { formatUpdateTime } from '@/shared/utils/formatTime';

type MachineCardProps = {
  machine: MaintenanceItem;
  onPress: () => void;
};

export const MachineCard = memo(function MachineCard({ machine, onPress }: MachineCardProps) {
  const ahs = machine.ahs ?? 0;
  const conditionColor = getCondition(ahs).color;

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.iconGroup}>
        <FontAwesome6 name="clock" iconStyle="regular" size={24} color={conditionColor} />
        <View style={styles.mainText}>
          <Text style={styles.name} numberOfLines={1}>
            {machine.machineName}
          </Text>
          <MaintenanceTypeText maintenanceType={machine.maintenanceType} style={styles.detail} />
        </View>
      </View>
      <View style={styles.metaText}>
        <Text style={[styles.condition, { color: conditionColor }]}>AHS {ahs}%</Text>
        <Text style={styles.detail}>{formatUpdateTime(machine.createdAt)}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 21,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    elevation: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  iconGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mainText: {
    flex: 1,
    gap: 4,
  },
  metaText: {
    alignItems: 'flex-end',
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#000',
  },
});
