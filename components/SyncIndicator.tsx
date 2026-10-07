import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Check, Clock } from 'lucide-react-native';

interface SyncIndicatorProps {
  status: 'syncing' | 'synced' | 'pending';
}

export function SyncIndicator({ status }: SyncIndicatorProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'syncing') {
      const anim = Animated.loop(
        Animated.timing(rotation, { toValue: 1, duration: 1000, useNativeDriver: true })
      );
      anim.start();
      return () => anim.stop();
    }
    rotation.setValue(0);
    return undefined;
  }, [status, rotation]);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  let bgColor: string;
  let textColor: string;
  let labelText: string;

  if (status === 'synced') {
    bgColor = COLORS.verifiedBg;
    textColor = COLORS.verified;
    labelText = 'Sincronizado ✓';
  } else if (status === 'pending') {
    bgColor = COLORS.warningMuted;
    textColor = COLORS.warning;
    labelText = 'Pendente';
  } else {
    bgColor = COLORS.primaryMuted;
    textColor = COLORS.primary;
    labelText = 'Sincronizando...';
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: bgColor,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        gap: 4,
      }}
    >
      {status === 'syncing' ? (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Clock size={12} color={textColor} />
        </Animated.View>
      ) : status === 'synced' ? (
        <Check size={12} color={textColor} />
      ) : (
        <Clock size={12} color={textColor} />
      )}
      <Text style={{ fontFamily: FONTS.semiBold, fontSize: 12, color: textColor, lineHeight: 16 }}>
        {labelText}
      </Text>
    </View>
  );
}
