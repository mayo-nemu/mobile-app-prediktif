import { useLocalSearchParams } from 'expo-router';
import { ReportScreen } from '@/features/machine/screens/ReportScreen';

export default function Report() {
  const { machineId } = useLocalSearchParams<{ machineId: string }>();
  return <ReportScreen machineId={Number(machineId)} />;
}
