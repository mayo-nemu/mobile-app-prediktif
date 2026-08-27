import { useCallback, useEffect, useState } from 'react';
import { getMachineDetails } from '../api/machinesApi';
import { ApiError } from '../../../shared/api/apiClient';
import type { MachineDetail } from '../types';

type UseMachineDetailsResult = {
  machines: MachineDetail[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
};

// Shared by DashboardScreen (top-5 most urgent) and SchedulesScreen (full list) -
// both need the same full fetch, just sliced/sorted differently client-side.
export function useMachineDetails(): UseMachineDetailsResult {
  const [machines, setMachines] = useState<MachineDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMachineDetails();
      setMachines(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat daftar mesin.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { machines, isLoading, error, reload: load };
}
