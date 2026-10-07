import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Heart } from 'lucide-react-native';

type ProfileOption = 'familia' | 'cuidador';

export default function ProfileSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectProfile } = useAuth();
  const [selected, setSelected] = useState<ProfileOption | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (type: ProfileOption) => {
    console.log('[ProfileSelect] Perfil selecionado:', type);
    setSelected(type);
  };

  const handleContinue = async () => {
    if (!selected) return;
    console.log('[ProfileSelect] Botão "Continuar" pressionado com perfil:', selected);
    setLoading(true);
    await selectProfile(selected);
    setLoading(false);
    router.replace('/auth/lgpd');
  };

  const options: { type: ProfileOption; icon: React.ReactNode; title: string; description: string }[] = [
    {
      type: 'familia',
      icon: <Users size={32} color={selected === 'familia' ? COLORS.primary : COLORS.textSecondary} />,
      title: 'Sou da família',
      description: 'Quero encontrar um cuidador e acompanhar a rotina do meu familiar',
    },
    {
      type: 'cuidador',
      icon: <Heart size={32} color={selected === 'cuidador' ? COLORS.primary : COLORS.textSecondary} />,
      title: 'Sou cuidador(a)',
      description: 'Quero oferecer meus serviços de cuidado',
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: insets.top + 32,
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
      }}
    >
      <View style={{ gap: 8, marginBottom: 40 }}>
        <Text style={{ fontFamily: FONTS.extraBold, fontSize: 28, color: COLORS.text, letterSpacing: -0.5, lineHeight: 36 }}>
          Como você vai usar o Mais Cuidado?
        </Text>
      </View>

      <View style={{ gap: 16, flex: 1 }}>
        {options.map((option) => {
          const isSelected = selected === option.type;
          return (
            <AnimatedPressable
              key={option.type}
              onPress={() => handleSelect(option.type)}
              accessibilityRole="button"
              accessibilityLabel={option.title}
            >
              <View
                style={{
                  backgroundColor: isSelected ? COLORS.primaryMuted : COLORS.surface,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: isSelected ? COLORS.primary : COLORS.border,
                  padding: 24,
                  gap: 12,
                  borderCurve: 'continuous',
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: isSelected ? COLORS.primaryMutedStrong : COLORS.surfaceSecondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {option.icon}
                </View>
                <Text style={{ fontFamily: FONTS.bold, fontSize: 20, color: COLORS.text, lineHeight: 28 }}>
                  {option.title}
                </Text>
                <Text style={{ fontFamily: FONTS.regular, fontSize: 16, color: COLORS.textSecondary, lineHeight: 24 }}>
                  {option.description}
                </Text>
              </View>
            </AnimatedPressable>
          );
        })}
      </View>

      <AnimatedPressable
        onPress={handleContinue}
        disabled={!selected || loading}
        accessibilityRole="button"
        accessibilityLabel="Continuar"
        style={{ marginTop: 24 }}
      >
        <View
          style={{
            backgroundColor: selected ? COLORS.primary : COLORS.surfaceTertiary,
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
              color: selected ? COLORS.white : COLORS.textTertiary,
            }}
          >
            {loading ? 'Aguarde...' : 'Continuar'}
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}
