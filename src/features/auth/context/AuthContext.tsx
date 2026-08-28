import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { login as loginRequest, type AuthenticatedUser, type LoginCredentials } from '../api/authApi';

type AuthContextValue = {
  user: AuthenticatedUser | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const result = await loginRequest(credentials);

    if (!result.success || !result.token || !result.user) {
      throw new Error(result.message || 'Login gagal. Periksa kembali username dan kata sandi Anda.');
    }

    // The API currently echoes the password back in the user object - drop it
    // before it ever lands in app state.
    const { password: _password, ...safeUser } = result.user as AuthenticatedUser & { password?: string };

    setToken(result.token);
    setUser(safeUser as AuthenticatedUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
