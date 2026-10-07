import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/Colors';

export default function Index() {
  const { authState, profile } = useAuth();

  if (authState === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (authState === 'unauthenticated' || authState === 'phone_entry') {
    return <Redirect href="/auth/welcome" />;
  }

  if (authState === 'code_verification') {
    return <Redirect href="/auth/verify" />;
  }

  if (authState === 'profile_selection') {
    return <Redirect href="/auth/profile-select" />;
  }

  if (authState === 'lgpd_consent') {
    return <Redirect href="/auth/lgpd" />;
  }

  if (authState === 'authenticated') {
    if (profile === 'familia') {
      return <Redirect href="/(familia)/inicio" />;
    }
    if (profile === 'cuidador') {
      return <Redirect href="/(cuidador)/hoje" />;
    }
  }

  return <Redirect href="/auth/welcome" />;
}
