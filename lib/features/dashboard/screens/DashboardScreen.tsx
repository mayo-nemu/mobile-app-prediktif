import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MachineCard } from '../components/MachineCard';
import type { Machine } from '../types';

const MOCK_MACHINES: Machine[] = [
  {
    id: 1,
    machineName: 'CNC Mill A1',
    location: 'Building 2, Floor 1',
    productionYear: 2019,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 2,
    machineName: 'Lathe B3',
    location: 'Building 1, Floor 2',
    productionYear: 2021,
    createdAt: '2024-03-22T08:00:00Z',
  },
  {
    id: 3,
    machineName: 'Press C7',
    location: 'Building 2, Floor 1',
    productionYear: 2017,
    createdAt: '2023-11-05T08:00:00Z',
  },
];

function DashboardHeader() {
  const handleAddMachine = () => {
    console.log('Add machine tapped');
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Jadwal hari ini</Text>
      <Pressable onPress={handleAddMachine}>
        <Text style={styles.link}>Lihat semua</Text>
      </Pressable>
    </View>
  );
}

export function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PrediktIF</Text>
      <DashboardHeader />
      <FlatList
        data={MOCK_MACHINES}
        keyExtractor={(machine) => machine.id.toString()}
        renderItem={({ item }) => <MachineCard machine={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 84,
    paddingHorizontal: 21,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 21,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  link: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8EF2',
  },
});
