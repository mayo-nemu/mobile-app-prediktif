export type Machine = {
  id: number;
  machineName: string;
  location: string;
  productionYear: number;
  createdAt: string;
};

// Mirrors smart_table's MachineDetail (GET /api/machine/details) - the AHS score,
// status, and timestamps used to render the dashboard live come from here, not
// from the plain machine list.
export type MachineDetail = {
  id: number;
  machineId: number;
  machineName: string;
  location: string;
  productionYear: number | null;
  operationHours: number;
  downtimeHours: number;
  ahs: number | null;
  statusId: number;
  statusName: string;
  lastUpdate: string;
};

// Mirrors smart_table's MachineHistoryItem (GET /api/machine/history/{machineId}) -
// every undermaintenance record for a machine, active or completed.
export type MachineHistoryItem = {
  id: number;
  machineId: number;
  machineName: string;
  maintenance: boolean;
  createdAt: string;
  eventId: number | null;
  event: string | null;
  maintenanceType: string | null;
  actionId: number | null;
  actionBy: string | null;
  actionTaken: string | null;
  actionCreatedAt: string | null;
};

