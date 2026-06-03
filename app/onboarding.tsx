import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { type Href, Redirect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

const MASCOT_STAGE = {
  width: 320,
  height: 340,
} as const;

function SpeechBubble({
  label,
  className,
  textClassName,
  style,
}: {
  label: string;
  className: string;
  textClassName: string;
  style: ViewStyle;
}) {
  return (
    <View
      style={style}
      className={`rounded-2xl px-3.5 py-2 shadow-sm ${className}`}
    >
      <Text className={`text--body-sm font-medium ${textClassName}`}>
        {label}
      </Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" color="#6C47FF" />
        </View>
      </SafeAreaView>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 bg-background px-6">
        {/* Header logo */}
        <View className="mt-2 flex-row items-center justify-center gap-2">
          <Image
            source={images.mascotLogo}
            className="h-9 w-9"
            resizeMode="contain"
            accessibilityLabel="muolingo mascot"
          />
          <Text className="text--h4 text-foreground lowercase">muolingo</Text>
        </View>

        {/* Headline */}
        <View className="mt-8">
          <Text className="text--h1 text-foreground">
            Your AI language{" "}
            <Text className="text-lingua-purple">teacher.</Text>
          </Text>
          <Text className="text--body-lg mt-3 text-center text-secondary">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot + speech bubbles — positioned relative to fox, not screen edges */}
        <View className="mt-6 flex-1 items-center justify-center">
          <View style={styles.mascotStage}>
            <SpeechBubble
              label="Hello!"
              className="bg-[#E3EEFF]"
              textClassName="text-foreground"
              style={styles.bubbleHello}
            />
            <SpeechBubble
              label="¡Hola!"
              className="bg-[#EDE8FF]"
              textClassName="text-lingua-purple"
              style={styles.bubbleHola}
            />
            <SpeechBubble
              label="你好!"
              className="bg-[#FFE8DC]"
              textClassName="text-[#E85D4A]"
              style={styles.bubbleNihao}
            />
            <Image
              source={images.mascotWelcome}
              style={styles.mascotImage}
              resizeMode="contain"
              accessibilityLabel="Friendly fox mascot waving"
            />
          </View>
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => router.push("/sign-up" as Href)}
          className="mb-4 flex-row items-center justify-center gap-1 rounded-2xl bg-lingua-purple py-4 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <Text className="text--h4 text-white">Get Started</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mascotStage: {
    position: "relative",
    width: MASCOT_STAGE.width,
    height: MASCOT_STAGE.height,
  },
  mascotImage: {
    width: "100%",
    height: "100%",
  },
  bubbleHello: {
    position: "absolute",
    left: 28,
    top: 78,
    zIndex: 10,
    transform: [{ rotate: "4deg" }],
  },
  bubbleHola: {
    position: "absolute",
    right: 20,
    top: 28,
    zIndex: 10,
    transform: [{ rotate: "-5deg" }],
  },
  bubbleNihao: {
    position: "absolute",
    right: 4,
    top: 152,
    zIndex: 10,
    transform: [{ rotate: "3deg" }],
  },
});
