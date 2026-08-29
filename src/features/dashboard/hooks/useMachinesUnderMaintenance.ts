import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getMachinesUnderMaintenance } from '@/features/machine/api/machinesApi';
import { ApiError } from '@/shared/api/apiClient';
import type { MaintenanceItem } from '@/features/machine/types';

type UseMachinesUnderMaintenanceResult = {
  machines: MaintenanceItem[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
};

// Shared by DashboardScreen (top-5 most urgent) and SchedulesScreen (full list) -
// both need the same full fetch of open work orders, just sliced/sorted differently
// client-side.
export function useMachinesUnderMaintenance(): UseMachinesUnderMaintenanceResult {
  const [machines, setMachines] = useState<MaintenanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMachinesUnderMaintenance();
      setMachines(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat daftar mesin.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch on focus too, so a work order closed on the maintenance/report flow
  // drops off the list when the user navigates back.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { machines, isLoading, error, reload: load };
}
