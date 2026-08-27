import { Pressable, StyleSheet, Text } from 'react-native';

type PillButtonProps = {
  label: string;
  onPress: () => void;
};

export function PillButton({ label, onPress }: PillButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
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
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
