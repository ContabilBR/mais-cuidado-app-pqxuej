import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Avatar } from '@/components/Avatar';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { EmptyState } from '@/components/EmptyState';
import { MOCK_CONVERSAS } from '@/data/mock';
import { MessageCircle } from 'lucide-react-native';

export default function CuidadorConversasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
        <Text style={{ fontFamily: FONTS.extraBold, fontSize: 26, color: COLORS.text, letterSpacing: -0.3 }}>
          Conversas
        </Text>

        {loading ? (
          <>
            <View style={{ backgroundColor: COLORS.surface, borderRadius: 16, overflow: 'hidden' }}>
              <SkeletonCard />
            </View>
            <View style={{ backgroundColor: COLORS.surface, borderRadius: 16, overflow: 'hidden' }}>
              <SkeletonCard />
            </View>
          </>
        ) : MOCK_CONVERSAS.length === 0 ? (
          <EmptyState
            icon={<MessageCircle size={36} color={COLORS.primary} />}
            title="Nenhuma conversa ainda"
            subtitle="Quando uma família entrar em contato, as conversas aparecerão aqui."
          />
        ) : (
          MOCK_CONVERSAS.map((conv) => (
            <AnimatedPressable
              key={conv.id}
              onPress={() => {
                console.log('[CuidadorConversas] Conversa selecionada:', conv.name);
                router.push(`/chat/${conv.id}`);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Conversa com ${conv.name}`}
            >
              <View
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Avatar name={conv.name} imageUrl={conv.photo} size={52} />
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text }}>
                      {conv.name}
                    </Text>
                    <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textTertiary }}>
                      {conv.time}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: COLORS.primaryMuted, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' }}>
                    <Text style={{ fontFamily: FONTS.semiBold, fontSize: 11, color: COLORS.primary }}>
                      {conv.role}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                    <Text
                      style={{ fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, flex: 1 }}
                      numberOfLines={1}
                    >
                      {conv.lastMessage}
                    </Text>
                    {conv.unread > 0 ? (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: COLORS.accent,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: 8,
                        }}
                      >
                        <Text style={{ fontFamily: FONTS.bold, fontSize: 11, color: COLORS.white }}>
                          {String(conv.unread)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </AnimatedPressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
