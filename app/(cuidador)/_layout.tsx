import React from 'react';
import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { COLORS } from '@/constants/Colors';

const CUIDADOR_TABS: TabBarItem[] = [
  { name: 'hoje', route: '/(cuidador)/hoje', icon: 'check-box', label: 'Hoje' },
  { name: 'agenda', route: '/(cuidador)/agenda', icon: 'calendar-today', label: 'Agenda' },
  { name: 'conversas', route: '/(cuidador)/conversas', icon: 'chat', label: 'Conversas' },
  { name: 'perfil', route: '/(cuidador)/perfil', icon: 'person', label: 'Meu Perfil' },
];

export default function CuidadorLayout() {
  const pathname = usePathname();
  const isTabScreen =
    pathname.endsWith('/hoje') ||
    pathname.endsWith('/agenda') ||
    pathname.endsWith('/conversas') ||
    pathname.endsWith('/perfil');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="hoje" />
        <Stack.Screen name="agenda" />
        <Stack.Screen name="conversas" />
        <Stack.Screen name="perfil" />
      </Stack>
      {isTabScreen ? (
        <FloatingTabBar tabs={CUIDADOR_TABS} containerWidth={340} />
      ) : null}
    </View>
  );
}
