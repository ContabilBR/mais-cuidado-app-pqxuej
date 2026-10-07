import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { MOCK_IDOSOS, MOCK_CHECKLIST } from '@/data/mock';
import { useAuth } from '@/contexts/AuthContext';
import { User, AlertTriangle, CheckCircle, Plus, Pill } from 'lucide-react-native';

export default function InicioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const totalMeds = MOCK_CHECKLIST.filter((c) => c.type === 'remedio').length;
  const doneMeds = MOCK_CHECKLIST.filter((c) => c.type === 'remedio' && c.done).length;
  const pendingMeds = MOCK_CHECKLIST.filter((c) => c.type === 'remedio' && !c.done);

  const userName = user?.name?.split(' ')[0] ?? 'Ana';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: FONTS.extraBold, fontSize: 26, color: COLORS.text, letterSpacing: -0.3 }}>
              Olá, {userName} 👋
            </Text>
            <Text style={{ fontFamily: FONTS.regular, fontSize: 16, color: COLORS.textSecondary, marginTop: 2 }}>
              Acompanhe a rotina dos seus familiares
            </Text>
          </View>
          <AnimatedPressable
            onPress={() => {
              console.log('[Inicio] Botão de perfil pressionado');
              logout();
            }}
            accessibilityRole="button"
            accessibilityLabel="Perfil do usuário"
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: COLORS.primaryMuted,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={22} color={COLORS.primary} />
            </View>
          </AnimatedPressable>
        </View>

        {/* Alerts */}
        {!loading && pendingMeds.length > 0 ? (
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text }}>Alertas</Text>
            {pendingMeds.map((med) => (
              <View
                key={med.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: COLORS.warningMuted,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: COLORS.warning,
                }}
              >
                <AlertTriangle size={18} color={COLORS.warning} />
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text, flex: 1 }}>
                  {med.label} não foi marcado às {med.time}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Idosos */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text }}>Seus familiares</Text>

          {loading ? (
            <>
              <Card><SkeletonCard /></Card>
              <Card><SkeletonCard /></Card>
            </>
          ) : (
            MOCK_IDOSOS.map((idoso) => {
              const allOk = doneMeds === totalMeds;
              const statusLabel = allOk ? 'Tudo certo ✓' : 'Atenção ⚠';
              const statusColor = allOk ? COLORS.success : COLORS.warning;
              const statusBg = allOk ? COLORS.verifiedBg : COLORS.warningMuted;
              const medSummary = `${doneMeds} de ${totalMeds} remédios tomados`;

              return (
                <AnimatedPressable
                  key={idoso.id}
                  onPress={() => {
                    console.log('[Inicio] Card do idoso pressionado:', idoso.name);
                    router.push('/(familia)/rotina');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver rotina de ${idoso.name}`}
                >
                  <Card>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                      <Avatar name={idoso.name} imageUrl={idoso.photo} size={56} />
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>
                            {idoso.name}
                          </Text>
                          <View style={{ backgroundColor: statusBg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
                            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 12, color: statusColor }}>
                              {statusLabel}
                            </Text>
                          </View>
                        </View>
                        <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary }}>
                          {idoso.age} anos
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <Pill size={14} color={COLORS.primary} />
                          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.primary }}>
                            {medSummary}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                </AnimatedPressable>
              );
            })
          )}
        </View>

        {/* Add elderly */}
        <AnimatedPressable
          onPress={() => {
            console.log('[Inicio] Botão "Cadastrar idoso" pressionado');
            router.push('/(familia)/idoso/novo');
          }}
          accessibilityRole="button"
          accessibilityLabel="Cadastrar idoso"
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: COLORS.primary,
              borderStyle: 'dashed',
              paddingVertical: 16,
              backgroundColor: COLORS.primaryMuted,
            }}
          >
            <Plus size={20} color={COLORS.primary} />
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.primary }}>
              Cadastrar idoso
            </Text>
          </View>
        </AnimatedPressable>

        <LegalDisclaimer />
      </ScrollView>
    </View>
  );
}
