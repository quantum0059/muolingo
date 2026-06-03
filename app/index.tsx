import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";

export default function Index() {
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
      <Link href="/onboarding" asChild>
        <Pressable className="mt-4 rounded-2xl bg-lingua-purple px-6 py-3 active:opacity-90">
          <Text className="text--body-lg text-white">Open onboarding</Text>
        </Pressable>
      </Link>
    </View>
  );
}
