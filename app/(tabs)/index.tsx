import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo } from "react";
import { usePostHog } from "posthog-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TodayPlanItemRow } from "@/components/today-plan-item";
import { images, remoteImages } from "@/constants/images";
import {
  homeCardShadow,
  homeColors,
  homeRadius,
  homeSpacing,
  planCardGap,
} from "@/constants/home-ui";
import { getLanguageById } from "@/data/languages";
import {
  buildTodayPlan,
  getCurrentLesson,
  getLanguageDisplayName,
  getUnitLabel,
} from "@/lib/home-plan";
import { useLanguageStore } from "@/store/language";
import { useLearningStore } from "@/store/learning";
import type { LanguageId } from "@/types/learning";

const FALLBACK_LANGUAGE_ID: LanguageId = "es";

export default function HomeScreen() {
  const posthog = usePostHog();
  const { user } = useUser();
  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId
  );
  const xp = useLearningStore((state) => state.xp);
  const dailyXpGoal = useLearningStore((state) => state.dailyXpGoal);
  const streak = useLearningStore((state) => state.streak);
  const completedLessonIds = useLearningStore(
    (state) => state.completedLessonIds
  );
  const todayPlanCompleted = useLearningStore(
    (state) => state.todayPlanCompleted
  );
  const setTodayPlanItemCompleted = useLearningStore(
    (state) => state.setTodayPlanItemCompleted
  );

  const languageId = selectedLanguageId ?? FALLBACK_LANGUAGE_ID;
  const language = getLanguageById(languageId);
  const currentLesson = useMemo(
    () => getCurrentLesson(languageId, completedLessonIds),
    [languageId, completedLessonIds]
  );

  const todayPlan = useMemo(
    () => (currentLesson ? buildTodayPlan(currentLesson) : []),
    [currentLesson]
  );

  const firstName =
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
    "Learner";

  const xpProgress = Math.min(xp / dailyXpGoal, 1);
  const languageName = getLanguageDisplayName(languageId);
  const unitLabel = currentLesson ? getUnitLabel(currentLesson) : "A1 • Unit 1";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: language?.flagEmoji }}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>
            <Text style={styles.greeting} numberOfLines={1}>
              Hola, {firstName}! 👋
            </Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.streakWrap}>
              <Image
                source={images.streakFire}
                style={styles.streakIcon}
                contentFit="contain"
              />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
            <Pressable
              hitSlop={homeSpacing.sm}
              accessibilityLabel="Notifications"
              unstable_pressDelay={0}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={homeColors.textPrimary}
              />
            </Pressable>
          </View>
        </View>

        {/* Daily goal */}
        <View style={styles.dailyGoalCard}>
          <View style={styles.dailyGoalRow}>
            <View style={styles.dailyGoalTextCol}>
              <Text style={styles.dailyGoalLabel}>Daily goal</Text>
              <View style={styles.xpRow}>
                <Text style={styles.xpCurrent}>{xp}</Text>
                <Text style={styles.xpTotal}>/ {dailyXpGoal} XP</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${xpProgress * 100}%` },
                  ]}
                />
              </View>
            </View>
            <Image
              source={images.treasure}
              style={styles.treasureImage}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Continue learning */}
        {currentLesson ? (
          <View style={styles.continueCard}>
            <View style={styles.continueGradientRight} />
            <View style={styles.continueHillLeft} />
            <View style={styles.continueContent}>
              <View style={styles.continueTextCol}>
                <View>
                  <Text style={styles.continueTitle}>{languageName}</Text>
                  <Text style={styles.continueSubtitle}>{unitLabel}</Text>
                </View>
                <Pressable
                  unstable_pressDelay={0}
                  onPress={() =>
                    posthog.capture("lesson_continued", {
                      lesson_id: currentLesson?.id,
                      language_id: languageId,
                    })
                  }
                  style={({ pressed }) => [
                    styles.continueButton,
                    {
                      opacity: pressed ? 0.92 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.palaceWrap} pointerEvents="none">
              <Image
                source={images.palace}
                style={styles.palaceImage}
                contentFit="contain"
                contentPosition="bottom right"
              />
            </View>
          </View>
        ) : null}

        {/* Today's plan */}
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>Today&apos;s plan</Text>
          <Pressable
            hitSlop={homeSpacing.sm}
            unstable_pressDelay={0}
            onPress={() => router.push("/(tabs)/learn")}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={styles.planViewAll}>View all</Text>
          </Pressable>
        </View>

        <View style={styles.planList}>
          {todayPlan.map((item) => (
            <TodayPlanItemRow
              key={item.id}
              item={item}
              completed={todayPlanCompleted[item.id]}
              onToggle={() => {
                const nextCompleted = !todayPlanCompleted[item.id];
                if (nextCompleted) {
                  posthog.capture("daily_plan_item_completed", {
                    item_id: item.id,
                    language_id: languageId,
                  });
                }
                setTodayPlanItemCompleted(item.id, nextCompleted);
              }}
            />
          ))}
        </View>

        <View style={styles.bottomSpacer} />

        {/* Next up */}
        <View style={styles.nextUpCard}>
          <View style={styles.nextUpTextCol}>
            <Text style={styles.nextUpLabel}>Next up</Text>
            <Text style={styles.nextUpTitle}>AI Video Call</Text>
            <Text style={styles.nextUpSubtitle}>Practice speaking</Text>
          </View>

          <View style={styles.teacherWrap}>
            <Image
              source={{ uri: remoteImages.aiTeacherAvatar }}
              style={styles.teacherPhoto}
              contentFit="cover"
            />
            <Pressable
              accessibilityLabel="Start AI video call"
              unstable_pressDelay={0}
              onPress={() =>
                posthog.capture("ai_video_call_tapped", {
                  language_id: languageId,
                })
              }
              style={({ pressed }) => [
                styles.videoButton,
                {
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <Ionicons name="videocam" size={20} color={homeColors.white} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: homeColors.background,
  },
  page: {
    flex: 1,
    paddingHorizontal: homeSpacing.xl,
    paddingBottom: homeSpacing.md,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: homeSpacing.md,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: homeSpacing.md,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: homeColors.white,
    overflow: "hidden",
    ...homeCardShadow(2),
  },
  avatar: {
    width: 40,
    height: 40,
  },
  greeting: {
    flex: 1,
    marginLeft: homeSpacing.md,
    fontSize: 20,
    fontWeight: "700",
    color: homeColors.textPrimary,
    letterSpacing: -0.3,
  },
  streakWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakIcon: {
    width: 20,
    height: 20,
  },
  streakText: {
    marginLeft: homeSpacing.xs,
    fontSize: 16,
    fontWeight: "700",
    color: homeColors.orange,
  },

  /* Daily goal */
  dailyGoalCard: {
    marginTop: homeSpacing.lg,
    borderRadius: homeRadius.xl,
    backgroundColor: homeColors.beige,
    paddingHorizontal: homeSpacing.lg,
    paddingVertical: homeSpacing.lg,
    ...homeCardShadow(4),
  },
  dailyGoalRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dailyGoalTextCol: {
    flex: 1,
    paddingRight: homeSpacing.md,
  },
  dailyGoalLabel: {
    fontSize: 13,
    color: homeColors.textSecondary,
  },
  xpRow: {
    marginTop: homeSpacing.xs,
    flexDirection: "row",
    alignItems: "baseline",
  },
  xpCurrent: {
    fontSize: 28,
    fontWeight: "700",
    color: homeColors.textPrimary,
    letterSpacing: -0.5,
  },
  xpTotal: {
    marginLeft: homeSpacing.xs,
    fontSize: 15,
    color: homeColors.textSecondary,
  },
  progressTrack: {
    marginTop: homeSpacing.md,
    height: 8,
    borderRadius: homeRadius.sm,
    backgroundColor: homeColors.beigeTrack,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: homeRadius.sm,
    backgroundColor: homeColors.orange,
  },
  treasureImage: {
    width: 80,
    height: 64,
  },

  /* Continue learning hero */
  continueCard: {
    marginTop: homeSpacing.lg,
    minHeight: 148,
    borderRadius: homeRadius.lg,
    backgroundColor: homeColors.purple,
    overflow: "hidden",
    ...homeCardShadow(5),
  },
  continueGradientRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "48%",
    backgroundColor: homeColors.purpleGlow,
    opacity: 0.32,
  },
  continueHillLeft: {
    position: "absolute",
    left: -24,
    bottom: -10,
    width: 130,
    height: 44,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    backgroundColor: homeColors.purpleDeep,
    opacity: 0.28,
  },
  continueContent: {
    flex: 1,
    paddingLeft: homeSpacing.xl,
    paddingTop: homeSpacing.lg,
    paddingBottom: homeSpacing.lg,
    paddingRight: "46%",
    zIndex: 1,
  },
  continueTextCol: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: homeSpacing.xs,
  },
  palaceWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "46%",
    zIndex: 2,
  },
  palaceImage: {
    width: "100%",
    height: "100%",
  },
  continueTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
    color: homeColors.white,
    letterSpacing: -0.4,
  },
  continueSubtitle: {
    marginTop: homeSpacing.xs,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: "rgba(255,255,255,0.92)",
  },
  continueButton: {
    alignSelf: "flex-start",
    borderRadius: homeRadius.pill,
    backgroundColor: homeColors.white,
    paddingHorizontal: homeSpacing.xxl,
    paddingVertical: 10,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: homeColors.purple,
  },

  /* Today's plan */
  planHeader: {
    marginTop: homeSpacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: homeColors.textPrimary,
  },
  planViewAll: {
    fontSize: 13,
    fontWeight: "600",
    color: homeColors.purple,
  },
  planList: {
    marginTop: homeSpacing.md,
    gap: planCardGap,
  },
  bottomSpacer: {
    flex: 1,
    minHeight: homeSpacing.sm,
  },

  /* Next up */
  nextUpCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: homeRadius.xl,
    backgroundColor: homeColors.mint,
    paddingHorizontal: homeSpacing.lg,
    paddingVertical: homeSpacing.lg,
    ...homeCardShadow(3),
  },
  nextUpTextCol: {
    flex: 1,
    paddingRight: homeSpacing.md,
  },
  nextUpLabel: {
    fontSize: 13,
    color: homeColors.textSecondary,
  },
  nextUpTitle: {
    marginTop: homeSpacing.xs,
    fontSize: 17,
    fontWeight: "700",
    color: homeColors.textPrimary,
  },
  nextUpSubtitle: {
    marginTop: homeSpacing.xs,
    fontSize: 13,
    color: homeColors.textSecondary,
  },
  teacherWrap: {
    width: 68,
    height: 68,
  },
  teacherPhoto: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: homeColors.white,
  },
  videoButton: {
    position: "absolute",
    right: -4,
    bottom: -2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: homeColors.green,
    alignItems: "center",
    justifyContent: "center",
    ...homeCardShadow(4),
  },
});
