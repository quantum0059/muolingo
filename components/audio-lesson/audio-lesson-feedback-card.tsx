import { StyleSheet, Text, View } from "react-native";

import {
  audioLessonColors,
  audioLessonRadius,
  audioLessonShadow,
  audioLessonSpacing,
} from "@/constants/audio-lesson-ui";
import type { LessonFeedback } from "@/lib/audio-lesson-display";

type AudioLessonFeedbackCardProps = {
  feedback: LessonFeedback;
  goalSummary: string;
  focusTopics: string[];
};

export function AudioLessonFeedbackCard({
  feedback,
  goalSummary,
  focusTopics,
}: AudioLessonFeedbackCardProps) {
  const columns = [
    { label: "Speaking", value: feedback.speaking, color: audioLessonColors.green },
    {
      label: "Pronunciation",
      value: feedback.pronunciation,
      color: audioLessonColors.blue,
    },
    { label: "Grammar", value: feedback.grammar, color: audioLessonColors.purple },
  ] as const;

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        {columns.map((column, index) => (
          <View key={column.label} style={styles.columnWrap}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>{column.label}</Text>
              <Text style={[styles.columnValue, { color: column.color }]}>
                {column.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.goalLabel}>Lesson goal</Text>
      <Text style={styles.goalText}>{goalSummary}</Text>
      {focusTopics.length > 0 ? (
        <Text style={styles.focusText}>
          Focus: {focusTopics.join(", ")}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: audioLessonSpacing.lg,
    paddingBottom: audioLessonSpacing.md,
  },
  card: {
    flexDirection: "row",
    backgroundColor: audioLessonColors.white,
    borderRadius: audioLessonRadius.feedback,
    borderWidth: 1,
    borderColor: audioLessonColors.border,
    paddingVertical: audioLessonSpacing.lg,
    ...audioLessonShadow(2),
  },
  columnWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: audioLessonSpacing.sm,
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: audioLessonColors.border,
    marginVertical: 2,
  },
  columnLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: audioLessonColors.textSecondary,
    marginBottom: 4,
  },
  columnValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  goalLabel: {
    marginTop: audioLessonSpacing.md,
    fontSize: 12,
    fontWeight: "600",
    color: audioLessonColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  goalText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
    color: audioLessonColors.textPrimary,
    lineHeight: 20,
  },
  focusText: {
    marginTop: 4,
    fontSize: 13,
    color: audioLessonColors.textSecondary,
    lineHeight: 18,
  },
});
