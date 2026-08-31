import { useLocalSearchParams } from 'expo-router';
import { MachineDetailScreen } from '@/features/machine/screens/MachineDetailScreen';

// Reached from the QR scan flow - the technician is at the machine, so the
// assessment action is available here (unlike the read-only dashboard route).
export default function Maintenance() {
  const { machineId } = useLocalSearchParams<{ machineId: string }>();
  return <MachineDetailScreen machineId={Number(machineId)} canFillAssessment />;
}
