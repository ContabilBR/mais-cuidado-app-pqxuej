import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { MOCK_CUIDADORES } from '@/data/mock';
import { Star, MapPin, Clock, FileText, Check, MessageCircle, UserPlus } from 'lucide-react-native';
import { ImageSourcePropType } from 'react-native';

function resolveImageSource(source: string | number | ImageSourcePropType | undefined): ImageSourcePropType {
  if (!source) return { uri: '' };
  if (typeof source === 'string') return { uri: source };
  return source as ImageSourcePropType;
}

export default function CuidadorPerfilScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cuidador = MOCK_CUIDADORES.find((c) => c.id === id) ?? MOCK_CUIDADORES[0];

  const renderStars = (rating: number) => {
    const stars: React.ReactNode[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={i <= Math.round(rating) ? COLORS.warning : COLORS.border}
          fill={i <= Math.round(rating) ? COLORS.warning : 'transparent'}
        />
      );
    }
    return stars;
  };

  const ratingText = cuidador.rating > 0 ? String(cuidador.rating.toFixed(1)) : 'Novo';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack.Screen options={{ title: cuidador.name }} />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={{ position: 'relative' }}>
          <Image
            source={resolveImageSource(cuidador.photo)}
            style={{ width: '100%', height: 280, backgroundColor: COLORS.surfaceSecondary }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 20,
              paddingBottom: 24,
              backgroundColor: 'rgba(26,46,43,0.5)',
            }}
          >
            <View style={{ gap: 6 }}>
              <Text style={{ fontFamily: FONTS.extraBold, fontSize: 26, color: COLORS.white, letterSpacing: -0.3 }}>
                {cuidador.name}
              </Text>
              {cuidador.verified ? <VerifiedBadge size="md" /> : null}
              {cuidador.rating > 0 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  {renderStars(cuidador.rating)}
                  <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.white, marginLeft: 4 }}>
                    {ratingText}
                  </Text>
                  <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    ({cuidador.reviewCount})
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 16 }}>
          {/* Info chips */}
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surface, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border }}>
              <MapPin size={13} color={COLORS.textSecondary} />
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary }}>{cuidador.region}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surface, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border }}>
              <Clock size={13} color={COLORS.textSecondary} />
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary }}>{cuidador.availability}</Text>
            </View>
          </View>

          {/* Bio */}
          <Card style={{ gap: 10 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Sobre</Text>
            <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 }}>
              {cuidador.bio}
            </Text>
          </Card>

          {/* Specialties */}
          <Card style={{ gap: 12 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Especialidades</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {cuidador.specialties.map((spec) => (
                <View
                  key={spec}
                  style={{
                    backgroundColor: COLORS.primaryMuted,
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.primary }}>{spec}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Experience */}
          <Card style={{ gap: 8 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Experiência</Text>
            <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 }}>
              {cuidador.experience}
            </Text>
          </Card>

          {/* Documents */}
          <Card style={{ gap: 12 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Documentos</Text>
            {cuidador.documents.map((doc) => (
              <View key={doc} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: COLORS.verifiedBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={13} color={COLORS.verified} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FileText size={14} color={COLORS.textSecondary} />
                  <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text }}>{doc}</Text>
                </View>
              </View>
            ))}
          </Card>

          {/* References */}
          {cuidador.references.length > 0 ? (
            <Card style={{ gap: 12 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Referências</Text>
              {cuidador.references.map((ref) => (
                <View key={ref} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary }} />
                  <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary }}>{ref}</Text>
                </View>
              ))}
            </Card>
          ) : null}

          {/* Reviews */}
          {cuidador.reviews.length > 0 ? (
            <View style={{ gap: 12 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text }}>Avaliações</Text>
              {cuidador.reviews.map((review, index) => (
                <Card key={index} style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text }}>{review.author}</Text>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 }}>
                    {review.text}
                  </Text>
                  <Text style={{ fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textTertiary }}>
                    {review.date}
                  </Text>
                </Card>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 16,
          paddingTop: 16,
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <AnimatedPressable
          onPress={() => {
            console.log('[CuidadorPerfil] Botão "Conversar" pressionado para:', cuidador.name);
            router.push('/chat/conv1');
          }}
          accessibilityRole="button"
          accessibilityLabel="Conversar com cuidador"
          style={{ flex: 1 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: COLORS.accentMuted,
              borderRadius: 14,
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.accent,
            }}
          >
            <MessageCircle size={18} color={COLORS.accent} />
            <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.accent }}>Conversar</Text>
          </View>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => {
            console.log('[CuidadorPerfil] Botão "Solicitar cuidador" pressionado para:', cuidador.name);
            router.push('/(familia)/pedido/novo');
          }}
          accessibilityRole="button"
          accessibilityLabel="Solicitar este cuidador"
          style={{ flex: 1 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: COLORS.primary,
              borderRadius: 14,
              height: 52,
            }}
          >
            <UserPlus size={18} color={COLORS.white} />
            <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.white }}>Solicitar</Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}
