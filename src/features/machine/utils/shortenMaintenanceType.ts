// event_maintenance.maintenance_type comes through as "Preventive Maintenance" /
// "Corrective Maintenance". The cards only have room for the distinguishing word,
// so drop the trailing " Maintenance". Returns "-" for a missing value.
export function shortenMaintenanceType(maintenanceType: string | null | undefined): string {
  if (!maintenanceType) return '-';
  const short = maintenanceType.replace(/\s*maintenance\s*$/i, '').trim();
  return short || maintenanceType;
}
