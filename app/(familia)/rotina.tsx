import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { SyncIndicator } from '@/components/SyncIndicator';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { MOCK_CHECKLIST, MOCK_OCORRENCIAS } from '@/data/mock';
import { Pill, Utensils, Droplets, Check, AlertCircle, Plus } from 'lucide-react-native';

type ChecklistItem = typeof MOCK_CHECKLIST[0];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  remedio: <Pill size={18} color={COLORS.primary} />,
  refeicao: <Utensils size={18} color={COLORS.accent} />,
  higiene: <Droplets size={18} color={COLORS.primaryLight} />,
};

const TYPE_LABELS: Record<string, string> = {
  remedio: 'Remédios',
  refeicao: 'Refeições',
  higiene: 'Higiene',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function RotinaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(MOCK_CHECKLIST);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  const grouped: Record<string, ChecklistItem[]> = {};
  checklist.forEach((item) => {
    if (!grouped[item.type]) grouped[item.type] = [];
    grouped[item.type].push(item);
  });

  const totalDone = checklist.filter((c) => c.done).length;
  const totalItems = checklist.length;

  const pendingCount = checklist.filter((c) => !c.done).length;
  const syncStatus = pendingCount > 0 ? 'pending' : 'synced';

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
        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: FONTS.extraBold, fontSize: 26, color: COLORS.text, letterSpacing: -0.3 }}>
              Rotina de hoje
            </Text>
            <SyncIndicator status={syncStatus} />
          </View>
          <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary }}>
            {today}
          </Text>
        </View>

        {/* Progress */}
        {!loading ? (
          <Card>
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text }}>
                  Progresso do dia
                </Text>
                <Text style={{ fontFamily: FONTS.bold, fontSize: 15, color: COLORS.primary }}>
                  {totalDone}/{totalItems}
                </Text>
              </View>
              <View style={{ height: 8, backgroundColor: COLORS.surfaceTertiary, borderRadius: 4, overflow: 'hidden' }}>
                <View
                  style={{
                    height: 8,
                    width: `${(totalDone / totalItems) * 100}%`,
                    backgroundColor: COLORS.primary,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </Card>
        ) : null}

        {/* Checklist sections */}
        {loading ? (
          <>
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
                <Card key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: item.done ? COLORS.verifiedBg : COLORS.surfaceSecondary,
                      borderWidth: 2,
                      borderColor: item.done ? COLORS.verified : COLORS.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.done ? <Check size={14} color={COLORS.verified} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        fontSize: 16,
                        color: item.done ? COLORS.textSecondary : COLORS.text,
                        textDecorationLine: item.done ? 'line-through' : 'none',
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textTertiary }}>
                      {item.time}
                    </Text>
                  </View>
                  {!item.done ? (
                    <View style={{ backgroundColor: COLORS.warningMuted, borderRadius: 8, padding: 4 }}>
                      <AlertCircle size={14} color={COLORS.warning} />
                    </View>
                  ) : null}
                </Card>
              ))}
            </View>
          ))
        )}

        {/* Register occurrence button */}
        <AnimatedPressable
          onPress={() => {
            console.log('[Rotina] Botão "Aconteceu algo?" pressionado');
            router.push('/ocorrencia/nova');
          }}
          accessibilityRole="button"
          accessibilityLabel="Registrar ocorrência"
        >
          <View
            style={{
              backgroundColor: COLORS.accent,
              borderRadius: 14,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Plus size={20} color={COLORS.white} />
            <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.white }}>
              Aconteceu algo?
            </Text>
          </View>
        </AnimatedPressable>

        {/* Histórico */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text }}>Histórico</Text>
          {MOCK_OCORRENCIAS.map((oc) => {
            const dateDisplay = formatDate(oc.date);
            return (
              <Card key={oc.id} style={{ gap: 6 }}>
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textTertiary }}>
                  {dateDisplay}
                </Text>
                <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text, lineHeight: 22 }}>
                  {oc.text}
                </Text>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
