import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormField } from '../../../shared/components/FormField';

export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('Login attempt', { username, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in to PrediktIF</Text>
      <FormField label="Username" value={username} onChangeText={setUsername} />
      <FormField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Log In" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});
