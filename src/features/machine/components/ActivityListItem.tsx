import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import type { CompletedMaintenanceItem } from '../types';
import { formatActivityDate } from '@/shared/utils/formatTime';

// um.last_update comes back as "0001-01-01T00:00:00" when it was never set.
function hasRealTimestamp(isoString: string): boolean {
  const time = new Date(isoString).getTime();
  return Number.isFinite(time) && time > 0;
}

type ActivityListItemProps = {
  activity: CompletedMaintenanceItem;
};

// Every row here is a closed work order (maintenance = 0 with an action logged), so
// they're all "Perbaikan selesai" - the useful detail is the technician's note.
export function ActivityListItem({ activity }: ActivityListItemProps) {
  const meta = [
    hasRealTimestamp(activity.lastUpdate) ? formatActivityDate(activity.lastUpdate) : null,
    activity.actionBy,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <FontAwesome6 name="wrench" iconStyle="solid" size={18} color="#8C8C8C" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Perbaikan selesai</Text>
        <Text style={styles.description}>{activity.action ?? 'Tidak ada catatan tindakan.'}</Text>
        {meta.length > 0 && <Text style={styles.meta}>{meta}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: '#999',
  },
});
