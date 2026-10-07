import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { WifiOff } from 'lucide-react-native';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const translateY = React.useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || state.isInternetReachable === false;
      setIsOffline(offline);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOffline ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOffline, translateY]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        backgroundColor: COLORS.warning,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <WifiOff size={16} color={COLORS.white} />
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: 14,
          color: COLORS.white,
          flex: 1,
          lineHeight: 20,
        }}
      >
        Sem internet agora. Guardamos seu registro e enviamos depois.
      </Text>
    </Animated.View>
  );
}
