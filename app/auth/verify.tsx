import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react-native';

const CODE_LENGTH = 6;
const COUNTDOWN_SECONDS = 45;

export default function VerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { verifyCode, pendingPhone, sendCode } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDigitChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const code = digits.join('');
    console.log('[Verify] Botão "Confirmar" pressionado, código:', code);
    setLoading(true);
    const success = await verifyCode(code);
    setLoading(false);
    if (success) {
      router.replace('/auth/profile-select');
    } else {
      Alert.alert('Código inválido', 'Por favor, verifique o código e tente novamente.');
    }
  };

  const handleResend = async () => {
    console.log('[Verify] Botão "Reenviar código" pressionado');
    await sendCode(pendingPhone);
    setCountdown(COUNTDOWN_SECONDS);
    setDigits(Array(CODE_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  const code = digits.join('');
  const isComplete = code.length === CODE_LENGTH;
  const countdownText = `0:${countdown.toString().padStart(2, '0')}`;

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
          Digite o código
        </Text>
        <Text style={{ fontFamily: FONTS.regular, fontSize: 16, color: COLORS.textSecondary, lineHeight: 24 }}>
          Enviamos um SMS para{' '}
          <Text style={{ fontFamily: FONTS.semiBold, color: COLORS.text }}>{pendingPhone}</Text>
        </Text>
      </View>

      {/* Digit inputs */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            value={digit}
            onChangeText={(text) => handleDigitChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={{
              width: 48,
              height: 56,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: digit ? COLORS.primary : COLORS.border,
              backgroundColor: COLORS.surface,
              textAlign: 'center',
              fontFamily: FONTS.bold,
              fontSize: 22,
              color: COLORS.text,
            }}
            autoFocus={index === 0}
          />
        ))}
      </View>

      {/* Countdown / Resend */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        {countdown > 0 ? (
          <Text style={{ fontFamily: FONTS.regular, fontSize: 16, color: COLORS.textSecondary }}>
            Reenviar em{' '}
            <Text style={{ fontFamily: FONTS.semiBold, color: COLORS.primary }}>{countdownText}</Text>
          </Text>
        ) : (
          <AnimatedPressable onPress={handleResend} accessibilityRole="button" accessibilityLabel="Reenviar código">
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.primary }}>
              Reenviar código
            </Text>
          </AnimatedPressable>
        )}
      </View>

      <AnimatedPressable
        onPress={handleConfirm}
        disabled={!isComplete || loading}
        accessibilityRole="button"
        accessibilityLabel="Confirmar código"
      >
        <View
          style={{
            backgroundColor: isComplete ? COLORS.primary : COLORS.surfaceTertiary,
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
              color: isComplete ? COLORS.white : COLORS.textTertiary,
            }}
          >
            {loading ? 'Verificando...' : 'Confirmar'}
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}
