import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import type { MachineDetail } from '../types';
import { getConditionColor } from '../utils/machineCondition';
import { formatUpdateTime } from '../utils/formatTime';

type ScannedMachineCardProps = {
  machine: MachineDetail;
};

export function ScannedMachineCard({ machine }: ScannedMachineCardProps) {
  const ahs = machine.ahs ?? 0;
  const conditionColor = getConditionColor(ahs);

  return (
    <View style={styles.card}>
      <View style={styles.iconGroup}>
        <FontAwesome6 name="clock" iconStyle="regular" size={24} color={conditionColor} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{machine.machineName}</Text>
          <Text style={styles.detail}>Status: {machine.statusName}</Text>
          <Text style={styles.detail}>Lokasi: {machine.location}</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.condition, { color: conditionColor }]}>AHS {ahs}%</Text>
        <Text style={styles.detail}>{formatUpdateTime(machine.lastUpdate)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexShrink: 1,
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
