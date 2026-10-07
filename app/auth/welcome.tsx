import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { Heart } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleEnter = () => {
    console.log('[Welcome] Botão "Entrar com telefone" pressionado');
    router.push('/auth/phone');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <StatusBar barStyle="light-content" />

      {/* Logo area */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Heart size={52} color={COLORS.white} fill={COLORS.white} />
        </View>

        <View style={{ alignItems: 'center', gap: 12 }}>
          <Text
            style={{
              fontFamily: FONTS.extraBold,
              fontSize: 36,
              color: COLORS.white,
              letterSpacing: -0.5,
              textAlign: 'center',
            }}
          >
            Mais Cuidado
          </Text>
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 18,
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              lineHeight: 26,
              maxWidth: 280,
            }}
          >
            Cuidado com carinho, segurança para a família
          </Text>
        </View>
      </View>

      {/* Bottom actions */}
      <View style={{ width: '100%', gap: 16, alignItems: 'center' }}>
        <AnimatedPressable
          onPress={handleEnter}
          accessibilityRole="button"
          accessibilityLabel="Entrar com telefone"
          style={{ width: '100%' }}
        >
          <View
            style={{
              backgroundColor: COLORS.accent,
              borderRadius: 16,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
              borderCurve: 'continuous',
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
                color: COLORS.white,
              }}
            >
              Entrar com telefone
            </Text>
          </View>
        </AnimatedPressable>

        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 13,
            color: 'rgba(255,255,255,0.65)',
            textAlign: 'center',
            lineHeight: 18,
          }}
        >
          Ao continuar, você concorda com nossos Termos de Uso
        </Text>
      </View>
    </View>
  );
}
