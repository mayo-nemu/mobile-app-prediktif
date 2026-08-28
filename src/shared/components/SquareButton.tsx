import { Pressable, StyleSheet, Text } from 'react-native';
import {
  FontAwesome6,
  type FontAwesome6BrandIconName,
  type FontAwesome6RegularIconName,
  type FontAwesome6SolidIconName,
} from '@react-native-vector-icons/fontawesome6';

type Icon =
  | { iconStyle: 'solid'; name: FontAwesome6SolidIconName }
  | { iconStyle: 'regular'; name: FontAwesome6RegularIconName }
  | { iconStyle: 'brand'; name: FontAwesome6BrandIconName };

type SquareButtonProps = {
  label: string;
  icon: Icon;
  onPress: () => void;
};

export function SquareButton({ label, icon, onPress }: SquareButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <FontAwesome6 {...icon} size={24} color={'#fff'} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1E8EF2',
    opacity: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,                
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});