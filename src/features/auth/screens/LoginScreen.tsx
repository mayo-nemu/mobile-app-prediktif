import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FormField } from '../components/FormField';
import { PillButton } from '@/shared/components/PillButton';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password) {
      setError('Username dan kata sandi wajib diisi.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login({ name: username.trim(), password });
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selamat Datang!</Text>
        <Text style={styles.subtitle}>Masuk ke Akun Anda</Text>
      </View>
      <FormField label="Username" value={username} onChangeText={setUsername} />
      <FormField label="Kata Sandi" value={password} onChangeText={setPassword} secureTextEntry />
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.buttonWrapper}>
        {isSubmitting ? (
          <ActivityIndicator color="#1E8EF2" />
        ) : (
          <PillButton label="Masuk" onPress={handleSubmit} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 96,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  error: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 8,
  },
  buttonWrapper: {
    marginTop: 24,
    alignItems: 'center',
  },
});
