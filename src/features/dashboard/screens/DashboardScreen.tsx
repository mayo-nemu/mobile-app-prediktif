import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MachineCard } from '../components/MachineCard';
import { ConditionSummary } from '../components/ConditionSummary';
import { UrgentMachineCard } from '../components/UrgentMachineCard';
import { SquareButton } from '@/shared/components/SquareButton';
import { useMachineDetails } from '../hooks/useMachineDetails';
import { sortByUrgency } from '../utils/sortByUrgency';
import { countByCondition, getConditionLevel } from '@/features/machine/utils/machineCondition';
import { getMachineHistory } from '@/features/machine/api/machinesApi';
import type { MachineDetail } from '@/features/machine/types';

const DASHBOARD_LIMIT = 5;

function DashboardHeader({ onSeeAll }: { onSeeAll: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Jadwal hari ini</Text>
      <Pressable onPress={onSeeAll}>
        <Text style={styles.link}>Lihat semua</Text>
      </Pressable>
    </View>
  );
}

export function DashboardScreen() {
  const router = useRouter();
  const { machines, isLoading, error, reload } = useMachineDetails();
  const topUrgent = sortByUrgency(machines).slice(0, DASHBOARD_LIMIT);
  const mostUrgent = topUrgent[0];
  const conditionCounts = countByCondition(machines);

  const [urgentCategory, setUrgentCategory] = useState<string | null>(null);

  // Only the single most urgent machine's category is needed here, so fetch
  // its history separately rather than pulling every machine's full history
  // up front just for one line of text.
  useEffect(() => {
    if (!mostUrgent) {
      setUrgentCategory(null);
      return;
    }
    let cancelled = false;
    getMachineHistory(mostUrgent.machineId)
      .then((history) => {
        if (!cancelled) setUrgentCategory(history[0]?.maintenanceType ?? null);
      })
      .catch(() => {
        if (!cancelled) setUrgentCategory(null);
      });
    return () => {
      cancelled = true;
    };
  }, [mostUrgent?.machineId]);

  const handleSeeAll = () => {
    router.push('/dashboard/schedules');
  };

  const handleOpenMachine = (machine: MachineDetail) => {
    router.push(`/dashboard/machine/${machine.machineId}`);
  };

  const isMostUrgentCritical =
    mostUrgent !== undefined && mostUrgent.ahs !== null && getConditionLevel(mostUrgent.ahs) === 'critical';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PrediktIF</Text>
      {!isLoading && !error && mostUrgent && isMostUrgentCritical && (
        <UrgentMachineCard
          machine={mostUrgent}
          category={urgentCategory}
          onPress={() => handleOpenMachine(mostUrgent)}
        />
      )}
      {!isLoading && !error && machines.length > 0 && <ConditionSummary counts={conditionCounts} />}
      <SquareButton
        label="Scan QR Mesin"
        icon={{ iconStyle: 'solid', name: 'qrcode' }}
        onPress={() => router.push('/dashboard/scan')}
      />
      <DashboardHeader onSeeAll={handleSeeAll} />
      {isLoading && <ActivityIndicator style={styles.stateBox} color="#1E8EF2" />}
      {!isLoading && error && (
        <View style={styles.stateBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={reload}>
            <Text style={styles.link}>Coba lagi</Text>
          </Pressable>
        </View>
      )}
      {!isLoading && !error && topUrgent.length === 0 && (
        <View style={styles.stateBox}>
          <Text style={styles.detail}>Belum ada mesin terdaftar.</Text>
        </View>
      )}
      {!isLoading && !error && topUrgent.length > 0 && (
        <FlatList
          data={topUrgent}
          keyExtractor={(machine) => machine.id.toString()}
          renderItem={({ item }) => (
            <MachineCard machine={item} onPress={() => handleOpenMachine(item)} />
          )}
          onRefresh={reload}
          refreshing={false}
        />
      )}
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
    marginBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 21,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  link: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8EF2',
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
  detail: {
    fontSize: 14,
    color: '#666',
  },
});
