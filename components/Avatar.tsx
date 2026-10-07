import React from 'react';
import { View, Text, Image } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { ImageSourcePropType } from 'react-native';

function resolveImageSource(source: string | number | ImageSourcePropType | undefined): ImageSourcePropType {
  if (!source) return { uri: '' };
  if (typeof source === 'string') return { uri: source };
  return source as ImageSourcePropType;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: number;
}

export function Avatar({ name, imageUrl, size = 48 }: AvatarProps) {
  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.35);

  if (imageUrl) {
    return (
      <Image
        source={resolveImageSource(imageUrl)}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: COLORS.surfaceSecondary,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: COLORS.primaryMuted,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: COLORS.primary,
          fontFamily: FONTS.bold,
          fontSize,
          lineHeight: fontSize * 1.2,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
