import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { type ReactNode } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { VerificationModal } from "@/components/verification-modal";
import { images } from "@/constants/images";

type VerificationModalProps = {
  visible: boolean;
  onClose: () => void;
  onVerify: (code: string) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
};

type AuthScreenLayoutProps = {
  title: string;
  subtitle: string;
  primaryButtonLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerHref: Href;
  children: ReactNode;
  onPrimaryPress: () => void | Promise<void>;
  isLoading?: boolean;
  showCaptcha?: boolean;
  verificationModal: VerificationModalProps;
  onGooglePress?: () => void | Promise<void>;
  onApplePress?: () => void | Promise<void>;
  onFacebookPress?: () => void | Promise<void>;
  socialError?: string | null;
};

function AuthSparkle({
  color,
  size,
  style,
}: {
  color: string;
  size: number;
  style: TextStyle;
}) {
  return (
    <Ionicons
      name="sparkles"
      size={size}
      color={color}
      style={style}
      accessibilityElementsHidden
    />
  );
}

export function AuthScreenLayout({
  title,
  subtitle,
  primaryButtonLabel,
  footerText,
  footerLinkLabel,
  footerHref,
  children,
  onPrimaryPress,
  isLoading = false,
  showCaptcha = false,
  verificationModal,
  onGooglePress,
  onApplePress,
  onFacebookPress,
  socialError = null,
}: AuthScreenLayoutProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          className="mb-6 h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={28} color="#0D132B" />
        </Pressable>

        <Text className="text--h2 text-foreground">{title}</Text>
        <Text className="text--body-md mt-2 text-secondary">{subtitle}</Text>

        <View style={styles.mascotStage} className="mt-4 items-center">
          <AuthSparkle
            color="#FF8A00"
            size={18}
            style={styles.sparkleOrange}
          />
          <AuthSparkle color="#4D8BFF" size={14} style={styles.sparkleBlue} />
          <AuthSparkle color="#FFC800" size={16} style={styles.sparkleYellow} />
          <Image
            source={images.mascotAuth}
            style={styles.mascotImage}
            resizeMode="contain"
            accessibilityLabel="Friendly fox mascot waving"
          />
        </View>

        <View className="mt-2 gap-4">{children}</View>

        <Pressable
          className="mt-6 rounded-2xl bg-lingua-purple py-4 active:opacity-90"
          onPress={onPrimaryPress}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel={primaryButtonLabel}
          style={isLoading ? styles.buttonDisabled : undefined}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text--h4 text-center text-white">
              {primaryButtonLabel}
            </Text>
          )}
        </Pressable>

        <View className="mt-8 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />
          <Text className="text--body-sm text-secondary">or continue with</Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        <View className="mt-5 gap-3">
          <SocialAuthButton
            icon="logo-google"
            iconColor="#4285F4"
            label="Continue with Google"
            onPress={onGooglePress}
          />
          <SocialAuthButton
            icon="logo-facebook"
            iconColor="#1877F2"
            label="Continue with Facebook"
            onPress={onFacebookPress}
          />
          <SocialAuthButton
            icon="logo-apple"
            iconColor="#0D132B"
            label="Continue with Apple"
            onPress={onApplePress}
          />
        </View>

        {socialError ? (
          <Text className="text--body-sm mt-3 text-center text-red-500">
            {socialError}
          </Text>
        ) : null}

        <View className="mt-8 flex-row items-center justify-center pb-6">
          <Text className="text--body-md text-secondary">{footerText} </Text>
          <Pressable
            onPress={() => router.push(footerHref)}
            accessibilityRole="link"
            accessibilityLabel={footerLinkLabel}
          >
            <Text className="text--body-md font-medium text-lingua-purple">
              {footerLinkLabel}
            </Text>
          </Pressable>
        </View>

        {showCaptcha ? <View nativeID="clerk-captcha" /> : null}
      </ScrollView>

      <VerificationModal
        visible={verificationModal.visible}
        onClose={verificationModal.onClose}
        onVerify={verificationModal.onVerify}
        isLoading={verificationModal.isLoading}
        error={verificationModal.error}
      />
    </SafeAreaView>
  );
}

function SocialAuthButton({
  icon,
  iconColor,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  onPress?: () => void | Promise<void>;
}) {
  return (
    <Pressable
      className="flex-row items-center justify-center gap-3 rounded-2xl border border-border bg-background py-3.5 active:bg-surface"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text className="text--body-md text-foreground">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  mascotStage: {
    position: "relative",
    width: 220,
    height: 200,
    alignSelf: "center",
  },
  mascotImage: {
    width: "100%",
    height: "100%",
  },
  sparkleOrange: {
    position: "absolute",
    left: 12,
    top: 36,
    zIndex: 10,
  },
  sparkleBlue: {
    position: "absolute",
    right: 8,
    top: 52,
    zIndex: 10,
  },
  sparkleYellow: {
    position: "absolute",
    right: 28,
    top: 12,
    zIndex: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
