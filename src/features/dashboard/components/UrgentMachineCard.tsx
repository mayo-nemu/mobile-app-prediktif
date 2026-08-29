import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import type { MaintenanceItem } from '@/features/machine/types';
import { MaintenanceTypeText } from '@/features/machine/components/MaintenanceTypeText';

type UrgentMachineCardProps = {
  machine: MaintenanceItem;
  category: string | null;
  onPress: () => void;
};

export function UrgentMachineCard({ machine, category, onPress }: UrgentMachineCardProps) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <FontAwesome6 name="triangle-exclamation" iconStyle="solid" size={22} color="#FF0A0A" />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{machine.machineName}</Text>
        {category && (
          <MaintenanceTypeText maintenanceType={category} prefix="Kategori: " style={styles.detail} />
        )}
        <Text style={styles.detail}>Lokasi: {machine.location}</Text>
      </View>
      <FontAwesome6 name="chevron-right" iconStyle="solid" size={16} color="#FF0A0A" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    borderColor: '#FF0A0A',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 21,
  },
  pressed: {
    opacity: 0.8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FF0A0A',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#FF0A0A',
  },
});
