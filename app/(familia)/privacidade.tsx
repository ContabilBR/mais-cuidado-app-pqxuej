import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Trash2 } from 'lucide-react-native';

export default function PrivacidadeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { deleteAccount } = useAuth();

  const handleDelete = () => {
    console.log('[Privacidade] Botão "Excluir conta" pressionado');
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
    { title: 'Dados coletados', text: 'Coletamos nome, telefone e informações de saúde do idoso cadastrado. Esses dados são necessários para o funcionamento do app.' },
    { title: 'Como usamos', text: 'Seus dados são usados exclusivamente para conectar famílias a cuidadores e acompanhar a rotina do idoso.' },
    { title: 'O que não fazemos', text: 'Não exibimos anúncios. Não compartilhamos seus dados com terceiros. Não vendemos informações pessoais.' },
    { title: 'Seus direitos', text: 'Você pode solicitar a exclusão de todos os seus dados a qualquer momento usando o botão abaixo.' },
  ];

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 16,
      }}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: COLORS.primaryMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Shield size={32} color={COLORS.primary} />
        </View>
      </View>

      {sections.map((section) => (
        <Card key={section.title} style={{ gap: 8 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text }}>{section.title}</Text>
          <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 }}>
            {section.text}
          </Text>
        </Card>
      ))}

      <AnimatedPressable
        onPress={handleDelete}
        accessibilityRole="button"
        accessibilityLabel="Excluir minha conta e todos os dados"
        style={{ marginTop: 16 }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: COLORS.dangerMuted,
            borderRadius: 14,
            height: 56,
            borderWidth: 1,
            borderColor: COLORS.danger,
          }}
        >
          <Trash2 size={18} color={COLORS.danger} />
          <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.danger }}>
            Excluir minha conta e todos os dados
          </Text>
        </View>
      </AnimatedPressable>
    </ScrollView>
  );
}
