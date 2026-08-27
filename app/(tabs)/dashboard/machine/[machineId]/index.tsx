import { useLocalSearchParams } from 'expo-router';
import { MachineDetailScreen } from '../../../../../lib/features/machine/screens/MachineDetailScreen';

export default function Machine() {
  const { machineId } = useLocalSearchParams<{ machineId: string }>();
  return <MachineDetailScreen machineId={Number(machineId)} />;
}
