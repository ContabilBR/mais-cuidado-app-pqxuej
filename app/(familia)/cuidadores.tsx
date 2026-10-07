import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { EmptyState } from '@/components/EmptyState';
import { MOCK_CUIDADORES } from '@/data/mock';
import { Star, MapPin, Clock, Users, Search } from 'lucide-react-native';

type FilterType = 'todos' | 'verificados' | 'disponiveis';

export default function CuidadoresScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('todos');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'verificados', label: 'Verificados' },
    { key: 'disponiveis', label: 'Disponíveis' },
  ];

  const filteredCuidadores = MOCK_CUIDADORES.filter((c) => {
    if (filter === 'verificados') return c.verified;
    if (filter === 'disponiveis') return c.verified;
    return true;
  }).sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));

  const renderStars = (rating: number) => {
    const stars: React.ReactNode[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          color={i <= Math.round(rating) ? COLORS.warning : COLORS.border}
          fill={i <= Math.round(rating) ? COLORS.warning : 'transparent'}
        />
      );
    }
    return stars;
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: FONTS.extraBold, fontSize: 26, color: COLORS.text, letterSpacing: -0.3 }}>
            Cuidadores
          </Text>
          <AnimatedPressable
            onPress={() => {
              console.log('[Cuidadores] Botão "Encontrar cuidador" pressionado');
              router.push('/(familia)/pedido/novo');
            }}
            accessibilityRole="button"
            accessibilityLabel="Encontrar cuidador"
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: COLORS.accent,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                minHeight: 44,
              }}
            >
              <Search size={16} color={COLORS.white} />
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.white }}>
                Encontrar
              </Text>
            </View>
          </AnimatedPressable>
        </View>

        {/* Filter chips */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {filters.map((f) => {
            const isActive = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => {
                  console.log('[Cuidadores] Filtro selecionado:', f.key);
                  setFilter(f.key);
                }}
                accessibilityRole="button"
                accessibilityLabel={f.label}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isActive ? COLORS.primary : COLORS.surface,
                  borderWidth: 1,
                  borderColor: isActive ? COLORS.primary : COLORS.border,
                  minHeight: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.semiBold,
                    fontSize: 14,
                    color: isActive ? COLORS.white : COLORS.textSecondary,
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List */}
        {loading ? (
          <>
            <Card><SkeletonCard /></Card>
            <Card><SkeletonCard /></Card>
            <Card><SkeletonCard /></Card>
          </>
        ) : filteredCuidadores.length === 0 ? (
          <EmptyState
            icon={<Users size={36} color={COLORS.primary} />}
            title="Nenhum cuidador encontrado"
            subtitle="Tente mudar os filtros ou buscar por outra região."
          />
        ) : (
          filteredCuidadores.map((cuidador) => {
            const ratingText = cuidador.rating > 0 ? String(cuidador.rating.toFixed(1)) : 'Novo';
            const reviewText = cuidador.reviewCount > 0 ? `(${cuidador.reviewCount})` : '';

            return (
              <Card key={cuidador.id} style={{ gap: 14 }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                  <Avatar name={cuidador.name} imageUrl={cuidador.photo} size={60} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>
                        {cuidador.name}
                      </Text>
                      {cuidador.verified ? <VerifiedBadge size="sm" /> : null}
                    </View>
                    {cuidador.rating > 0 ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        {renderStars(cuidador.rating)}
                        <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginLeft: 2 }}>
                          {ratingText}
                        </Text>
                        <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary }}>
                          {reviewText}
                        </Text>
                      </View>
                    ) : null}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <MapPin size={13} color={COLORS.textTertiary} />
                      <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary }}>
                        {cuidador.region}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} color={COLORS.textTertiary} />
                      <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary }}>
                        {cuidador.availability}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Specialties */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {cuidador.specialties.map((spec) => (
                    <View
                      key={spec}
                      style={{
                        backgroundColor: COLORS.primaryMuted,
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                      }}
                    >
                      <Text style={{ fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.primary }}>
                        {spec}
                      </Text>
                    </View>
                  ))}
                </View>

                <AnimatedPressable
                  onPress={() => {
                    console.log('[Cuidadores] Botão "Ver perfil" pressionado para:', cuidador.name);
                    router.push(`/cuidador-perfil/${cuidador.id}`);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver perfil de ${cuidador.name}`}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.primaryMuted,
                      borderRadius: 10,
                      paddingVertical: 12,
                      alignItems: 'center',
                      minHeight: 48,
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.primary }}>
                      Ver perfil
                    </Text>
                  </View>
                </AnimatedPressable>
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
