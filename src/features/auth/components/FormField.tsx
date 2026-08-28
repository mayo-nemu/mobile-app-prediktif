import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

export function FormField({ label, value, onChangeText, secureTextEntry }: FormFieldProps) {
  const [isHidden, setIsHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isHidden}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <Pressable onPress={() => setIsHidden((prev) => !prev)} hitSlop={8}>
            <FontAwesome6
              name={isHidden ? 'eye-slash' : 'eye'}
              iconStyle="solid"
              size={18}
              color="#666"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
