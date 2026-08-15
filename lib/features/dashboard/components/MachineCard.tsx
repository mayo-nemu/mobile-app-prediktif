import { memo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { Machine } from '../types';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { getConditionColor } from '../utils/machineCondition';

type MachineCardProps = {
  machine: Machine;
};

export const MachineCard = memo(function MachineCard({ machine }: MachineCardProps) {
  const conditionColor = getConditionColor(27);

  return (
    <View style={styles.card}>
      <View style={styles.iconGroup}>
        <FontAwesome6 name="clock" iconStyle="regular" size={24} color={conditionColor} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{machine.machineName}</Text>
          <Text style={styles.detail}>{machine.location}</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.condition, { color: conditionColor }]}>AHS 27%</Text>
        <Text style={styles.detail}>08.00 WIB</Text>
      </View>
    </View>
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
