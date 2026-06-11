import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import {
  audioLessonColors,
  audioLessonRadius,
  audioLessonShadow,
  audioLessonSpacing,
} from "@/constants/audio-lesson-ui";
import type { AudioLessonAgentStatus } from "@/hooks/use-audio-lesson-call";

type AudioLessonAgentStatusProps = {
  status: AudioLessonAgentStatus;
  error: string | null;
};

type StatusConfig = {
  label: string;
  detail: string;
  color: string;
  backgroundColor: string;
  icon: keyof typeof Ionicons.glyphMap;
};

function getStatusConfig(status: AudioLessonAgentStatus): StatusConfig {
  switch (status) {
    case "connecting":
      return {
        label: "Connecting teacher",
        detail: "Inviting your AI language teacher to the lesson…",
        color: audioLessonColors.blue,
        backgroundColor: "#EFF6FF",
        icon: "sparkles-outline",
      };
    case "connected":
      return {
        label: "Teacher connected",
        detail: "Your AI teacher is live and ready to guide the lesson.",
        color: audioLessonColors.green,
        backgroundColor: "#ECFDF3",
        icon: "school-outline",
      };
    case "failed":
      return {
        label: "Teacher unavailable",
        detail: "We could not connect the AI teacher to this lesson.",
        color: audioLessonColors.red,
        backgroundColor: "#FEF2F2",
        icon: "alert-circle-outline",
      };
    default:
      return {
        label: "Teacher idle",
        detail: "The AI teacher will join once your audio lesson is ready.",
        color: audioLessonColors.navyMuted,
        backgroundColor: "#F8FAFC",
        icon: "person-outline",
      };
  }
}

export function AudioLessonAgentStatusCard({
  status,
  error,
}: AudioLessonAgentStatusProps) {
  const config = getStatusConfig(status);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View
          style={[styles.badge, { backgroundColor: config.backgroundColor }]}
        >
          <Ionicons name={config.icon} size={16} color={config.color} />
          <Text style={[styles.badgeText, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
        <Text style={styles.teacherLabel}>AI Teacher</Text>
      </View>

      <Text style={styles.detail}>{error ?? config.detail}</Text>
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
  teacherLabel: {
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
});
