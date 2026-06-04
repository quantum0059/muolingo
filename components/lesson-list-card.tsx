import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  learnCardShadow,
  learnColors,
  learnRadius,
  learnSpacing,
} from "@/constants/learn-ui";
import { getLessonImageSource } from "@/lib/lesson-images";
import type { LessonCardStatus } from "@/lib/lesson-progress";
import type { Lesson } from "@/types/learning";

type LessonListCardProps = {
  lesson: Lesson;
  lessonNumber: number;
  status: LessonCardStatus;
  totalLessons: number;
  onPress: () => void;
};

export function LessonListCard({
  lesson,
  lessonNumber,
  status,
  totalLessons,
  onPress,
}: LessonListCardProps) {
  const isInProgress = status === "in_progress";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}, lesson ${lessonNumber}`}
      style={({ pressed }) => [
        styles.card,
        isInProgress && styles.cardInProgress,
        isLocked && styles.cardLocked,
        { opacity: pressed ? 0.94 : 1 },
      ]}
    >
      <View style={styles.textCol}>
        {!isLocked ? (
          <Text
            style={[
              styles.lessonMeta,
              isInProgress && styles.lessonMetaActive,
            ]}
          >
            Lesson {lessonNumber}
          </Text>
        ) : null}
        <Text
          style={[styles.title, isLocked && styles.titleLocked]}
          numberOfLines={2}
        >
          {lesson.title}
        </Text>
        {isInProgress ? (
          <Text style={styles.inProgressLabel}>In progress</Text>
        ) : null}
        {isLocked ? (
          <Text style={styles.lockedMeta}>0 / {totalLessons} lessons</Text>
        ) : null}
      </View>

      <View style={styles.trailing}>
        {isCompleted ? (
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={20} color={learnColors.background} />
          </View>
        ) : null}

        {isLocked ? (
          <View style={styles.lockCircle}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={learnColors.lockIcon}
            />
          </View>
        ) : null}

        {isInProgress ? (
          <Image
            source={getLessonImageSource(lesson.imageKey)}
            style={styles.lessonThumb}
            contentFit="contain"
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 76,
    borderRadius: learnRadius.card,
    backgroundColor: learnColors.background,
    borderWidth: 1,
    borderColor: learnColors.border,
    paddingHorizontal: learnSpacing.lg,
    paddingVertical: learnSpacing.md + 2,
    ...learnCardShadow(2),
  },
  cardInProgress: {
    borderWidth: 1.5,
    borderColor: learnColors.purpleBorder,
    backgroundColor: learnColors.purpleLight,
    ...learnCardShadow(3),
  },
  cardLocked: {
    borderColor: "#E8EAEF",
    backgroundColor: learnColors.background,
  },
  textCol: {
    flex: 1,
    paddingRight: learnSpacing.md,
  },
  lessonMeta: {
    fontSize: 13,
    fontWeight: "500",
    color: learnColors.textSecondary,
    marginBottom: 2,
  },
  lessonMetaActive: {
    color: learnColors.purple,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: learnColors.textPrimary,
    letterSpacing: -0.2,
  },
  titleLocked: {
    fontSize: 16,
    fontWeight: "600",
  },
  inProgressLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: learnColors.purple,
  },
  lockedMeta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: learnColors.textMuted,
  },
  trailing: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: learnColors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  lockCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: learnColors.lockBg,
    alignItems: "center",
    justifyContent: "center",
  },
  lessonThumb: {
    width: 48,
    height: 48,
  },
});
