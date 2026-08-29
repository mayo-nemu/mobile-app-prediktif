import { Stack } from 'expo-router';
import { AuthProvider } from '@/features/auth/context/AuthContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        {/* Machine detail / assessment - presented over the tabs so the tab bar is hidden. */}
        <Stack.Screen name="machine/[machineId]/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="machine/[machineId]/report" options={{ presentation: 'modal' }} />
        <Stack.Screen name="maintenance/[machineId]" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
