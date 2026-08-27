import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../auth/context/AuthContext';
import { PillButton } from '../../../shared/components/PillButton';
import type { AuthenticatedUser } from '../../auth/api/authApi';

function getRoleLabel(user: AuthenticatedUser): string {
  if (user.is_Engineer) return 'Engineer';
  if (user.is_Technician) return 'Teknisi';
  if (user.is_Operator) return 'Operator';
  return '-';
}

export function ProfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      {user && (
        <View style={styles.card}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{getRoleLabel(user)}</Text>
        </View>
      )}
      <View style={styles.buttonWrapper}>
        <PillButton label="Keluar" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 84,
    paddingHorizontal: 21,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  card: {
    marginBottom: 32,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonWrapper: {
    marginTop: 'auto',
    marginBottom: 24,
    alignItems: 'center',
  },
});
