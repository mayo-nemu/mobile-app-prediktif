function getRequiredEnvVar(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy .env.example to .env and set it to your backend's URL.`,
    );
  }

  return value;
}

export function getAuthApiUrl(): string {
  return getRequiredEnvVar('EXPO_PUBLIC_AUTH_API_URL');
}

export function getMachineApiUrl(): string {
  return getRequiredEnvVar('EXPO_PUBLIC_MACHINE_API_URL');
}
