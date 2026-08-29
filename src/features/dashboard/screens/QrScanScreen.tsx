import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { PillButton } from '@/shared/components/PillButton';
import { ScannedMachineCard } from '../components/ScannedMachineCard';
import { getOpenWorkOrderByMachineId } from '@/features/machine/api/machinesApi';
import { parseMachineIdFromQrCode } from '../utils/parseMachineQrCode';
import { ApiError } from '@/shared/api/apiClient';
import type { MaintenanceItem } from '@/features/machine/types';

type ScanState =
  | { status: 'scanning' }
  | { status: 'loading' }
  | { status: 'found'; workOrder: MaintenanceItem }
  | { status: 'error'; message: string };

export function QrScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [scan, setScan] = useState<ScanState>({ status: 'scanning' });

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scan.status !== 'scanning') {
      return;
    }

    const machineId = parseMachineIdFromQrCode(data);
    if (machineId === null) {
      setScan({ status: 'error', message: 'QR code tidak dikenali sebagai QR mesin PrediktIF.' });
      return;
    }

    setScan({ status: 'loading' });
    try {
      const workOrder = await getOpenWorkOrderByMachineId(machineId);
      if (!workOrder) {
        setScan({ status: 'error', message: 'Mesin ini tidak sedang dalam perbaikan.' });
        return;
      }
      setScan({ status: 'found', workOrder });
    } catch (err) {
      setScan({
        status: 'error',
        message: err instanceof ApiError ? err.message : 'Gagal mengambil data mesin.',
      });
    }
  };

  const handleScanAgain = () => {
    setScan({ status: 'scanning' });
  };

  const handleOpenMachineData = () => {
    if (scan.status !== 'found') {
      return;
    }
    router.push(`/maintenance/${scan.workOrder.machineId}`);
  };

  const isScanning = scan.status === 'scanning';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <FontAwesome6 name="chevron-left" iconStyle="solid" size={20} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>Scan QR mesin</Text>
        </View>
        <Pressable onPress={() => setTorchOn((prev) => !prev)} hitSlop={8}>
          <FontAwesome6
            name="bolt"
            iconStyle="solid"
            size={20}
            color={torchOn ? '#FACC15' : '#000'}
          />
        </Pressable>
      </View>

      <View style={styles.cameraContainer}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={torchOn}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.permissionContainer]}>
            <Text style={styles.permissionText}>
              Izin kamera diperlukan untuk memindai QR mesin.
            </Text>
            <PillButton label="Izinkan Kamera" onPress={requestPermission} />
          </View>
        )}

        {permission?.granted && isScanning && (
          <View style={styles.frameContainer} pointerEvents="none">
            <View style={styles.frame}>
              <FontAwesome6 name="qrcode" iconStyle="solid" size={28} color="#fff" />
              <Text style={styles.frameText}>Arahkan kamera ke QR mesin</Text>
            </View>
          </View>
        )}

        {permission?.granted && scan.status === 'loading' && (
          <View style={styles.frameContainer} pointerEvents="none">
            <ActivityIndicator color="#fff" size="large" />
          </View>
        )}

        {permission?.granted && scan.status === 'found' && (
          <View style={styles.resultContainer}>
            <ScannedMachineCard workOrder={scan.workOrder} onOpenData={handleOpenMachineData} />
          </View>
        )}

        {permission?.granted && scan.status === 'error' && (
          <View style={styles.resultContainer}>
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{scan.message}</Text>
            </View>
            <PillButton label="Scan ulang" onPress={handleScanAgain} />
          </View>
        )}
      </View>
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
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 21,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  frameContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 260,
    height: 260,
    borderWidth: 2,
    borderColor: '#1E8EF2',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  frameText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultContainer: {
    position: 'absolute',
    left: 21,
    right: 21,
    bottom: 24,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
});
