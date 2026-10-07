import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md';
}

export function VerifiedBadge({ size = 'md' }: VerifiedBadgeProps) {
  const isSmall = size === 'sm';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.verifiedBg,
        borderRadius: 20,
        paddingHorizontal: isSmall ? 6 : 8,
        paddingVertical: isSmall ? 2 : 4,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          color: COLORS.verified,
          fontFamily: FONTS.semiBold,
          fontSize: isSmall ? 11 : 13,
          lineHeight: isSmall ? 16 : 18,
        }}
      >
        Verificado ✓
      </Text>
    </View>
  );
}
