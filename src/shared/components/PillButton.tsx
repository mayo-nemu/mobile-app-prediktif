import { Pressable, StyleSheet, Text } from 'react-native';

type PillButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PillButton({ label, onPress, disabled }: PillButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#1E8EF2',
    opacity: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
