import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6, type FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';
import type { CompletedMaintenanceItem } from '../types';
import { formatActivityDate } from '@/shared/utils/formatTime';

const FAILURE_COLORS = { background: '#FDECEC', icon: '#D32F2F' };
const SERVICE_COLORS = { background: '#E8F1FC', icon: '#1E8EF2' };

function isFailureEvent(event: string | null): boolean {
  return event === 'Failure';
}

function getActivityIcon(event: string | null): FontAwesome6SolidIconName {
  return isFailureEvent(event) ? 'triangle-exclamation' : 'wrench';
}

// um.last_update comes back as "0001-01-01T00:00:00" when it was never set.
function hasRealTimestamp(isoString: string): boolean {
  const time = new Date(isoString).getTime();
  return Number.isFinite(time) && time > 0;
}

type ActivityListItemProps = {
  activity: CompletedMaintenanceItem;
};

export function ActivityListItem({ activity }: ActivityListItemProps) {
  const colors = isFailureEvent(activity.event) ? FAILURE_COLORS : SERVICE_COLORS;
  const title = activity.maintenanceType ?? activity.event ?? 'Aktivitas maintenance';

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
        <FontAwesome6 name={getActivityIcon(activity.event)} iconStyle="solid" size={18} color={colors.icon} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{activity.action ?? 'Tidak ada catatan tindakan.'}</Text>
        {hasRealTimestamp(activity.lastUpdate) && (
          <Text style={styles.meta}>{formatActivityDate(activity.lastUpdate)}</Text>
        )}
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
