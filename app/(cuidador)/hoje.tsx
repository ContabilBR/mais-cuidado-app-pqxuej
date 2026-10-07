import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { SyncIndicator } from '@/components/SyncIndicator';
import { OfflineBanner } from '@/components/OfflineBanner';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { MOCK_CHECKLIST, MOCK_IDOSOS } from '@/data/mock';
import { useAuth } from '@/contexts/AuthContext';
import { Pill, Utensils, Droplets, Check, Plus, User } from 'lucide-react-native';

type ChecklistItem = typeof MOCK_CHECKLIST[0];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  remedio: <Pill size={20} color={COLORS.primary} />,
  refeicao: <Utensils size={20} color={COLORS.accent} />,
  higiene: <Droplets size={20} color={COLORS.primaryLight} />,
};

const TYPE_LABELS: Record<string, string> = {
  remedio: 'Remédios',
  refeicao: 'Refeições',
  higiene: 'Higiene',
};

export default function HojeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(MOCK_CHECKLIST);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const totalDone = checklist.filter((c) => c.done).length;
  const totalItems = checklist.length;
  const progressPercent = Math.round((totalDone / totalItems) * 100);

  const pendingCount = checklist.filter((c) => !c.done).length;
  const syncStatus = pendingCount > 0 ? 'pending' : 'synced';

  const grouped: Record<string, ChecklistItem[]> = {};
  checklist.forEach((item) => {
    if (!grouped[item.type]) grouped[item.type] = [];
    grouped[item.type].push(item);
  });

  const handleMark = (id: string) => {
    console.log('[Hoje] Tarefa marcada como concluída, id:', id);
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: true, syncStatus: 'pending' } : item))
    );
  };

  const userName = user?.name?.split(' ')[0] ?? 'Maria';
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  const idoso = MOCK_IDOSOS[0];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <OfflineBanner />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 2 }}>
            <Text style={{ fontFamily: FONTS.extraBold, fontSize: 26, color: COLORS.text, letterSpacing: -0.3 }}>
              Olá, {userName} 👋
            </Text>
            <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary }}>
              {today}
            </Text>
          </View>
          <SyncIndicator status={syncStatus} />
        </View>

        {/* Idoso card */}
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: COLORS.primaryMuted,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={26} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textTertiary }}>CUIDANDO DE</Text>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>{idoso.name}</Text>
            <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary }}>
              {idoso.age} anos • {idoso.conditions.join(', ')}
            </Text>
          </View>
        </Card>

        {/* Progress */}
        {!loading ? (
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text }}>
                Progresso do dia
              </Text>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 15, color: COLORS.primary }}>
                {totalDone}/{totalItems} tarefas
              </Text>
            </View>
            <View style={{ height: 10, backgroundColor: COLORS.surfaceTertiary, borderRadius: 5, overflow: 'hidden' }}>
              <View
                style={{
                  height: 10,
                  width: `${progressPercent}%`,
                  backgroundColor: COLORS.primary,
                  borderRadius: 5,
                }}
              />
            </View>
            <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary }}>
              {progressPercent}% concluído
            </Text>
          </Card>
        ) : null}

        {/* Checklist sections */}
        {loading ? (
          <>
            <Card><SkeletonCard /></Card>
            <Card><SkeletonCard /></Card>
            <Card><SkeletonCard /></Card>
          </>
        ) : (
          Object.entries(grouped).map(([type, items]) => (
            <View key={type} style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {TYPE_ICONS[type]}
                <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>
                  {TYPE_LABELS[type] ?? type}
                </Text>
              </View>
              {items.map((item) => (
                <Card key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, minHeight: 72 }}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: item.done ? COLORS.textSecondary : COLORS.text }}>
                      {item.label}
                    </Text>
                    <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textTertiary }}>
                      {item.time}
                    </Text>
                  </View>
                  {item.done ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: COLORS.verifiedBg,
                        borderRadius: 10,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        minHeight: 44,
                      }}
                    >
                      <Check size={16} color={COLORS.verified} />
                      <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.verified }}>
                        Marcado
                      </Text>
                    </View>
                  ) : (
                    <AnimatedPressable
                      onPress={() => handleMark(item.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Marcar ${item.label} como concluído`}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.primary,
                          borderRadius: 10,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          minHeight: 48,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ fontFamily: FONTS.bold, fontSize: 15, color: COLORS.white }}>
                          Marcar
                        </Text>
                      </View>
                    </AnimatedPressable>
                  )}
                </Card>
              ))}
            </View>
          ))
        )}

        <LegalDisclaimer />
      </ScrollView>

      {/* Floating button */}
      <AnimatedPressable
        onPress={() => {
          console.log('[Hoje] Botão "Registrar ocorrência" pressionado');
          router.push('/ocorrencia/nova');
        }}
        accessibilityRole="button"
        accessibilityLabel="Registrar ocorrência"
        style={{
          position: 'absolute',
          bottom: insets.bottom + 90,
          right: 20,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.accent,
            borderRadius: 28,
            paddingHorizontal: 20,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            boxShadow: `0 4px 16px ${COLORS.shadow}`,
          }}
        >
          <Plus size={20} color={COLORS.white} />
          <Text style={{ fontFamily: FONTS.bold, fontSize: 15, color: COLORS.white }}>
            Registrar ocorrência
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}
