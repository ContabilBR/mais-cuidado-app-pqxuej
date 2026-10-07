import React from 'react';
import { Stack } from 'expo-router';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { COLORS } from '@/constants/Colors';

export default function CuidadorLayoutIos() {
  return (
    <NativeTabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
      }}
    >
      <NativeTabs.Trigger name="hoje">
        <Icon sf="checkmark.square.fill" />
        <Label>Hoje</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="agenda">
        <Icon sf="calendar" />
        <Label>Agenda</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="conversas">
        <Icon sf="message.fill" />
        <Label>Conversas</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="perfil">
        <Icon sf="person.fill" />
        <Label>Meu Perfil</Label>
      </NativeTabs.Trigger>

      <Stack name="hoje" screenOptions={{ headerShown: false }} />
      <Stack name="agenda" screenOptions={{ headerShown: false }} />
      <Stack name="conversas" screenOptions={{ headerShown: false }} />
      <Stack name="perfil" screenOptions={{ headerShown: false }} />
    </NativeTabs>
  );
}
