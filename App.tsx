import { StatusBar } from 'expo-status-bar';
import { DashboardScreen } from './lib/features/dashboard/screens/DashboardScreen';

export default function App() {
  return (
    <>
      <DashboardScreen />
      <StatusBar style="auto" />
    </>
  );
}
