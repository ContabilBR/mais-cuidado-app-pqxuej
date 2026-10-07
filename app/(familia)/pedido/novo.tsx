import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react-native';

const CARE_TYPES = [
  'Cuidados básicos',
  'Alzheimer/Demência',
  'Pós-cirúrgico',
  'Reabilitação',
  'Cuidados paliativos',
  'Acompanhamento médico',
];

const SCHEDULES = [
  'Período integral',
  'Período parcial manhã',
  'Período parcial tarde',
  'Pernoite',
  'Fins de semana',
];

const TOTAL_STEPS = 4;

export default function NovoPedidoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [region, setRegion] = useState('');

  const toggleCareType = (type: string) => {
    console.log('[NovoPedido] Tipo de cuidado selecionado:', type);
    setSelectedCareTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleNext = () => {
    console.log('[NovoPedido] Próximo passo:', step + 1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = () => {
    console.log('[NovoPedido] Pedido enviado:', { selectedCareTypes, selectedSchedule, region });
    Alert.alert('Pedido enviado!', 'Entraremos em contato com cuidadores disponíveis na sua região.');
    router.back();
  };

  const canProceed =
    (step === 1 && selectedCareTypes.length > 0) ||
    (step === 2 && selectedSchedule !== null) ||
    (step === 3 && region.trim().length > 0) ||
    step === 4;

  const stepLabel = `${step}/${TOTAL_STEPS}`;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Progress */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textSecondary }}>
            Passo {stepLabel}
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: i < step ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i < step ? COLORS.primary : COLORS.surfaceTertiary,
                }}
              />
            ))}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: insets.bottom + 120,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <View style={{ gap: 16 }}>
            <Text style={{ fontFamily: FONTS.extraBold, fontSize: 24, color: COLORS.text, letterSpacing: -0.3, lineHeight: 32 }}>
              Que tipo de cuidado você precisa?
            </Text>
            <View style={{ gap: 10 }}>
              {CARE_TYPES.map((type) => {
                const isSelected = selectedCareTypes.includes(type);
                return (
                  <AnimatedPressable
                    key={type}
                    onPress={() => toggleCareType(type)}
                    accessibilityRole="checkbox"
                    accessibilityLabel={type}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        backgroundColor: isSelected ? COLORS.primaryMuted : COLORS.surface,
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1.5,
                        borderColor: isSelected ? COLORS.primary : COLORS.border,
                        minHeight: 56,
                      }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          borderWidth: 2,
                          borderColor: isSelected ? COLORS.primary : COLORS.border,
                          backgroundColor: isSelected ? COLORS.primary : COLORS.surface,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected ? <Check size={14} color={COLORS.white} /> : null}
                      </View>
                      <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.text, flex: 1 }}>
                        {type}
                      </Text>
                    </View>
                  </AnimatedPressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {step === 2 ? (
          <View style={{ gap: 16 }}>
            <Text style={{ fontFamily: FONTS.extraBold, fontSize: 24, color: COLORS.text, letterSpacing: -0.3, lineHeight: 32 }}>
              Qual horário?
            </Text>
            <View style={{ gap: 10 }}>
              {SCHEDULES.map((sched) => {
                const isSelected = selectedSchedule === sched;
                return (
                  <AnimatedPressable
                    key={sched}
                    onPress={() => {
                      console.log('[NovoPedido] Horário selecionado:', sched);
                      setSelectedSchedule(sched);
                    }}
                    accessibilityRole="radio"
                    accessibilityLabel={sched}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        backgroundColor: isSelected ? COLORS.primaryMuted : COLORS.surface,
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1.5,
                        borderColor: isSelected ? COLORS.primary : COLORS.border,
                        minHeight: 56,
                      }}
                    >
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          borderWidth: 2,
                          borderColor: isSelected ? COLORS.primary : COLORS.border,
                          backgroundColor: isSelected ? COLORS.primary : COLORS.surface,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.white }} /> : null}
                      </View>
                      <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.text, flex: 1 }}>
                        {sched}
                      </Text>
                    </View>
                  </AnimatedPressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {step === 3 ? (
          <View style={{ gap: 16 }}>
            <Text style={{ fontFamily: FONTS.extraBold, fontSize: 24, color: COLORS.text, letterSpacing: -0.3, lineHeight: 32 }}>
              Qual região?
            </Text>
            <TextInput
              value={region}
              onChangeText={setRegion}
              placeholder="Ex: Vila Mariana, São Paulo"
              placeholderTextColor={COLORS.textTertiary}
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 14,
                padding: 16,
                fontFamily: FONTS.regular,
                fontSize: 16,
                color: COLORS.text,
                borderWidth: 1.5,
                borderColor: region ? COLORS.primary : COLORS.border,
                minHeight: 56,
              }}
              autoFocus
            />
          </View>
        ) : null}

        {step === 4 ? (
          <View style={{ gap: 16 }}>
            <Text style={{ fontFamily: FONTS.extraBold, fontSize: 24, color: COLORS.text, letterSpacing: -0.3, lineHeight: 32 }}>
              Confirmar pedido
            </Text>
            <View style={{ backgroundColor: COLORS.surface, borderRadius: 14, padding: 20, gap: 14, borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ gap: 4 }}>
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textTertiary }}>TIPOS DE CUIDADO</Text>
                <Text style={{ fontFamily: FONTS.regular, fontSize: 16, color: COLORS.text, lineHeight: 24 }}>
                  {selectedCareTypes.join(', ')}
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: COLORS.divider }} />
              <View style={{ gap: 4 }}>
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textTertiary }}>HORÁRIO</Text>
                <Text style={{ fontFamily: FONTS.regular, fontSize: 16, color: COLORS.text }}>{selectedSchedule}</Text>
              </View>
              <View style={{ height: 1, backgroundColor: COLORS.divider }} />
              <View style={{ gap: 4 }}>
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textTertiary }}>REGIÃO</Text>
                <Text style={{ fontFamily: FONTS.regular, fontSize: 16, color: COLORS.text }}>{region}</Text>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom navigation */}
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
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <AnimatedPressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={{ flex: 1 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: COLORS.surfaceSecondary,
              borderRadius: 14,
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <ChevronLeft size={18} color={COLORS.text} />
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.text }}>Voltar</Text>
          </View>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={step === TOTAL_STEPS ? handleSubmit : handleNext}
          disabled={!canProceed}
          accessibilityRole="button"
          accessibilityLabel={step === TOTAL_STEPS ? 'Enviar pedido' : 'Próximo'}
          style={{ flex: 2 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: canProceed ? COLORS.primary : COLORS.surfaceTertiary,
              borderRadius: 14,
              height: 52,
            }}
          >
            <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: canProceed ? COLORS.white : COLORS.textTertiary }}>
              {step === TOTAL_STEPS ? 'Enviar pedido' : 'Próximo'}
            </Text>
            {step < TOTAL_STEPS ? <ChevronRight size={18} color={canProceed ? COLORS.white : COLORS.textTertiary} /> : null}
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}
