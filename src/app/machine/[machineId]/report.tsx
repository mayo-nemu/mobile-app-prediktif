import { useLocalSearchParams } from 'expo-router';
import { ReportScreen } from '@/features/machine/screens/ReportScreen';

export default function Report() {
  const { machineId, workOrderId } = useLocalSearchParams<{ machineId: string; workOrderId: string }>();
  return <ReportScreen machineId={Number(machineId)} workOrderId={Number(workOrderId)} />;
}
