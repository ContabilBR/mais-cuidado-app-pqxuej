import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { MOCK_CUIDADORES } from '@/data/mock';
import { useAuth } from '@/contexts/AuthContext';
import { Star, FileText, Check, Edit, LogOut } from 'lucide-react-native';

export default function PerfilCuidadorScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const cuidador = MOCK_CUIDADORES[0];

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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: FONTS.extraBold, fontSize: 26, color: COLORS.text, letterSpacing: -0.3 }}>
            Meu Perfil
          </Text>
          <AnimatedPressable
            onPress={() => {
              console.log('[PerfilCuidador] Botão de logout pressionado');
              logout();
            }}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: COLORS.dangerMuted,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogOut size={20} color={COLORS.danger} />
            </View>
          </AnimatedPressable>
        </View>

        {loading ? (
          <>
            <Card><SkeletonCard /></Card>
            <Card><SkeletonCard /></Card>
          </>
        ) : (
          <>
            {/* Profile header */}
            <Card style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}>
              <Avatar name={cuidador.name} imageUrl={cuidador.photo} size={96} />
              <View style={{ alignItems: 'center', gap: 6 }}>
                <Text style={{ fontFamily: FONTS.extraBold, fontSize: 22, color: COLORS.text }}>{cuidador.name}</Text>
                {cuidador.verified ? <VerifiedBadge size="md" /> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  {renderStars(cuidador.rating)}
                  <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, marginLeft: 4 }}>
                    {String(cuidador.rating.toFixed(1))}
                  </Text>
                  <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary }}>
                    ({cuidador.reviewCount} avaliações)
                  </Text>
                </View>
              </View>
              <AnimatedPressable
                onPress={() => console.log('[PerfilCuidador] Botão "Editar perfil" pressionado')}
                accessibilityRole="button"
                accessibilityLabel="Editar perfil"
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: COLORS.primaryMuted,
                    borderRadius: 10,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    minHeight: 44,
                  }}
                >
                  <Edit size={16} color={COLORS.primary} />
                  <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.primary }}>Editar perfil</Text>
                </View>
              </AnimatedPressable>
            </Card>

            {/* Verification status */}
            <Card
              style={{
                backgroundColor: cuidador.verified ? COLORS.verifiedBg : COLORS.warningMuted,
                borderColor: cuidador.verified ? COLORS.verified : COLORS.warning,
                gap: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                  color: cuidador.verified ? COLORS.verified : COLORS.warning,
                }}
              >
                {cuidador.verified ? '✓ Perfil verificado' : '⏳ Verificação em andamento'}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.regular,
                  fontSize: 14,
                  color: cuidador.verified ? COLORS.verified : COLORS.warning,
                  lineHeight: 20,
                }}
              >
                {cuidador.verified
                  ? 'Seus documentos foram verificados. Famílias podem confiar no seu perfil.'
                  : 'Seus documentos estão sendo analisados. Isso pode levar até 3 dias úteis.'}
              </Text>
            </Card>

            {/* Bio */}
            <Card style={{ gap: 10 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Experiência</Text>
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

            {/* Documents */}
            <Card style={{ gap: 12 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Documentos enviados</Text>
              {cuidador.documents.map((doc) => (
                <View key={doc} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: COLORS.verifiedBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={14} color={COLORS.verified} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <FileText size={14} color={COLORS.textSecondary} />
                    <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text }}>{doc}</Text>
                  </View>
                </View>
              ))}
            </Card>

            {/* References */}
            <Card style={{ gap: 12 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Referências</Text>
              {cuidador.references.map((ref) => (
                <View key={ref} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary }} />
                  <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary }}>{ref}</Text>
                </View>
              ))}
            </Card>

            {/* Reviews */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text }}>Avaliações recebidas</Text>
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
          </>
        )}
      </ScrollView>
    </View>
  );
}
