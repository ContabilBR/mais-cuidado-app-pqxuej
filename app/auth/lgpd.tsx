import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Check } from 'lucide-react-native';

export default function LgpdScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { acceptLgpd, deleteAccount } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    console.log('[LGPD] Botão "Continuar" pressionado, aceito:', agreed);
    setLoading(true);
    await acceptLgpd();
    setLoading(false);
    router.replace('/');
  };

  const handleDelete = () => {
    console.log('[LGPD] Botão "Excluir minha conta e dados" pressionado');
    Alert.alert(
      'Excluir conta',
      'Tem certeza que deseja excluir sua conta e todos os seus dados? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            router.replace('/auth/welcome');
          },
        },
      ]
    );
  };

  const sections = [
    {
      title: 'O que coletamos',
      text: 'Coletamos seu nome, telefone e informações de saúde do idoso que você cadastrar. Esses dados são necessários para conectar famílias e cuidadores.',
    },
    {
      title: 'Como usamos',
      text: 'Seus dados são usados exclusivamente para conectar famílias a cuidadores e acompanhar a rotina do idoso. Nunca usamos para publicidade.',
    },
    {
      title: 'O que NÃO fazemos',
      text: 'Não exibimos anúncios. Não compartilhamos seus dados com terceiros. Não vendemos informações pessoais.',
    },
    {
      title: 'Seus direitos',
      text: 'Você pode solicitar a exclusão de todos os seus dados a qualquer momento. Basta acessar Configurações > Privacidade > Excluir conta.',
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: insets.top + 24,
      }}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', marginBottom: 32, gap: 16 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: COLORS.primaryMuted,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={36} color={COLORS.primary} />
          </View>
          <Text style={{ fontFamily: FONTS.extraBold, fontSize: 26, color: COLORS.text, textAlign: 'center', letterSpacing: -0.3, lineHeight: 34 }}>
            Seus dados estão seguros
          </Text>
        </View>

        <View style={{ gap: 20, marginBottom: 32 }}>
          {sections.map((section) => (
            <View
              key={section.title}
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 14,
                padding: 16,
                gap: 8,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text }}>
                {section.title}
              </Text>
              <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 }}>
                {section.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Checkbox */}
        <AnimatedPressable
          onPress={() => {
            console.log('[LGPD] Checkbox pressionado, novo estado:', !agreed);
            setAgreed(!agreed);
          }}
          accessibilityRole="checkbox"
          accessibilityLabel="Li e concordo com o uso dos meus dados"
          style={{ marginBottom: 32 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: agreed ? COLORS.primary : COLORS.border,
                backgroundColor: agreed ? COLORS.primary : COLORS.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {agreed ? <Check size={14} color={COLORS.white} /> : null}
            </View>
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.text, flex: 1, lineHeight: 24 }}>
              Li e concordo com o uso dos meus dados
            </Text>
          </View>
        </AnimatedPressable>

        {/* Delete link */}
        <TouchableOpacity
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Excluir minha conta e dados"
          style={{ alignItems: 'center', paddingVertical: 12 }}
        >
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.danger }}>
            Excluir minha conta e dados
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed bottom button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 16,
          paddingTop: 16,
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.divider,
        }}
      >
        <AnimatedPressable
          onPress={handleContinue}
          disabled={!agreed || loading}
          accessibilityRole="button"
          accessibilityLabel="Continuar"
        >
          <View
            style={{
              backgroundColor: agreed ? COLORS.primary : COLORS.surfaceTertiary,
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
                color: agreed ? COLORS.white : COLORS.textTertiary,
              }}
            >
              {loading ? 'Aguarde...' : 'Continuar'}
            </Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}
