import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

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

export type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: User | null;
  profile: ProfileType;
  authState: AuthState;
  pendingPhone: string;
  sendCode: (phone: string) => Promise<AuthResult>;
  verifyCode: (code: string) => Promise<AuthResult>;
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

/**
 * Modo de desenvolvimento: aceita o código DEV_OTP sem enviar SMS.
 * Só funciona com __DEV__ ativo E EXPO_PUBLIC_DEV_OTP_BYPASS=true.
 * Em builds de produção __DEV__ é false, então o atalho nunca existe.
 */
const DEV_BYPASS = __DEV__ && process.env.EXPO_PUBLIC_DEV_OTP_BYPASS === 'true';
const DEV_OTP = '123456';

const MSG_NOT_CONFIGURED =
  'O serviço de verificação ainda não está configurado. Tente novamente mais tarde.';
const MSG_SEND_FAILED = 'Não foi possível enviar o SMS agora. Tente novamente em instantes.';
const MSG_RATE_LIMIT = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
const MSG_INVALID_CODE = 'Código inválido ou expirado. Verifique o código ou peça um novo.';
const MSG_NETWORK = 'Sem conexão com a internet. Verifique sua rede e tente novamente.';

/** Converte "(11) 99999-9999" em "+5511999999999" (E.164, exigido pelo provedor de SMS). */
export function toE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (phone.trim().startsWith('+')) {
    return digits.length >= 12 ? `+${digits}` : null;
  }
  if (digits.length === 11) return `+55${digits}`;
  if (digits.length === 13 && digits.startsWith('55')) return `+${digits}`;
  return null;
}

function mapAuthError(error: { message?: string; status?: number } | null, fallback: string): string {
  if (!error) return fallback;
  const message = (error.message ?? '').toLowerCase();
  if (error.status === 429 || message.includes('rate limit') || message.includes('too many')) {
    return MSG_RATE_LIMIT;
  }
  if (message.includes('network') || message.includes('failed to fetch')) {
    return MSG_NETWORK;
  }
  return fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType>(null);
  const [pendingPhone, setPendingPhone] = useState('');

  const clearLocalSession = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.user),
      AsyncStorage.removeItem(STORAGE_KEYS.profile),
      AsyncStorage.removeItem(STORAGE_KEYS.lgpd),
    ]);
    setUser(null);
    setProfile(null);
    setAuthState('unauthenticated');
  }, []);

  const loadSession = useCallback(async () => {
    try {
      const [storedUser, storedProfile, storedLgpd] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.user),
        AsyncStorage.getItem(STORAGE_KEYS.profile),
        AsyncStorage.getItem(STORAGE_KEYS.lgpd),
      ]);

      const hasLocalOnboarding = Boolean(storedUser && storedProfile && storedLgpd === 'true');
      if (!hasLocalOnboarding) {
        setAuthState('unauthenticated');
        return;
      }

      const parsedUser = JSON.parse(storedUser as string) as User;

      if (DEV_BYPASS) {
        setUser(parsedUser);
        setProfile(storedProfile as ProfileType);
        setAuthState('authenticated');
        return;
      }

      // Produção: só vale se ainda existir uma sessão real no Supabase.
      const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
      if (data.session) {
        setUser({ ...parsedUser, id: data.session.user.id });
        setProfile(storedProfile as ProfileType);
        setAuthState('authenticated');
      } else {
        await clearLocalSession();
      }
    } catch {
      setAuthState('unauthenticated');
    }
  }, [clearLocalSession]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Se a sessão for encerrada (expirou, revogada, outro dispositivo), volta ao login.
  useEffect(() => {
    if (!supabase) return;
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        clearLocalSession();
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, [clearLocalSession]);

  // Renovação automática do token só enquanto o app está em primeiro plano.
  useEffect(() => {
    if (!supabase) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') supabase?.auth.startAutoRefresh();
      else supabase?.auth.stopAutoRefresh();
    });
    return () => sub.remove();
  }, []);

  const sendCode = useCallback(async (phone: string): Promise<AuthResult> => {
    const e164 = toE164(phone);
    if (!e164) {
      return { ok: false, error: 'Informe o telefone com DDD, por exemplo (11) 99999-9999.' };
    }

    if (DEV_BYPASS) {
      console.log('[Auth] DEV_BYPASS ativo: SMS não enviado. Use o código', DEV_OTP);
      setPendingPhone(phone);
      setAuthState('code_verification');
      return { ok: true };
    }

    if (!supabase) {
      console.error('[Auth] Supabase não configurado (EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY).');
      return { ok: false, error: MSG_NOT_CONFIGURED };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: e164 });
      if (error) {
        console.error('[Auth] signInWithOtp falhou:', error.status, error.message);
        return { ok: false, error: mapAuthError(error, MSG_SEND_FAILED) };
      }
      setPendingPhone(phone);
      setAuthState('code_verification');
      return { ok: true };
    } catch (e) {
      console.error('[Auth] signInWithOtp lançou exceção:', e);
      return { ok: false, error: MSG_NETWORK };
    }
  }, []);

  const verifyCode = useCallback(
    async (code: string): Promise<AuthResult> => {
      if (!/^\d{6}$/.test(code)) {
        return { ok: false, error: 'Digite os 6 dígitos do código.' };
      }
      const e164 = toE164(pendingPhone);
      if (!e164) {
        return { ok: false, error: 'Telefone não encontrado. Volte e informe o número novamente.' };
      }

      if (DEV_BYPASS) {
        if (code !== DEV_OTP) return { ok: false, error: MSG_INVALID_CODE };
        setUser({ id: 'dev-user', name: 'Ana Souza', phone: e164, profile: null });
        setAuthState('profile_selection');
        return { ok: true };
      }

      if (!supabase) return { ok: false, error: MSG_NOT_CONFIGURED };

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: e164,
          token: code,
          type: 'sms',
        });
        if (error || !data.session || !data.user) {
          if (error) console.error('[Auth] verifyOtp falhou:', error.status, error.message);
          return { ok: false, error: mapAuthError(error, MSG_INVALID_CODE) };
        }
        setUser({ id: data.user.id, name: '', phone: e164, profile: null });
        setAuthState('profile_selection');
        return { ok: true };
      } catch (e) {
        console.error('[Auth] verifyOtp lançou exceção:', e);
        return { ok: false, error: MSG_NETWORK };
      }
    },
    [pendingPhone]
  );

  const selectProfile = useCallback(
    async (type: 'familia' | 'cuidador') => {
      // O nome ainda é provisório: a coleta do nome real é uma etapa de cadastro futura.
      const updatedUser: User = {
        id: user?.id ?? '',
        name: type === 'familia' ? 'Ana Souza' : 'Maria Oliveira',
        phone: user?.phone ?? toE164(pendingPhone) ?? pendingPhone,
        profile: type,
      };
      setProfile(type);
      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedUser));
      await AsyncStorage.setItem(STORAGE_KEYS.profile, type);
      setAuthState('lgpd_consent');
    },
    [pendingPhone, user]
  );

  const acceptLgpd = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.lgpd, 'true');
    setAuthState('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase?.auth.signOut();
    } catch (e) {
      console.error('[Auth] signOut falhou:', e);
    }
    await clearLocalSession();
  }, [clearLocalSession]);

  // ATENÇÃO: por enquanto só encerra a sessão. A exclusão real dos dados (LGPD)
  // exige uma função de servidor com a service role key; não pode rodar no app.
  const deleteAccount = useCallback(async () => {
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
