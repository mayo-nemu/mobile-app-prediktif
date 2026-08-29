import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { PillButton } from '@/shared/components/PillButton';
import { ApiError } from '@/shared/api/apiClient';
import { useAuth } from '@/features/auth/context/AuthContext';
import { completeWorkOrder, getMachinePrediction, getUnderMaintenanceById } from '../api/machinesApi';
import { statusIdFromName } from '../utils/machineCondition';
import { formatSecondsDuration } from '@/shared/utils/formatTime';
import type { MaintenanceDetail } from '../types';
import { AssessmentField } from '../components/AssessmentField';

type ReportScreenProps = {
  machineId: number;
  workOrderId: number;
};

function daysLabel(value: number | null): string {
  return value !== null ? `${value} hari` : '-';
}

export function ReportScreen({ workOrderId }: ReportScreenProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [workOrder, setWorkOrder] = useState<MaintenanceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notes, setNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadWorkOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setWorkOrder(await getUnderMaintenanceById(workOrderId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data mesin.');
    } finally {
      setIsLoading(false);
    }
  }, [workOrderId]);

  useEffect(() => {
    loadWorkOrder();
  }, [loadWorkOrder]);

  const handleSubmit = async () => {
    const action = notes.trim();
    if (!action) {
      setSubmitError('Catatan teknisi wajib diisi.');
      return;
    }
    if (!user) {
      setSubmitError('Sesi pengguna tidak ditemukan. Silakan login kembali.');
      return;
    }
    if (!workOrder) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      // Ask the AI model to re-score the machine post-repair. If it can't (no prior
      // completed history to learn from -> 404, or the ML service is down -> 500),
      // carry the machine's current health forward unchanged rather than blocking
      // the technician from closing the work order.
      let ahs = workOrder.ahs ?? 0;
      let statusId = statusIdFromName(workOrder.statusName);
      let scoredByAi = false;
      if (workOrder.machineDetailId !== null) {
        try {
          const prediction = await getMachinePrediction(workOrder.machineDetailId);
          ahs = Math.round(prediction.healthScore);
          statusId = statusIdFromName(prediction.severity);
          scoredByAi = true;
        } catch {
          // fall back to the current values set above
        }
      }

      await completeWorkOrder(workOrderId, { userId: user.userId, name: user.name, action, ahs, statusId });
      Alert.alert(
        'Penilaian terkirim',
        scoredByAi
          ? `Maintenance selesai. Skor kesehatan aset diperbarui menjadi ${ahs}%.`
          : 'Maintenance mesin ditandai selesai.',
        [{ text: 'OK', onPress: () => router.dismissAll() }],
      );
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Gagal mengirim penilaian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome6 name="chevron-left" iconStyle="solid" size={20} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Penilaian kondisi Mesin</Text>
      </View>

      {isLoading && <ActivityIndicator style={styles.stateBox} color="#1E8EF2" />}

      {!isLoading && error && (
        <View style={styles.stateBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={loadWorkOrder}>
            <Text style={styles.link}>Coba lagi</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !error && workOrder && (
        <ScrollView contentContainerStyle={styles.content}>
          <AssessmentField
            label="Tahun Produksi"
            editable={false}
            value={workOrder.productionYear?.toString() ?? '-'}
          />
          <AssessmentField
            label="Nilai AHS Score"
            editable={false}
            value={workOrder.ahs !== null ? `${workOrder.ahs}%` : '-'}
          />
          <AssessmentField
            label="Jam Operasional (HH:MM:SS)"
            editable={false}
            value={formatSecondsDuration(workOrder.operationHours)}
          />
          <AssessmentField
            label="Jam Downtime (HH:MM:SS)"
            editable={false}
            value={formatSecondsDuration(workOrder.downtimeHours)}
          />
          <AssessmentField
            label="Hari Terakhir Servis"
            editable={false}
            value={daysLabel(workOrder.daysSinceLastService)}
          />
          <AssessmentField
            label="Rentang Dari Terakhir Failure"
            editable={false}
            value={daysLabel(workOrder.daysBetweenEvents)}
          />
          <AssessmentField
            label="Kategori Kejadian"
            editable={false}
            value={workOrder.maintenanceType ?? '-'}
          />
          <AssessmentField label="Kejadian" editable={false} value={workOrder.event ?? '-'} />
          <AssessmentField
            label="Catatan Teknisi *"
            value={notes}
            onChangeText={setNotes}
            placeholder="Tambahkan catatan..."
            multiline
          />
          {submitError && <Text style={styles.errorText}>{submitError}</Text>}
          <PillButton
            label={isSubmitting ? 'Mengirim...' : 'Kirim penilaian'}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </ScrollView>
      )}
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
  stateBox: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  link: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8EF2',
  },
  content: {
    paddingHorizontal: 21,
    paddingBottom: 40,
  },
});
