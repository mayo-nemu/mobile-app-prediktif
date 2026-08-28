import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { ApiError } from '@/shared/api/apiClient';
import { getMachineDetailByMachineId, getMachineHistory } from '../api/machinesApi';
import {
  getConditionBackground,
  getConditionColor,
  getConditionLabel,
} from '../utils/machineCondition';
import { formatHoursDuration } from '@/shared/utils/formatTime';
import { daysSinceLastService } from '../utils/daysSinceLastService';
import type { MachineDetail, MachineHistoryItem } from '../types';
import { ActivityListItem } from '../components/ActivityListItem';

type MachineDetailScreenProps = {
  machineId: number;
};

export function MachineDetailScreen({ machineId }: MachineDetailScreenProps) {
  const router = useRouter();
  const [machine, setMachine] = useState<MachineDetail | null>(null);
  const [history, setHistory] = useState<MachineHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMachine = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [machineResult, historyResult] = await Promise.all([
        getMachineDetailByMachineId(machineId),
        getMachineHistory(machineId),
      ]);

      if (!machineResult) {
        setError(`Mesin dengan ID ${machineId} tidak ditemukan.`);
        return;
      }
      setMachine(machineResult);
      setHistory(historyResult);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data mesin.');
    } finally {
      setIsLoading(false);
    }
  }, [machineId]);

  useEffect(() => {
    loadMachine();
  }, [loadMachine]);

  const handleSeeAllActivity = () => {
    // The full history is already shown inline below (no server-side limit
    // applied) - this has nowhere further to go until a dedicated activity-log
    // screen exists (e.g. with type/date filtering for machines with long histories).
    console.log('Lihat semua aktivitas tapped for machine', machineId);
  };

  const daysSince = daysSinceLastService(history);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome6 name="xmark" iconStyle="solid" size={20} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>{machine?.machineName ?? '...'}</Text>
      </View>

      {isLoading && <ActivityIndicator style={styles.stateBox} color="#1E8EF2" />}

      {!isLoading && error && (
        <View style={styles.stateBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={loadMachine}>
            <Text style={styles.link}>Coba lagi</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !error && machine && (
        <View style={styles.content}>
          <HealthScoreCard ahs={machine.ahs ?? 0} />

          <View style={styles.statGrid}>
            <StatBox label="Tahun produksi" value={machine.productionYear?.toString() ?? '-'} />
            <StatBox label="Jam operasi" value={formatHoursDuration(machine.operationHours)} />
            <StatBox label="Jam downtime" value={formatHoursDuration(machine.downtimeHours)} />
            <StatBox label="Hari sejak servis" value={daysSince !== null ? daysSince.toString() : '-'} />
          </View>

          <View style={styles.activityHeader}>
            <Text style={styles.activityHeaderText}>Riwayat aktivitas</Text>
            <Pressable onPress={handleSeeAllActivity}>
              <Text style={styles.link}>Semua</Text>
            </Pressable>
          </View>

          {history.length === 0 ? (
            <Text style={styles.detail}>Belum ada riwayat aktivitas untuk mesin ini.</Text>
          ) : (
            history.map((activity) => <ActivityListItem key={activity.id} activity={activity} />)
          )}
        </View>
      )}
    </View>
  );
}

function HealthScoreCard({ ahs }: { ahs: number }) {
  const color = getConditionColor(ahs);

  return (
    <View style={[styles.healthCard, { backgroundColor: getConditionBackground(ahs), borderColor: color }]}>
      <Text style={[styles.healthLabel, { color }]}>Skor kesehatan aset</Text>
      <Text style={[styles.healthScore, { color }]}>{ahs}%</Text>
      <View style={[styles.healthBadge, { backgroundColor: color }]}>
        <Text style={styles.healthBadgeText}>{getConditionLabel(ahs)}</Text>
      </View>
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
    fontSize: 20,
    fontWeight: '700',
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
    paddingHorizontal: 32,
  },
  link: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8EF2',
  },
  content: {
    paddingHorizontal: 21,
  },
  healthCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  healthLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  healthScore: {
    fontSize: 40,
    fontWeight: '800',
  },
  healthBadge: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  healthBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  activityHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
});
