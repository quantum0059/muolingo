import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  audioLessonColors,
  audioLessonRadius,
  audioLessonSpacing,
} from "@/constants/audio-lesson-ui";

type AudioLessonHeaderProps = {
  languageLabel: string;
  lessonTitle: string;
  streak: number;
  onBack: () => void;
};

export function AudioLessonHeader({
  languageLabel,
  lessonTitle,
  streak,
  onBack,
}: AudioLessonHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityLabel="Go back"
        style={({ pressed }) => [
          styles.sideSlot,
          { opacity: pressed ? 0.6 : 1 },
        ]}
      >
        <Ionicons
          name="chevron-back"
          size={26}
          color={audioLessonColors.textPrimary}
        />
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.title}>AI Teacher</Text>
        <View style={styles.statusRow}>
          <View style={styles.onlineDot} />
          <Text style={styles.statusText}>Online</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {languageLabel} · {lessonTitle}
          </Text>
        </View>
      </View>

      <View style={[styles.sideSlot, styles.sideRight]}>
        <Pressable hitSlop={8} accessibilityLabel="Video settings">
          <Ionicons
            name="videocam-outline"
            size={22}
            color={audioLessonColors.textPrimary}
          />
        </Pressable>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>{streak}</Text>
        </View>
        <Pressable hitSlop={8} accessibilityLabel="Notifications">
          <Ionicons
            name="notifications-outline"
            size={22}
            color={audioLessonColors.textPrimary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: audioLessonSpacing.lg,
    paddingBottom: audioLessonSpacing.sm,
    minHeight: 52,
  },
  sideSlot: {
    minWidth: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: audioLessonSpacing.sm,
  },
  sideRight: {
    minWidth: 108,
    justifyContent: "flex-end",
  },
  center: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: audioLessonSpacing.xs,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: audioLessonColors.textPrimary,
    letterSpacing: -0.2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    maxWidth: "100%",
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: audioLessonColors.online,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: audioLessonColors.online,
  },
  metaDot: {
    marginHorizontal: 4,
    fontSize: 12,
    color: audioLessonColors.textSecondary,
  },
  metaText: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "500",
    color: audioLessonColors.textSecondary,
  },
  streakBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: audioLessonRadius.badge,
    backgroundColor: audioLessonColors.purpleLight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  streakText: {
    fontSize: 13,
    fontWeight: "700",
    color: audioLessonColors.purple,
  },
});
