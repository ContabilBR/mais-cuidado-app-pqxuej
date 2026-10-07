import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { Plus, Check } from 'lucide-react-native';

export default function NovoIdosoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');

  const handleSave = () => {
    console.log('[NovoIdoso] Botão "Cadastrar" pressionado, nome:', name);
    if (!name.trim() || !age.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o nome e a idade.');
      return;
    }
    Alert.alert('Cadastrado!', `${name} foi cadastrado com sucesso.`);
    router.back();
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const isValid = name.trim().length > 0 && age.trim().length > 0;

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 20,
      }}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <Card style={{ gap: 16 }}>
        <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Dados pessoais</Text>

        {[
          { label: 'Nome completo *', value: name, onChange: setName, placeholder: 'Ex: José da Silva' },
          { label: 'Idade *', value: age, onChange: setAge, placeholder: 'Ex: 78', keyboardType: 'number-pad' as const },
        ].map((field) => (
          <View key={field.label} style={{ gap: 6 }}>
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textSecondary }}>{field.label}</Text>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.placeholder}
              placeholderTextColor={COLORS.textTertiary}
              keyboardType={field.keyboardType}
              style={{
                backgroundColor: COLORS.surfaceSecondary,
                borderRadius: 10,
                padding: 14,
                fontFamily: FONTS.regular,
                fontSize: 16,
                color: COLORS.text,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            />
          </View>
        ))}
      </Card>

      <Card style={{ gap: 14 }}>
        <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Condições de saúde</Text>
        {conditions.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {conditions.map((cond, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: COLORS.primaryMuted,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.primary }}>{cond}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            value={newCondition}
            onChangeText={setNewCondition}
            placeholder="Ex: Hipertensão, Diabetes..."
            placeholderTextColor={COLORS.textTertiary}
            style={{
              flex: 1,
              backgroundColor: COLORS.surfaceSecondary,
              borderRadius: 10,
              padding: 12,
              fontFamily: FONTS.regular,
              fontSize: 15,
              color: COLORS.text,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          />
          <TouchableOpacity
            onPress={addCondition}
            accessibilityLabel="Adicionar condição"
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={{ gap: 16 }}>
        <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Contato de emergência</Text>
        {[
          { label: 'Nome', value: emergencyName, onChange: setEmergencyName, placeholder: 'Nome do contato' },
          { label: 'Telefone', value: emergencyPhone, onChange: setEmergencyPhone, placeholder: '(11) 99999-9999' },
          { label: 'Parentesco', value: emergencyRelation, onChange: setEmergencyRelation, placeholder: 'Ex: Filho, Filha...' },
        ].map((field) => (
          <View key={field.label} style={{ gap: 6 }}>
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textSecondary }}>{field.label}</Text>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.placeholder}
              placeholderTextColor={COLORS.textTertiary}
              style={{
                backgroundColor: COLORS.surfaceSecondary,
                borderRadius: 10,
                padding: 14,
                fontFamily: FONTS.regular,
                fontSize: 16,
                color: COLORS.text,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            />
          </View>
        ))}
      </Card>

      <AnimatedPressable
        onPress={handleSave}
        disabled={!isValid}
        accessibilityRole="button"
        accessibilityLabel="Cadastrar idoso"
      >
        <View
          style={{
            backgroundColor: isValid ? COLORS.primary : COLORS.surfaceTertiary,
            borderRadius: 14,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <Check size={20} color={isValid ? COLORS.white : COLORS.textTertiary} />
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18, color: isValid ? COLORS.white : COLORS.textTertiary }}>
            Cadastrar
          </Text>
        </View>
      </AnimatedPressable>
    </ScrollView>
  );
}
