import { useLocalSearchParams } from 'expo-router';
import { HistoryScreen } from '@/features/machine/screens/HistoryScreen';

export default function History() {
  const { machineDetailId } = useLocalSearchParams<{ machineDetailId: string }>();
  return <HistoryScreen machineDetailId={Number(machineDetailId)} />;
}
