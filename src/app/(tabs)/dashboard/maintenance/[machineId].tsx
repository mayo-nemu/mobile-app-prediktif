import { useLocalSearchParams } from 'expo-router';
import { MaintenanceScreen } from '@/features/maintenance/screens/MaintenanceScreen';

export default function Maintenance() {
  const { machineId } = useLocalSearchParams<{ machineId: string }>();
  return <MaintenanceScreen machineId={Number(machineId)} />;
}
