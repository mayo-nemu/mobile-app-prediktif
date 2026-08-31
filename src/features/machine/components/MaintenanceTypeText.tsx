import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';
import { shortenMaintenanceType } from '../utils/shortenMaintenanceType';

type MaintenanceTypeTextProps = {
  maintenanceType: string | null | undefined;
  // Optional leading text (e.g. "Kategori: ") - included in the fit measurement.
  prefix?: string;
  style?: StyleProp<TextStyle>;
};

// Shows the full "Preventive Maintenance" when it fits on one line in the space it's
// given, otherwise the "Preventive" shorthand. Works by rendering an invisible,
// unconstrained-height copy and checking whether it wrapped past one line.
export function MaintenanceTypeText({ maintenanceType, prefix = '', style }: MaintenanceTypeTextProps) {
  const full = prefix + (maintenanceType?.trim() || '-');
  const short = prefix + shortenMaintenanceType(maintenanceType);

  // null = not measured yet; skip measuring when there's nothing to shorten.
  const [fitsFull, setFitsFull] = useState<boolean | null>(full === short ? true : null);

  useEffect(() => {
    setFitsFull(full === short ? true : null);
  }, [full, short]);

  return (
    <View style={styles.wrap}>
      <Text style={style} numberOfLines={1}>
        {fitsFull === false ? short : full}
      </Text>
      {fitsFull === null && (
        <Text
          style={[style, styles.probe]}
          onTextLayout={(e) => setFitsFull(e.nativeEvent.lines.length <= 1)}
        >
          {full}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // flexShrink lets the probe measure against the real slot in a flex row; in a
  // column the child stretches to full width anyway.
  wrap: {
    flexShrink: 1,
  },
  probe: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
  },
});
