import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { SyncIndicator } from '@/components/SyncIndicator';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { Camera, Check } from 'lucide-react-native';

export default function NovaOcorrenciaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPhoto = () => {
    console.log('[NovaOcorrencia] Botão "Adicionar foto" pressionado');
    Alert.alert('Câmera', 'Funcionalidade de câmera disponível em breve.');
  };

  const handleSubmit = async () => {
    console.log('[NovaOcorrencia] Botão "Registrar ocorrência" pressionado, texto:', text.trim());
    if (!text.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, descreva o que aconteceu.');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    Alert.alert('Registrado!', 'Ocorrência registrada com sucesso.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const isValid = text.trim().length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              <SyncIndicator status="pending" />
            </View>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 120,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text }}>
            O que aconteceu?
          </Text>
          <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 }}>
            Descreva com detalhes o que ocorreu com o idoso.
          </Text>
        </View>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Ex: Sr. José reclamou de dor no joelho. Aplicamos compressa fria e ele ficou mais confortável..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 14,
            padding: 16,
            fontFamily: FONTS.regular,
            fontSize: 16,
            color: COLORS.text,
            borderWidth: 1.5,
            borderColor: text ? COLORS.primary : COLORS.border,
            minHeight: 140,
            lineHeight: 24,
          }}
          autoFocus
        />

        <TouchableOpacity
          onPress={handleAddPhoto}
          accessibilityRole="button"
          accessibilityLabel="Adicionar foto"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1.5,
            borderColor: COLORS.border,
            borderStyle: 'dashed',
            minHeight: 56,
          }}
        >
          <Camera size={20} color={COLORS.primary} />
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.primary }}>
            Adicionar foto
          </Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: COLORS.warningMuted,
            borderRadius: 10,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.warning, flex: 1, lineHeight: 18 }}>
            Guardamos offline e enviamos quando houver conexão com a internet.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed bottom button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 16,
          paddingTop: 16,
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.divider,
        }}
      >
        <AnimatedPressable
          onPress={handleSubmit}
          disabled={!isValid || loading}
          accessibilityRole="button"
          accessibilityLabel="Registrar ocorrência"
        >
          <View
            style={{
              backgroundColor: isValid ? COLORS.accent : COLORS.surfaceTertiary,
              borderRadius: 14,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Check size={20} color={isValid ? COLORS.white : COLORS.textTertiary} />
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
                color: isValid ? COLORS.white : COLORS.textTertiary,
              }}
            >
              {loading ? 'Registrando...' : 'Registrar ocorrência'}
            </Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}
