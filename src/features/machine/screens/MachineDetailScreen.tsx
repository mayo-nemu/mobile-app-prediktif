import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { PillButton } from '@/shared/components/PillButton';
import { ApiError } from '@/shared/api/apiClient';
import {
  getCompletedMaintenanceHistory,
  getOpenWorkOrderByMachineId,
  getUnderMaintenanceById,
} from '../api/machinesApi';
import { getCondition } from '../utils/machineCondition';
import { formatSecondsDuration } from '@/shared/utils/formatTime';
import type { CompletedMaintenanceItem, MaintenanceDetail } from '../types';
import { ActivityListItem } from '../components/ActivityListItem';

const ACTIVITY_LIMIT = 3;

type MachineDetailScreenProps = {
  machineId: number;
  // Shows the "Isi penilaian" action. Enabled only when the screen was reached by
  // scanning the machine's QR - the technician is physically at the machine and can
  // close out its work order. From the dashboard the screen is read-only.
  canFillAssessment?: boolean;
};

export function MachineDetailScreen({ machineId, canFillAssessment = false }: MachineDetailScreenProps) {
  const router = useRouter();
  const [workOrder, setWorkOrder] = useState<MaintenanceDetail | null>(null);
  const [history, setHistory] = useState<CompletedMaintenanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Both entry points (dashboard card, QR scan) come from an open work order.
      const openWorkOrder = await getOpenWorkOrderByMachineId(machineId);
      if (!openWorkOrder) {
        setError('Mesin ini tidak sedang dalam perbaikan.');
        return;
      }
      const detail = await getUnderMaintenanceById(openWorkOrder.id);
      const activity = detail.machineDetailId
        ? await getCompletedMaintenanceHistory(detail.machineDetailId)
        : [];
      setWorkOrder(detail);
      setHistory(activity);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data mesin.');
    } finally {
      setIsLoading(false);
    }
  }, [machineId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFillAssessment = () => {
    if (!workOrder) return;
    router.push({
      pathname: '/machine/[machineId]/report',
      params: { machineId: String(machineId), workOrderId: String(workOrder.id) },
    });
  };

  const handleSeeAllActivity = () => {
    if (workOrder?.machineDetailId == null) return;
    router.push({
      pathname: '/machine/[machineId]/history',
      params: { machineId: String(machineId), machineDetailId: String(workOrder.machineDetailId) },
    });
  };

  const ahs = workOrder?.ahs ?? 0;
  const { color: accent, background: tint, label: conditionLabel } = getCondition(ahs);

  const visibleHistory = history.slice(0, ACTIVITY_LIMIT);
  const hasMoreActivity = history.length > ACTIVITY_LIMIT;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome6 name="xmark" iconStyle="solid" size={20} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>{workOrder?.machineName ?? '...'}</Text>
      </View>

      {isLoading && <ActivityIndicator style={styles.stateBox} color="#1E8EF2" />}

      {!isLoading && error && (
        <View style={styles.stateBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={load}>
            <Text style={styles.link}>Coba lagi</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !error && workOrder && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.card, styles.healthCard, { backgroundColor: tint, borderColor: accent }]}>
            <Text style={[styles.healthLabel, { color: accent }]}>Skor kesehatan aset</Text>
            <Text style={[styles.healthScore, { color: accent }]}>{ahs}%</Text>
            <View style={[styles.healthBadge, { backgroundColor: accent }]}>
              <Text style={styles.healthBadgeText}>{conditionLabel}</Text>
            </View>
          </View>

          <View style={styles.statGrid}>
            <StatBox label="Tahun produksi" value={workOrder.productionYear?.toString() ?? '-'} tint={tint} accent={accent} />
            <StatBox label="Jam operasi" value={formatSecondsDuration(workOrder.operationHours)} tint={tint} accent={accent} />
            <StatBox label="Jam downtime" value={formatSecondsDuration(workOrder.downtimeHours)} tint={tint} accent={accent} />
            <StatBox
              label="Hari sejak servis"
              value={workOrder.daysSinceLastService !== null ? workOrder.daysSinceLastService.toString() : '-'}
              tint={tint}
              accent={accent}
            />
          </View>

          {canFillAssessment && <PillButton label="Isi penilaian" onPress={handleFillAssessment} />}

          <View style={styles.activityHeader}>
            <Text style={styles.activityHeaderText}>Riwayat aktivitas</Text>
            {hasMoreActivity && (
              <Pressable onPress={handleSeeAllActivity}>
                <Text style={styles.link}>Semua</Text>
              </Pressable>
            )}
          </View>

          {history.length === 0 ? (
            <Text style={styles.detail}>Belum ada riwayat aktivitas untuk mesin ini.</Text>
          ) : (
            visibleHistory.map((activity) => <ActivityListItem key={activity.id} activity={activity} />)
          )}
        </ScrollView>
      )}
    </View>
  );
}

function StatBox({
  label,
  value,
  tint,
  accent,
}: {
  label: string;
  value: string;
  tint: string;
  accent: string;
}) {
  return (
    <View style={[styles.card, styles.statBox, { backgroundColor: tint, borderColor: accent }]}>
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
    paddingBottom: 32,
  },
  // Shared shell for the health card and stat boxes - matches ConditionSummary:
  // 1px condition-coloured border over a pale tint of the same colour.
  card: {
    borderWidth: 1,
    borderRadius: 12,
  },
  healthCard: {
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
