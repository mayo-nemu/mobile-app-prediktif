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

// Mirrors smart_table's UnderMaintenance list row (GET /api/machine/under-maintenance) -
// one open work order (undermaintenance.maintenance = 1) joined with its machine_detail,
// status, and event_maintenance rows. `id` is the work-order id, NOT the machine id.
// The list SQL doesn't populate daysSinceLastService / daysBetweenEvents - only the
// GET /api/machine/under-maintenance/{id} endpoint computes those.
export type MaintenanceItem = {
  id: number;
  machineId: number;
  machineName: string;
  maintenance: boolean;
  createdAt: string;
  machineDetailId: number | null;
  location: string;
  ahs: number | null;
  eventId: number | null;
  event: string | null;
  maintenanceType: string | null;
  productionYear: number | null;
  operationHours: number;
  downtimeHours: number;
  statusName: string;
};

// Mirrors smart_table's UnderMaintenance single-record row (GET /api/machine/under-maintenance/{id}).
// Same shape as MaintenanceItem plus the two DATEDIFF columns that only the by-id query computes.
export type MaintenanceDetail = MaintenanceItem & {
  daysSinceLastService: number | null;
  daysBetweenEvents: number | null;
};

// Body for PUT /api/machine/under-maintenance/complete/{id} - closes a work order,
// writes an `action` log row, and (once the backend bug is fixed) writes ahs/statusId
// back to machine_detail. userId/name identify the technician (from AuthContext).
// The ML-predicted health score isn't wired up yet, so the mobile app currently sends
// the machine's *current* ahs/statusId unchanged - see ReportScreen.
export type CompleteWorkOrderRequest = {
  userId: number;
  name: string;
  action: string;
  ahs: number;
  statusId: number;
};

// Mirrors smart_table's MachinePredictResponse (GET /api/machine/predict/{machineDetailId}).
// The backend proxies the XGBoost model in /machine-learning; `severity` maps 1:1 to a
// machine_status name, `healthScore` is a 0-100 AHS.
export type MachinePrediction = {
  machineId: number;
  machineName: string;
  severity: string;
  healthScore: number;
};

// Mirrors smart_table's CompletedMaintenance
// (GET /api/machine/completed-maintenance/machine-detail/history/{machineDetailId}) -
// one closed work order (maintenance = 0, action_id set) with its action log.
// `lastUpdate` can be the SQL default "0001-01-01T00:00:00" when um.last_update was never set.
export type CompletedMaintenanceItem = {
  id: number;
  machineId: number;
  machineName: string;
  maintenance: boolean;
  lastUpdate: string;
  machineDetailId: number | null;
  location: string;
  ahs: number | null;
  eventId: number | null;
  event: string | null;
  maintenanceType: string | null;
  actionId: number | null;
  action: string | null;
};

