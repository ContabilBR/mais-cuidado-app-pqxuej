import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react-native';

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return value;
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11;
}

export default function PhoneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sendCode } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (text: string) => {
    setError(null);
    setPhone(formatPhone(text));
  };

  const handleSend = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    const result = await sendCode(phone);
    setLoading(false);
    if (result.ok) {
      router.push('/auth/verify');
    } else {
      setError(result.error);
    }
  };

  const valid = isValidPhone(phone);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        accessibilityLabel="Voltar"
        accessibilityRole="button"
        style={{ marginBottom: 32, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
      >
        <ArrowLeft size={24} color={COLORS.text} />
      </TouchableOpacity>

      <View style={{ gap: 8, marginBottom: 40 }}>
        <Text style={{ fontFamily: FONTS.extraBold, fontSize: 28, color: COLORS.text, letterSpacing: -0.5, lineHeight: 36 }}>
          Qual é o seu telefone?
        </Text>
        <Text style={{ fontFamily: FONTS.regular, fontSize: 16, color: COLORS.textSecondary, lineHeight: 24 }}>
          Vamos enviar um código por SMS para confirmar
        </Text>
      </View>

      <TextInput
        value={phone}
        onChangeText={handleChange}
        placeholder="(11) 99999-9999"
        placeholderTextColor={COLORS.textTertiary}
        keyboardType="phone-pad"
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: error ? COLORS.danger : phone.length > 0 ? COLORS.primary : COLORS.border,
          paddingHorizontal: 16,
          paddingVertical: 16,
          fontFamily: FONTS.semiBold,
          fontSize: 20,
          color: COLORS.text,
          letterSpacing: 1,
          marginBottom: error ? 12 : 32,
        }}
        autoFocus
      />

      {error ? (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={{ fontFamily: FONTS.regular, fontSize: 16, color: COLORS.danger, lineHeight: 24, marginBottom: 24 }}
        >
          {error}
        </Text>
      ) : null}

      <AnimatedPressable
        onPress={handleSend}
        disabled={!valid || loading}
        accessibilityRole="button"
        accessibilityLabel="Enviar código"
      >
        <View
          style={{
            backgroundColor: valid ? COLORS.primary : COLORS.surfaceTertiary,
            borderRadius: 14,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
              color: valid ? COLORS.white : COLORS.textTertiary,
            }}
          >
            {loading ? 'Enviando...' : 'Enviar código'}
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}
