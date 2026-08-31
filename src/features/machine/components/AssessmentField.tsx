import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

type AssessmentFieldProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  // When false, the field renders its value as static text (used for the machine-condition
  // snapshot rows, which are read straight from the work order and can't be edited here).
  editable?: boolean;
};

export function AssessmentField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  editable = true,
}: AssessmentFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8C8C8C"
          keyboardType={keyboardType}
          multiline={multiline}
          style={[styles.input, multiline && styles.multilineInput]}
        />
      ) : (
        <Text style={[styles.input, styles.readOnly]}>{value || placeholder || '-'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    borderColor: '#D0D0D0',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 17,
    paddingHorizontal: 14,
    marginBottom: 13,
  },
  label: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 13,
  },
  input: {
    color: '#393939',
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: '#FAFAFA',
    borderColor: '#D0D0D0',
    borderRadius: 8,
    borderWidth: 1,
    padding: 13,
  },
  readOnly: {
    color: '#8C8C8C',
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
});
