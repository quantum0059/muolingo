import { useAuth, useClerk } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import { images } from "@/constants/images";

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C47FF" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
      router.replace("/onboarding");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <Image
        source={images.mascotLogo}
        className="h-16 w-40"
        resizeMode="contain"
        accessibilityLabel="muolingo logo"
      />
      <Text className="text--h1 text-foreground">muolingo</Text>
      <Text className="text--body-md text-center text-secondary">
        Learn languages with your AI teacher
      </Text>
      <Pressable
        onPress={handleSignOut}
        disabled={isSigningOut}
        className="mt-4 rounded-2xl border border-border px-8 py-3 active:opacity-90"
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        {isSigningOut ? (
          <ActivityIndicator color="#6C47FF" />
        ) : (
          <Text className="text--body-md text-center text-secondary">
            Sign Out
          </Text>
        )}
      </Pressable>
    </View>
  );
}
