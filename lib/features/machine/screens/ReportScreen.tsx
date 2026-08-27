import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { PillButton } from '../../../shared/components/PillButton';
import { ApiError } from '../../../shared/api/apiClient';
import { getMachineDetailByMachineId } from '../../dashboard/api/machinesApi';
import { formatHoursDuration } from '../../dashboard/utils/formatTime';
import type { MachineDetail } from '../../dashboard/types';
import { AssessmentField } from '../components/AssessmentField';

type ReportScreenProps = {
  machineId: number;
};

export function ReportScreen({ machineId }: ReportScreenProps) {
  const router = useRouter();
  const [machine, setMachine] = useState<MachineDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [productionYear, setProductionYear] = useState('');
  const [ahsScore, setAhsScore] = useState('');
  const [operationHours, setOperationHours] = useState('');
  const [downtimeHours, setDowntimeHours] = useState('');
  const [daysSinceService, setDaysSinceService] = useState('');
  const [daysSinceFailure, setDaysSinceFailure] = useState('');
  const [category, setCategory] = useState('');
  const [event, setEvent] = useState('');
  const [notes, setNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadMachine = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMachineDetailByMachineId(machineId);
      if (!result) {
        setError(`Mesin dengan ID ${machineId} tidak ditemukan.`);
        return;
      }
      setMachine(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat data mesin.');
    } finally {
      setIsLoading(false);
    }
  }, [machineId]);

  useEffect(() => {
    loadMachine();
  }, [loadMachine]);

  const handleSubmit = () => {
    if (!notes.trim()) {
      setSubmitError('Catatan teknisi wajib diisi.');
      return;
    }
    setSubmitError(null);

    // TODO: POST /api/machine/under-maintenance only accepts
    // { machineId, machineName, maintenance, eventId } - there's no endpoint
    // exposing the event_maintenance lookup table, so "Kategori Kejadian" /
    // "Kejadian" can't be turned into a real eventId yet, and there's no
    // field anywhere to store "Catatan Teknisi". Wire this up for real once
    // both exist on the backend.
    console.log('Submit penilaian', {
      machineId,
      productionYear,
      ahsScore,
      operationHours,
      downtimeHours,
      daysSinceService,
      daysSinceFailure,
      category,
      event,
      notes,
    });
    router.back();
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
          <Pressable onPress={loadMachine}>
            <Text style={styles.link}>Coba lagi</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !error && machine && (
        <ScrollView contentContainerStyle={styles.content}>
          <AssessmentField
            label="Tahun Produksi"
            value={productionYear}
            onChangeText={setProductionYear}
            placeholder={machine.productionYear?.toString() ?? '-'}
            keyboardType="number-pad"
          />
          <AssessmentField
            label="Nilai AHS Score"
            value={ahsScore}
            onChangeText={setAhsScore}
            placeholder={`${machine.ahs ?? 0}%`}
            keyboardType="number-pad"
          />
          <AssessmentField
            label="Jam Operasional (HH:MM:SS)"
            value={operationHours}
            onChangeText={setOperationHours}
            placeholder={formatHoursDuration(machine.operationHours)}
          />
          <AssessmentField
            label="Jam Downtime (HH:MM:SS)"
            value={downtimeHours}
            onChangeText={setDowntimeHours}
            placeholder={formatHoursDuration(machine.downtimeHours)}
          />
          <AssessmentField
            label="Hari Terakhir Servis"
            value={daysSinceService}
            onChangeText={setDaysSinceService}
            placeholder="-"
            keyboardType="number-pad"
          />
          <AssessmentField
            label="Rentang Dari Terakhir Failure"
            value={daysSinceFailure}
            onChangeText={setDaysSinceFailure}
            placeholder="-"
            keyboardType="number-pad"
          />
          <AssessmentField
            label="Kategori Kejadian"
            value={category}
            onChangeText={setCategory}
            placeholder="Corrective Maintenance"
          />
          <AssessmentField label="Kejadian" value={event} onChangeText={setEvent} placeholder="Failure" />
          <AssessmentField
            label="Catatan Teknisi *"
            value={notes}
            onChangeText={setNotes}
            placeholder="Tambahkan catatan..."
            multiline
          />
          {submitError && <Text style={styles.errorText}>{submitError}</Text>}
          <PillButton label="Kirim penilaian" onPress={handleSubmit} />
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
