import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { Card } from '@/components/Card';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { MOCK_IDOSOS } from '@/data/mock';
import { Plus, Trash2, Check } from 'lucide-react-native';

export default function IdosoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const idoso = MOCK_IDOSOS.find((i) => i.id === id) ?? MOCK_IDOSOS[0];

  const [name, setName] = useState(idoso.name);
  const [age, setAge] = useState(String(idoso.age));
  const [conditions, setConditions] = useState<string[]>(idoso.conditions);
  const [newCondition, setNewCondition] = useState('');
  const [emergencyName, setEmergencyName] = useState(idoso.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(idoso.emergencyContact.phone);
  const [emergencyRelation, setEmergencyRelation] = useState(idoso.emergencyContact.relation);

  const handleSave = () => {
    console.log('[IdosoDetail] Botão "Salvar" pressionado para idoso:', id);
    Alert.alert('Salvo!', 'Dados do idoso atualizados com sucesso.');
    router.back();
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

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

        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textSecondary }}>Nome completo</Text>
          <TextInput
            value={name}
            onChangeText={setName}
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

        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textSecondary }}>Idade</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
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
      </Card>

      <Card style={{ gap: 14 }}>
        <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Condições de saúde</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {conditions.map((cond, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: COLORS.primaryMuted,
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.primary }}>{cond}</Text>
              <TouchableOpacity onPress={() => removeCondition(index)} accessibilityLabel={`Remover ${cond}`}>
                <Trash2 size={12} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            value={newCondition}
            onChangeText={setNewCondition}
            placeholder="Adicionar condição..."
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
          { label: 'Nome', value: emergencyName, onChange: setEmergencyName },
          { label: 'Telefone', value: emergencyPhone, onChange: setEmergencyPhone },
          { label: 'Parentesco', value: emergencyRelation, onChange: setEmergencyRelation },
        ].map((field) => (
          <View key={field.label} style={{ gap: 6 }}>
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textSecondary }}>{field.label}</Text>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
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
        <Text style={{ fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text }}>Medicamentos</Text>
        {idoso.medications.map((med) => (
          <View
            key={med.id}
            style={{
              backgroundColor: COLORS.surfaceSecondary,
              borderRadius: 12,
              padding: 14,
              gap: 4,
            }}
          >
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text }}>{med.name}</Text>
            <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary }}>
              Horários: {med.schedule.join(', ')}
            </Text>
            <Text style={{ fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textTertiary }}>{med.notes}</Text>
          </View>
        ))}
      </Card>

      <AnimatedPressable
        onPress={handleSave}
        accessibilityRole="button"
        accessibilityLabel="Salvar dados do idoso"
      >
        <View
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 14,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <Check size={20} color={COLORS.white} />
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18, color: COLORS.white }}>Salvar</Text>
        </View>
      </AnimatedPressable>
    </ScrollView>
  );
}
