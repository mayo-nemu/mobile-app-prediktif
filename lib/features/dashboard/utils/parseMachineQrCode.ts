// Machine QR codes are generated server-side as "MACHINE-ID:{id}|NAME:{name}"
// (see MachineRepository.CreateMachineAsync in backend-microservice-prediktif).
const MACHINE_QR_PATTERN = /^MACHINE-ID:(\d+)\|NAME:/;

export function parseMachineIdFromQrCode(data: string): number | null {
  const match = data.match(MACHINE_QR_PATTERN);
  if (!match) {
    return null;
  }
  return Number(match[1]);
}
