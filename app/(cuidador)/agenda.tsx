import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { Calendar, Clock, User } from 'lucide-react-native';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const FULL_DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const UPCOMING = [
  { id: 'a1', family: 'Família Souza', date: 'Hoje', time: '08:00 - 18:00', idoso: 'José Souza' },
  { id: 'a2', family: 'Família Souza', date: 'Amanhã', time: '08:00 - 18:00', idoso: 'José Souza' },
];

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [availability, setAvailability] = useState<Record<number, boolean>>({
    0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  const toggleAvailability = (day: number) => {
    console.log('[Agenda] Disponibilidade alterada para dia:', FULL_DAYS[day]);
    setAvailability((prev) => ({ ...prev, [day]: !prev[day] }));
  };

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
        <Text style={{ fontFamily: FONTS.extraBold, fontSize: 26, color: COLORS.text, letterSpacing: -0.3 }}>
          Minha Agenda
        </Text>

        {/* Week strip */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {weekDays.map((day, index) => {
            const isSelected = selectedDay === index;
            const dayNum = day.getDate();
            return (
              <AnimatedPressable
                key={index}
                onPress={() => {
                  console.log('[Agenda] Dia selecionado:', DAYS[index]);
                  setSelectedDay(index);
                }}
                accessibilityRole="button"
                accessibilityLabel={FULL_DAYS[index]}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: isSelected ? COLORS.primary : COLORS.surface,
                    borderWidth: 1,
                    borderColor: isSelected ? COLORS.primary : COLORS.border,
                    gap: 4,
                    minHeight: 60,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.semiBold,
                      fontSize: 11,
                      color: isSelected ? 'rgba(255,255,255,0.8)' : COLORS.textTertiary,
                    }}
                  >
                    {DAYS[index]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 16,
                      color: isSelected ? COLORS.white : COLORS.text,
                    }}
                  >
                    {String(dayNum)}
                  </Text>
                </View>
              </AnimatedPressable>
            );
          })}
        </View>

        {/* Selected day info */}
        {loading ? (
          <Card><SkeletonCard /></Card>
        ) : (
          <Card style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} color={COLORS.primary} />
              <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text }}>
                {FULL_DAYS[selectedDay]}
              </Text>
            </View>
            {UPCOMING.filter((_, i) => i === 0).map((appt) => (
              <View key={appt.id} style={{ backgroundColor: COLORS.primaryMuted, borderRadius: 10, padding: 14, gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <User size={14} color={COLORS.primary} />
                  <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text }}>{appt.idoso}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} color={COLORS.textSecondary} />
                  <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary }}>{appt.time}</Text>
                </View>
                <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textTertiary }}>{appt.family}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Availability */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text }}>Minha disponibilidade</Text>
          <Card style={{ gap: 0 }}>
            {FULL_DAYS.map((day, index) => (
              <View key={day}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 14,
                    paddingHorizontal: 4,
                    minHeight: 52,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.text }}>{day}</Text>
                  <Switch
                    value={availability[index]}
                    onValueChange={() => toggleAvailability(index)}
                    trackColor={{ false: COLORS.border, true: COLORS.primaryMutedStrong }}
                    thumbColor={availability[index] ? COLORS.primary : COLORS.textTertiary}
                  />
                </View>
                {index < FULL_DAYS.length - 1 ? (
                  <View style={{ height: 1, backgroundColor: COLORS.divider }} />
                ) : null}
              </View>
            ))}
          </Card>
        </View>

        {/* Upcoming */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text }}>Próximos atendimentos</Text>
          {UPCOMING.map((appt) => (
            <Card key={appt.id} style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text }}>{appt.idoso}</Text>
                <View style={{ backgroundColor: COLORS.primaryMuted, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.primary }}>{appt.date}</Text>
                </View>
              </View>
              <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary }}>{appt.family}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Clock size={14} color={COLORS.textTertiary} />
                <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary }}>{appt.time}</Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
