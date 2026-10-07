import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { AlertCircle } from 'lucide-react-native';

export function LegalDisclaimer() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        padding: 12,
        backgroundColor: COLORS.surfaceSecondary,
        borderRadius: 10,
        marginTop: 8,
      }}
    >
      <AlertCircle size={14} color={COLORS.textTertiary} style={{ marginTop: 2 }} />
      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: 12,
          color: COLORS.textTertiary,
          flex: 1,
          lineHeight: 18,
        }}
      >
        O Mais Cuidado não é empregador nem presta atendimento médico. Em caso de emergência, ligue para o SAMU: 192.
      </Text>
    </View>
  );
}
