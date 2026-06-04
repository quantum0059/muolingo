import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LearnTabSwitcher } from "@/components/learn-tab-switcher";
import { LessonListCard } from "@/components/lesson-list-card";
import { images } from "@/constants/images";
import { learnColors, learnSpacing } from "@/constants/learn-ui";
import { getLessonsForUnit } from "@/data/lessons";
import { getUnitById } from "@/data/units";
import { getLearnScreenUnitId } from "@/lib/learn-unit";
import { getLessonCardStatus, getUnitProgress } from "@/lib/lesson-progress";
import { useLanguageStore } from "@/store/language";
import { useLearningStore } from "@/store/learning";
import type { LanguageId } from "@/types/learning";

const FALLBACK_LANGUAGE_ID: LanguageId = "es";
/** Cropped illustration only — no UI chrome from design PNG */
const HERO_ASPECT = 287 / 546; // matches assets/images/unit-cafe-hero.png

type LearnTab = "lessons" | "practice";

export default function LearnScreen() {
  const { width } = useWindowDimensions();
  const heroHeight = Math.round(width * HERO_ASPECT);
  const [activeTab, setActiveTab] = useState<LearnTab>("lessons");

  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId
  );
  const completedLessonIds = useLearningStore(
    (state) => state.completedLessonIds
  );

  const languageId = selectedLanguageId ?? FALLBACK_LANGUAGE_ID;

  const unitId = useMemo(
    () => getLearnScreenUnitId(languageId),
    [languageId]
  );

  const unit = unitId ? getUnitById(unitId) : undefined;
  const unitLessons = useMemo(
    () => (unitId ? getLessonsForUnit(unitId) : []),
    [unitId]
  );

  const progress = getUnitProgress(unitLessons, completedLessonIds);
  const unitNumber = unit?.order ?? 1;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SafeAreaView edges={["top"]} style={styles.safeTop}>
          <View style={styles.header}>
            <Pressable
              onPress={handleBack}
              hitSlop={14}
              accessibilityLabel="Go back"
              style={({ pressed }) => [
                styles.headerSide,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={26}
                color={learnColors.textPrimary}
              />
            </Pressable>

            <View style={styles.headerCenter}>
              <Text style={styles.unitTitle} numberOfLines={1}>
                {unit?.title ?? "Lessons"}
              </Text>
              <Text style={styles.unitSubtitle}>
                Unit {unitNumber} • {progress.completed} / {progress.total}{" "}
                lessons
              </Text>
            </View>

            <Pressable
              hitSlop={14}
              accessibilityLabel="Bookmark unit"
              style={({ pressed }) => [
                styles.headerSide,
                styles.headerSideRight,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Ionicons name="ribbon" size={22} color={learnColors.orange} />
            </Pressable>
          </View>
        </SafeAreaView>

        <Image
          source={images.unitCafeHero}
          style={{ width, height: heroHeight }}
          contentFit="cover"
          accessibilityIgnoresInvertColors
        />

        <View style={styles.contentSheet}>
          <LearnTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "lessons" ? (
            <View style={styles.lessonList}>
              {unitLessons.map((lesson, index) => (
                <LessonListCard
                  key={lesson.id}
                  lesson={lesson}
                  lessonNumber={index + 1}
                  totalLessons={unitLessons.length}
                  status={getLessonCardStatus(
                    lesson,
                    unitLessons,
                    completedLessonIds
                  )}
                  onPress={() => openLesson(lesson.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.practicePlaceholder}>
              <Text style={styles.practiceTitle}>Practice mode</Text>
              <Text style={styles.practiceSubtitle}>
                Review exercises for this unit are coming soon.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: learnColors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  safeTop: {
    backgroundColor: learnColors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: learnSpacing.lg,
    paddingBottom: learnSpacing.sm,
    minHeight: 52,
  },
  headerSide: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerSideRight: {
    alignItems: "flex-end",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: learnSpacing.sm,
  },
  unitTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: learnColors.textPrimary,
    letterSpacing: -0.2,
  },
  unitSubtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: learnColors.textSecondary,
  },
  contentSheet: {
    backgroundColor: learnColors.sheetBg,
    paddingHorizontal: learnSpacing.xl,
    paddingTop: learnSpacing.lg,
    gap: learnSpacing.lg,
  },
  lessonList: {
    gap: learnSpacing.md,
  },
  practicePlaceholder: {
    paddingVertical: learnSpacing.xxl,
    alignItems: "center",
  },
  practiceTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: learnColors.textPrimary,
  },
  practiceSubtitle: {
    marginTop: learnSpacing.sm,
    fontSize: 14,
    textAlign: "center",
    color: learnColors.textSecondary,
    lineHeight: 20,
  },
});
