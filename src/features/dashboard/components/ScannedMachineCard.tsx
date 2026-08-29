import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import type { MaintenanceItem } from '@/features/machine/types';
import { getCondition } from '@/features/machine/utils/machineCondition';
import { MaintenanceTypeText } from '@/features/machine/components/MaintenanceTypeText';
import { formatUpdateTime } from '@/shared/utils/formatTime';
import { PillButton } from '@/shared/components/PillButton';

type ScannedMachineCardProps = {
  workOrder: MaintenanceItem;
  onOpenData: () => void;
};

export function ScannedMachineCard({ workOrder, onOpenData }: ScannedMachineCardProps) {
  const ahs = workOrder.ahs ?? 0;
  const conditionColor = getCondition(ahs).color;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <FontAwesome6 name="clock" iconStyle="regular" size={24} color={conditionColor} />
        <View style={styles.textGroup}>
          <Text style={styles.name} numberOfLines={1}>
            {workOrder.machineName}
          </Text>
          <View style={styles.metaRow}>
            <MaintenanceTypeText
              maintenanceType={workOrder.maintenanceType}
              prefix="Kategori: "
              style={styles.detail}
            />
            <Text style={[styles.condition, { color: conditionColor }]}>AHS {ahs}%</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.detail} numberOfLines={1}>
              Lokasi: {workOrder.location}
            </Text>
            <Text style={styles.detail}>{formatUpdateTime(workOrder.createdAt)}</Text>
          </View>
        </View>
      </View>
      <PillButton label="Buka data mesin" onPress={onOpenData} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textGroup: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  condition: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detail: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: 'normal',
    color: '#000',
  },
});
