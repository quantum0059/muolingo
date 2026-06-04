import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useLanguageStoreHydration } from "@/hooks/use-language-store-hydration";
import { useLanguageStore } from "@/store/language";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const hasLanguageStoreHydrated = useLanguageStoreHydration();
  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId
  );

  if (!isLoaded || !hasLanguageStoreHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C47FF" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguageId) {
    return <Redirect href="/language" />;
  }

  return <Redirect href="/(tabs)" />;
}
