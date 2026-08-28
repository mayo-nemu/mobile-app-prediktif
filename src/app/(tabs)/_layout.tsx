import { Tabs } from 'expo-router';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

const ACTIVE_COLOR = '#1E8EF2';
const INACTIVE_COLOR = '#8C8C8C';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="qrcode" iconStyle="solid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user" iconStyle="solid" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
