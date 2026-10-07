import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
}

export function Card({ children, style, padding = 16 }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding,
          borderWidth: 1,
          borderColor: COLORS.border,
          boxShadow: `0 2px 8px ${COLORS.shadow}`,
          borderCurve: 'continuous',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
