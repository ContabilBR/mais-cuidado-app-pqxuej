import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProfileType = 'familia' | 'cuidador' | null;
export type AuthState =
  | 'loading'
  | 'unauthenticated'
  | 'phone_entry'
  | 'code_verification'
  | 'profile_selection'
  | 'lgpd_consent'
  | 'authenticated';

export interface User {
  id: string;
  name: string;
  phone: string;
  profile: ProfileType;
}

interface AuthContextValue {
  user: User | null;
  profile: ProfileType;
  authState: AuthState;
  pendingPhone: string;
  sendCode: (phone: string) => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  selectProfile: (type: 'familia' | 'cuidador') => Promise<void>;
  acceptLgpd: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEYS = {
  user: 'mais_cuidado_user',
  profile: 'mais_cuidado_profile',
  lgpd: 'mais_cuidado_lgpd',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType>(null);
  const [pendingPhone, setPendingPhone] = useState('');

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const [storedUser, storedProfile, storedLgpd] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.user),
        AsyncStorage.getItem(STORAGE_KEYS.profile),
        AsyncStorage.getItem(STORAGE_KEYS.lgpd),
      ]);

      if (storedUser && storedProfile && storedLgpd === 'true') {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setProfile(storedProfile as ProfileType);
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    } catch {
      setAuthState('unauthenticated');
    }
  };

  const sendCode = useCallback(async (phone: string) => {
    console.log('[Auth] sendCode called with phone:', phone);
    setPendingPhone(phone);
    setAuthState('code_verification');
  }, []);

  const verifyCode = useCallback(async (code: string): Promise<boolean> => {
    console.log('[Auth] verifyCode called with code:', code);
    if (code.length === 6) {
      const mockUser: User = {
        id: 'f1',
        name: 'Ana Souza',
        phone: pendingPhone,
        profile: null,
      };
      setUser(mockUser);
      setAuthState('profile_selection');
      return true;
    }
    return false;
  }, [pendingPhone]);

  const selectProfile = useCallback(async (type: 'familia' | 'cuidador') => {
    console.log('[Auth] selectProfile called with type:', type);
    setProfile(type);
    const updatedUser: User = {
      id: type === 'familia' ? 'f1' : 'c1',
      name: type === 'familia' ? 'Ana Souza' : 'Maria Oliveira',
      phone: pendingPhone,
      profile: type,
    };
    setUser(updatedUser);
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedUser));
    await AsyncStorage.setItem(STORAGE_KEYS.profile, type);
    setAuthState('lgpd_consent');
  }, [pendingPhone]);

  const acceptLgpd = useCallback(async () => {
    console.log('[Auth] acceptLgpd called');
    await AsyncStorage.setItem(STORAGE_KEYS.lgpd, 'true');
    setAuthState('authenticated');
  }, []);

  const logout = useCallback(async () => {
    console.log('[Auth] logout called');
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.user),
      AsyncStorage.removeItem(STORAGE_KEYS.profile),
      AsyncStorage.removeItem(STORAGE_KEYS.lgpd),
    ]);
    setUser(null);
    setProfile(null);
    setAuthState('unauthenticated');
  }, []);

  const deleteAccount = useCallback(async () => {
    console.log('[Auth] deleteAccount called');
    await logout();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authState,
        pendingPhone,
        sendCode,
        verifyCode,
        selectProfile,
        acceptLgpd,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
