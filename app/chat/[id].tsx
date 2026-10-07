import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/Typography';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SyncIndicator } from '@/components/SyncIndicator';
import { MOCK_MESSAGES, MOCK_CONVERSAS } from '@/data/mock';
import { Send } from 'lucide-react-native';

type Message = {
  id: string;
  senderId: string;
  text: string;
  time: string;
  date: string;
};

const MY_ID = 'f1';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const conv = MOCK_CONVERSAS.find((c) => c.id === id);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    console.log('[Chat] Mensagem enviada:', inputText.trim());
    const newMsg: Message = {
      id: `msg${Date.now()}`,
      senderId: MY_ID,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: 'Hoje',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.senderId === MY_ID;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          marginBottom: 8,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            maxWidth: '75%',
            backgroundColor: isOwn ? COLORS.primary : COLORS.surface,
            borderRadius: 16,
            borderBottomRightRadius: isOwn ? 4 : 16,
            borderBottomLeftRadius: isOwn ? 16 : 4,
            padding: 12,
            borderWidth: isOwn ? 0 : 1,
            borderColor: COLORS.border,
            gap: 4,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 16,
              color: isOwn ? COLORS.white : COLORS.text,
              lineHeight: 22,
            }}
          >
            {item.text}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 11,
              color: isOwn ? 'rgba(255,255,255,0.65)' : COLORS.textTertiary,
              alignSelf: 'flex-end',
            }}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  const convName = conv?.name ?? 'Conversa';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: convName,
          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              <SyncIndicator status="synced" />
            </View>
          ),
        }}
      />

      <OfflineBanner />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 16,
        }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
      />

      {/* Input bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 10,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}
      >
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escreva uma mensagem..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          style={{
            flex: 1,
            backgroundColor: COLORS.surfaceSecondary,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            fontFamily: FONTS.regular,
            fontSize: 16,
            color: COLORS.text,
            maxHeight: 120,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim()}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensagem"
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: inputText.trim() ? COLORS.primary : COLORS.surfaceTertiary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={20} color={inputText.trim() ? COLORS.white : COLORS.textTertiary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
