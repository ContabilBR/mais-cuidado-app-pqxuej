import 'react-native-reanimated';
import React, { useEffect } from 'react';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { COLORS } from '@/constants/Colors';

const DevErrorBoundary = __DEV__
  ? ErrorBoundary
  : ({ children }: { children: React.ReactNode }) => <>{children}</>;

SplashScreen.preventAutoHideAsync();

const MaisCuidadoTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.accent,
  },
};

const MaisCuidadoDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    primary: COLORS.primaryLight,
    background: '#0D1F1D',
    card: '#1A2E2B',
    text: '#F0F7F6',
    border: 'rgba(42,125,111,0.20)',
    notification: COLORS.accent,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <DevErrorBoundary>
      <StatusBar style="auto" animated />
      <ThemeProvider value={colorScheme === 'dark' ? MaisCuidadoDarkTheme : MaisCuidadoTheme}>
        <SafeAreaProvider>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="(familia)" options={{ headerShown: false }} />
                <Stack.Screen name="(cuidador)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="cuidador-perfil/[id]"
                  options={{ headerShown: true, title: 'Perfil do Cuidador', headerBackTitle: 'Voltar' }}
                />
                <Stack.Screen
                  name="chat/[id]"
                  options={{ headerShown: true, title: 'Conversa', headerBackTitle: 'Voltar' }}
                />
                <Stack.Screen
                  name="ocorrencia/nova"
                  options={{
                    presentation: 'formSheet',
                    headerShown: true,
                    title: 'Registrar Ocorrência',
                    sheetGrabberVisible: true,
                  }}
                />
              </Stack>
            </GestureHandlerRootView>
          </AuthProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </DevErrorBoundary>
  );
}
