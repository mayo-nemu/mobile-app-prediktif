import { ApiError, apiRequest } from '@/shared/api/apiClient';
import { getMachineApiUrl } from '@/shared/api/env';
import type {
  CompletedMaintenanceItem,
  CompleteWorkOrderRequest,
  MachinePrediction,
  MaintenanceDetail,
  MaintenanceItem,
} from '../types';

// Open work orders only (undermaintenance.maintenance = 1), each already joined with
// its machine_detail / status / event on the backend - no follow-up detail fetch needed.
export function getMachinesUnderMaintenance(): Promise<MaintenanceItem[]> {
  return apiRequest<MaintenanceItem[]>(getMachineApiUrl(), '/api/machine/under-maintenance');
}

// Full single-work-order record, including the daysSinceLastService / daysBetweenEvents
// figures that only this endpoint computes. `id` is the undermaintenance row id.
export function getUnderMaintenanceById(id: number): Promise<MaintenanceDetail> {
  return apiRequest<MaintenanceDetail>(getMachineApiUrl(), `/api/machine/under-maintenance/${id}`);
}

// The QR code / dashboard only give us a machine id; the work-order id we need for the
// detail + complete calls lives on the under-maintenance list. Assumes at most one open
// work order per machine.
export async function getOpenWorkOrderByMachineId(
  machineId: number,
): Promise<MaintenanceItem | undefined> {
  const openWorkOrders = await getMachinesUnderMaintenance();
  return openWorkOrders.find((workOrder) => workOrder.machineId === machineId);
}

// AI health score for a machine detail. The backend returns 404 when the machine has
// no completed-maintenance history to score from (e.g. its first-ever maintenance),
// and 500 when the ML service itself is unreachable - callers decide how to fall back.
export function getMachinePrediction(machineDetailId: number): Promise<MachinePrediction> {
  return apiRequest<MachinePrediction>(
    getMachineApiUrl(),
    `/api/machine/predict/${machineDetailId}`,
  );
}

export function completeWorkOrder(
  id: number,
  body: CompleteWorkOrderRequest,
): Promise<unknown> {
  return apiRequest(getMachineApiUrl(), `/api/machine/under-maintenance/complete/${id}`, {
    method: 'PUT',
    body,
  });
}

// Closed work orders (maintenance = 0, action_id set) for a machine_detail, newest first.
// The backend returns 404 rather than an empty array when a machine has no such history -
// treat that as "no history yet", not an error.
export async function getCompletedMaintenanceHistory(
  machineDetailId: number,
): Promise<CompletedMaintenanceItem[]> {
  try {
    return await apiRequest<CompletedMaintenanceItem[]>(
      getMachineApiUrl(),
      `/api/machine/completed-maintenance/machine-detail/history/${machineDetailId}`,
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return [];
    }
    throw err;
  }
}
