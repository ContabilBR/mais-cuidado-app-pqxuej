import React from 'react';
import { Stack } from 'expo-router';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { COLORS } from '@/constants/Colors';

export default function FamiliaLayoutIos() {
  return (
    <NativeTabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
      }}
    >
      <NativeTabs.Trigger name="inicio">
        <Icon sf="house.fill" />
        <Label>Início</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cuidadores">
        <Icon sf="person.2.fill" />
        <Label>Cuidadores</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="rotina">
        <Icon sf="checklist" />
        <Label>Rotina</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="conversas">
        <Icon sf="message.fill" />
        <Label>Conversas</Label>
      </NativeTabs.Trigger>

      <Stack name="inicio" screenOptions={{ headerShown: false }} />
      <Stack name="cuidadores" screenOptions={{ headerShown: false }} />
      <Stack name="rotina" screenOptions={{ headerShown: false }} />
      <Stack name="conversas" screenOptions={{ headerShown: false }} />
    </NativeTabs>
  );
}
