import { apiRequest } from '../../../shared/api/apiClient';
import { getMachineApiUrl } from '../../../shared/api/env';
import type { Machine, MachineDetail, MachineHistoryItem } from '../types';

export function getMachines(): Promise<Machine[]> {
  return apiRequest<Machine[]>(getMachineApiUrl(), '/api/machine');
}

export function getMachineById(id: number): Promise<Machine> {
  return apiRequest<Machine>(getMachineApiUrl(), `/api/machine/${id}`);
}

export function getMachineDetails(): Promise<MachineDetail[]> {
  return apiRequest<MachineDetail[]>(getMachineApiUrl(), '/api/machine/details');
}

// There's no "get detail by machine id" endpoint - /api/machine/details/{id} filters by
// the detail row's own id, not the machine's id (see MachineRepository.GetMachineDetailByIdAsync).
// A QR code only encodes the machine id, so we fetch the full list and match client-side.
export async function getMachineDetailByMachineId(machineId: number): Promise<MachineDetail | undefined> {
  const details = await getMachineDetails();
  return details.find((detail) => detail.machineId === machineId);
}

export function getMachineHistory(machineId: number): Promise<MachineHistoryItem[]> {
  return apiRequest<MachineHistoryItem[]>(getMachineApiUrl(), `/api/machine/history/${machineId}`);
}
