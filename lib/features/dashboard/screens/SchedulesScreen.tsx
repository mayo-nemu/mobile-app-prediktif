import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { MachineCard } from '../components/MachineCard';
import { useMachineDetails } from '../hooks/useMachineDetails';
import { sortByUrgency } from '../utils/sortByUrgency';
import type { MachineDetail } from '../types';

export function SchedulesScreen() {
  const router = useRouter();
  const { machines, isLoading, error, reload } = useMachineDetails();
  const sorted = sortByUrgency(machines);

  const handleOpenMachine = (machine: MachineDetail) => {
    router.push(`/dashboard/machine/${machine.machineId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome6 name="chevron-left" iconStyle="solid" size={20} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Semua Jadwal</Text>
      </View>

      <View style={styles.content}>
        {isLoading && <ActivityIndicator style={styles.stateBox} color="#1E8EF2" />}
        {!isLoading && error && (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={reload}>
              <Text style={styles.link}>Coba lagi</Text>
            </Pressable>
          </View>
        )}
        {!isLoading && !error && sorted.length === 0 && (
          <View style={styles.stateBox}>
            <Text style={styles.detail}>Belum ada mesin terdaftar.</Text>
          </View>
        )}
        {!isLoading && !error && sorted.length > 0 && (
          <FlatList
            data={sorted}
            keyExtractor={(machine) => machine.id.toString()}
            renderItem={({ item }) => (
              <MachineCard machine={item} onPress={() => handleOpenMachine(item)} />
            )}
            onRefresh={reload}
            refreshing={false}
          />
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
    gap: 16,
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 21,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 21,
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
  },
  link: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8EF2',
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
});
