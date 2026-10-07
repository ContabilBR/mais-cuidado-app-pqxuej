import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { AnimatedPressable } from '@/components/AnimatedPressable';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ icon, title, subtitle, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: COLORS.primaryMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          fontFamily: FONTS.bold,
          fontSize: 18,
          color: COLORS.text,
          textAlign: 'center',
          lineHeight: 26,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 16,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
      {ctaLabel && onCta ? (
        <AnimatedPressable
          onPress={onCta}
          accessibilityRole="button"
          accessibilityLabel={ctaLabel}
          style={{ marginTop: 8 }}
        >
          <View
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 12,
              paddingHorizontal: 24,
              paddingVertical: 14,
              minHeight: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.white }}>
              {ctaLabel}
            </Text>
          </View>
        </AnimatedPressable>
      ) : null}
    </View>
  );
}
