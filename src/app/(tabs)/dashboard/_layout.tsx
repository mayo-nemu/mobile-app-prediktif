import { Stack } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="machine/[machineId]/index" options={{ presentation: 'modal' }} />
      <Stack.Screen name="maintenance/[machineId]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
