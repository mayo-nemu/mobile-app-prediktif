import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6, type FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';
import type { MachineHistoryItem } from '../../dashboard/types';
import { formatActivityDate } from '../../dashboard/utils/formatTime';

const FAILURE_COLORS = { background: '#FDECEC', icon: '#D32F2F' };
const SERVICE_COLORS = { background: '#E8F1FC', icon: '#1E8EF2' };

function isFailureEvent(event: string | null): boolean {
  return event === 'Failure';
}

function getActivityIcon(event: string | null): FontAwesome6SolidIconName {
  return isFailureEvent(event) ? 'triangle-exclamation' : 'wrench';
}

function getActivityDescription(activity: MachineHistoryItem): string {
  if (activity.actionTaken) {
    return activity.actionTaken;
  }
  return activity.maintenance
    ? 'Masih berlangsung, belum ada catatan tindakan.'
    : 'Tidak ada catatan tindakan.';
}

type ActivityListItemProps = {
  activity: MachineHistoryItem;
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
        <Text style={styles.description}>{getActivityDescription(activity)}</Text>
        <Text style={styles.meta}>
          {formatActivityDate(activity.createdAt)}
          {activity.actionBy ? ` · ${activity.actionBy}` : ''}
        </Text>
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
