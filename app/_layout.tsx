import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/features/auth/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
