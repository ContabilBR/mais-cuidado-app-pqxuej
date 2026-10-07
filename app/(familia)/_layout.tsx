import React from 'react';
import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { COLORS } from '@/constants/Colors';

const FAMILIA_TABS: TabBarItem[] = [
  { name: 'inicio', route: '/(familia)/inicio', icon: 'home', label: 'Início' },
  { name: 'cuidadores', route: '/(familia)/cuidadores', icon: 'people', label: 'Cuidadores' },
  { name: 'rotina', route: '/(familia)/rotina', icon: 'assignment', label: 'Rotina' },
  { name: 'conversas', route: '/(familia)/conversas', icon: 'chat', label: 'Conversas' },
];

export default function FamiliaLayout() {
  const pathname = usePathname();
  const isTabScreen =
    pathname === '/(familia)/inicio' ||
    pathname === '/(familia)/cuidadores' ||
    pathname === '/(familia)/rotina' ||
    pathname === '/(familia)/conversas' ||
    pathname.endsWith('/inicio') ||
    pathname.endsWith('/cuidadores') ||
    pathname.endsWith('/rotina') ||
    pathname.endsWith('/conversas');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="inicio" />
        <Stack.Screen name="cuidadores" />
        <Stack.Screen name="rotina" />
        <Stack.Screen name="conversas" />
        <Stack.Screen name="privacidade" options={{ headerShown: true, title: 'Privacidade e Dados', headerBackTitle: 'Voltar' }} />
        <Stack.Screen name="idoso/[id]" options={{ headerShown: true, title: 'Dados do Idoso', headerBackTitle: 'Voltar' }} />
        <Stack.Screen name="idoso/novo" options={{ headerShown: true, title: 'Cadastrar Idoso', headerBackTitle: 'Voltar' }} />
        <Stack.Screen
          name="pedido/novo"
          options={{
            presentation: 'formSheet',
            headerShown: true,
            title: 'Solicitar Cuidador',
            sheetGrabberVisible: true,
          }}
        />
      </Stack>
      {isTabScreen ? (
        <FloatingTabBar tabs={FAMILIA_TABS} containerWidth={340} />
      ) : null}
    </View>
  );
}
