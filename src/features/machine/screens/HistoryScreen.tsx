import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { ApiError } from '@/shared/api/apiClient';
import { getCompletedMaintenanceHistory } from '../api/machinesApi';
import type { CompletedMaintenanceItem } from '../types';
import { ActivityListItem } from '../components/ActivityListItem';

type HistoryScreenProps = {
  machineDetailId: number;
};

export function HistoryScreen({ machineDetailId }: HistoryScreenProps) {
  const router = useRouter();
  const [history, setHistory] = useState<CompletedMaintenanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setHistory(await getCompletedMaintenanceHistory(machineDetailId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat riwayat aktivitas.');
    } finally {
      setIsLoading(false);
    }
  }, [machineDetailId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome6 name="chevron-left" iconStyle="solid" size={20} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Riwayat aktivitas</Text>
      </View>

      <View style={styles.content}>
        {isLoading && <ActivityIndicator style={styles.stateBox} color="#1E8EF2" />}

        {!isLoading && error && (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={load}>
              <Text style={styles.link}>Coba lagi</Text>
            </Pressable>
          </View>
        )}

        {!isLoading && !error && history.length === 0 && (
          <View style={styles.stateBox}>
            <Text style={styles.detail}>Belum ada riwayat aktivitas untuk mesin ini.</Text>
          </View>
        )}

        {!isLoading && !error && history.length > 0 && (
          <FlatList
            data={history}
            keyExtractor={(activity) => activity.id.toString()}
            renderItem={({ item }) => <ActivityListItem activity={item} />}
            onRefresh={load}
            refreshing={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 21,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 21,
  },
  stateBox: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8EF2',
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
});
