import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  audioLessonColors,
  audioLessonRadius,
  audioLessonShadow,
  audioLessonSpacing,
} from "@/constants/audio-lesson-ui";
import type { AudioLessonCallStatus } from "@/hooks/use-audio-lesson-call";

type AudioLessonCallStatusProps = {
  status: AudioLessonCallStatus;
  userName: string;
  languageLabel: string;
  error: string | null;
  onRetry?: () => void;
};

type StatusConfig = {
  label: string;
  detail: string;
  color: string;
  backgroundColor: string;
  icon: keyof typeof Ionicons.glyphMap;
};

function getStatusConfig(status: AudioLessonCallStatus): StatusConfig {
  switch (status) {
    case "loading":
      return {
        label: "Loading",
        detail: "Preparing your audio lesson session…",
        color: audioLessonColors.purple,
        backgroundColor: audioLessonColors.purpleLight,
        icon: "hourglass-outline",
      };
    case "connecting":
      return {
        label: "Connecting",
        detail: "Joining the Stream audio room…",
        color: audioLessonColors.blue,
        backgroundColor: "#EFF6FF",
        icon: "radio-outline",
      };
    case "joined":
      return {
        label: "Joined",
        detail: "You are live in the audio lesson.",
        color: audioLessonColors.green,
        backgroundColor: "#ECFDF3",
        icon: "checkmark-circle-outline",
      };
    case "muted":
      return {
        label: "Muted",
        detail: "Your microphone is off.",
        color: audioLessonColors.navyMuted,
        backgroundColor: "#F3F4F6",
        icon: "mic-off-outline",
      };
    case "reconnecting":
      return {
        label: "Reconnecting",
        detail: "Trying to restore your audio connection…",
        color: audioLessonColors.blue,
        backgroundColor: "#EFF6FF",
        icon: "refresh-outline",
      };
    case "ended":
      return {
        label: "Ended",
        detail: "The audio lesson call has ended.",
        color: audioLessonColors.textSecondary,
        backgroundColor: "#F8FAFC",
        icon: "call-outline",
      };
    case "error":
      return {
        label: "Error",
        detail: "We could not connect to the audio lesson.",
        color: audioLessonColors.red,
        backgroundColor: "#FEF2F2",
        icon: "alert-circle-outline",
      };
    default:
      return {
        label: "Ready",
        detail: "Tap controls below to manage your lesson audio.",
        color: audioLessonColors.purple,
        backgroundColor: audioLessonColors.purpleLight,
        icon: "headset-outline",
      };
  }
}

export function AudioLessonCallStatusCard({
  status,
  userName,
  languageLabel,
  error,
  onRetry,
}: AudioLessonCallStatusProps) {
  const config = getStatusConfig(status);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.badge,
            { backgroundColor: config.backgroundColor },
          ]}
        >
          <Ionicons name={config.icon} size={16} color={config.color} />
          <Text style={[styles.badgeText, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
        <Text style={styles.language}>{languageLabel}</Text>
      </View>

      <Text style={styles.detail}>{error ?? config.detail}</Text>

      <View style={styles.infoBlock}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Learner</Text>
          <Text style={styles.infoValue}>{userName}</Text>
        </View>
      </View>

      {status === "error" && onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry audio lesson connection"
          style={({ pressed }) => [
            styles.retryButton,
            { opacity: pressed ? 0.88 : 1 },
          ]}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: audioLessonSpacing.lg,
    marginTop: audioLessonSpacing.md,
    padding: audioLessonSpacing.lg,
    borderRadius: audioLessonRadius.feedback,
    backgroundColor: audioLessonColors.white,
    borderWidth: 1,
    borderColor: audioLessonColors.border,
    ...audioLessonShadow(2),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: audioLessonSpacing.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: audioLessonSpacing.xs,
    paddingHorizontal: audioLessonSpacing.md,
    paddingVertical: audioLessonSpacing.xs,
    borderRadius: audioLessonRadius.badge,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  language: {
    fontSize: 13,
    fontWeight: "600",
    color: audioLessonColors.textSecondary,
  },
  detail: {
    marginTop: audioLessonSpacing.md,
    fontSize: 14,
    lineHeight: 20,
    color: audioLessonColors.textPrimary,
  },
  infoBlock: {
    marginTop: audioLessonSpacing.lg,
    gap: audioLessonSpacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: audioLessonSpacing.md,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: audioLessonColors.textSecondary,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "600",
    color: audioLessonColors.textPrimary,
  },
  retryButton: {
    marginTop: audioLessonSpacing.lg,
    alignSelf: "flex-start",
    backgroundColor: audioLessonColors.purple,
    borderRadius: audioLessonRadius.badge,
    paddingHorizontal: audioLessonSpacing.lg,
    paddingVertical: audioLessonSpacing.sm,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "700",
    color: audioLessonColors.white,
  },
});
