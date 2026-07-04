import { useClerk, useUser } from "@clerk/expo";
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

import {
  homeCardShadow,
  homeColors,
  homeRadius,
  homeSpacing,
} from "@/constants/home-ui";
import { languages } from "@/data/languages";
import { getLessonsForLanguage } from "@/data/lessons";
import { getUnitsForLanguage } from "@/data/units";
import { useLanguageStore } from "@/store/language";
import { useLearningStore } from "@/store/learning";
import type { LanguageId } from "@/types/learning";

const FALLBACK_LANGUAGE_ID: LanguageId = "es";
const GOAL_OPTIONS = [15, 20, 30, 50];
const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getLevelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 40) + 1);
}

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const { user } = useUser();
  const { signOut } = useClerk();

  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId
  );
  const xp = useLearningStore((state) => state.xp);
  const streak = useLearningStore((state) => state.streak);
  const dailyXpGoal = useLearningStore((state) => state.dailyXpGoal);
  const weeklyXpHistory = useLearningStore((state) => state.weeklyXpHistory);
  const completedLessonIds = useLearningStore(
    (state) => state.completedLessonIds
  );
  const setDailyXpGoal = useLearningStore((state) => state.setDailyXpGoal);

  const [isSigningOut, setIsSigningOut] = useState(false);

  const activeLanguageId = selectedLanguageId ?? FALLBACK_LANGUAGE_ID;
  const activeLanguage =
    languages.find((language) => language.id === activeLanguageId) ?? languages[0];

  const firstName =
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
    "Learner";
  const fullName = user?.fullName ?? firstName;
  const level = getLevelFromXp(xp);
  const xpProgress = Math.min(xp / dailyXpGoal, 1);

  const languageProgress = useMemo(() => {
    return languages
      .map((language) => {
        const lessons = getLessonsForLanguage(language.id);
        const units = getUnitsForLanguage(language.id);
        const completedCount = lessons.filter((lesson) =>
          completedLessonIds.includes(lesson.id)
        ).length;
        const progress = lessons.length > 0 ? completedCount / lessons.length : 0;
        const currentUnit = units.find((unit) =>
          unit.lessonIds.some((lessonId) => !completedLessonIds.includes(lessonId))
        );

        return {
          ...language,
          totalLessons: lessons.length,
          completedLessons: completedCount,
          completedUnits: units.filter((unit) =>
            unit.lessonIds.every((lessonId) => completedLessonIds.includes(lessonId))
          ).length,
          totalUnits: units.length,
          progress,
          isActive: language.id === activeLanguageId,
          isStarted: language.id === activeLanguageId || completedCount > 0,
          nextUnitTitle: currentUnit?.title ?? units[units.length - 1]?.title ?? "Ready to start",
        };
      })
      .sort((a, b) => {
        if (a.isActive) return -1;
        if (b.isActive) return 1;
        return b.completedLessons - a.completedLessons;
      });
  }, [activeLanguageId, completedLessonIds]);

  const startedLanguages = languageProgress.filter((language) => language.isStarted);
  const maxWeeklyXp = Math.max(...weeklyXpHistory, 1);
  const chartBarWidth = Math.max((width - 96) / WEEK_DAYS.length - 8, 24);

  const totalLessonsCompleted = completedLessonIds.length;
  const totalUnitsCompleted = languageProgress.reduce(
    (sum, language) => sum + language.completedUnits,
    0
  );

  const achievements = [
    {
      id: "streak",
      icon: "flame",
      color: homeColors.orange,
      title: `${streak} day streak`,
      subtitle: streak >= 7 ? "Consistency unlocked" : "Keep it going",
    },
    {
      id: "lessons",
      icon: "checkmark-circle",
      color: homeColors.green,
      title: `${totalLessonsCompleted} lessons`,
      subtitle: "Completed with your AI teacher",
    },
    {
      id: "languages",
      icon: "globe-outline",
      color: homeColors.purple,
      title: `${startedLanguages.length} languages`,
      subtitle:
        startedLanguages.length > 1
          ? "You are building a multilingual habit"
          : "Your journey has started",
    },
  ] as const;

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    try {
      setIsSigningOut(true);
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error(error);
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.brandLabel}>Duolingo</Text>
            <Text className="text--h2 text-foreground">Profile</Text>
          </View>
          <Pressable
            onPress={() => router.push("/language")}
            style={({ pressed }) => [
              styles.ghostButton,
              { opacity: pressed ? 0.65 : 1 },
            ]}
          >
            <Ionicons name="swap-horizontal" size={16} color={homeColors.purple} />
            <Text style={styles.ghostButtonText}>Change language</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.profileIdentity}>
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarFallbackText}>
                    {getInitials(fullName)}
                  </Text>
                </View>
              )}

              <View style={styles.profileCopy}>
                <Text className="text--h3 text-white">{fullName}</Text>
                <Text style={styles.heroSubtext}>
                  Learning {activeLanguage.name} right now
                </Text>
                <View style={styles.activeLanguagePill}>
                  <Image
                    source={{ uri: activeLanguage.flagEmoji }}
                    style={styles.flagIcon}
                    contentFit="cover"
                  />
                  <Text style={styles.activeLanguagePillText}>
                    {activeLanguage.nativeName}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.levelBadge}>
              <Text style={styles.levelLabel}>Lv</Text>
              <Text style={styles.levelValue}>{level}</Text>
            </View>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCard}>
              <Ionicons name="flash" size={18} color={homeColors.orange} />
              <Text style={styles.heroStatValue}>{xp}</Text>
              <Text style={styles.heroStatLabel}>Total XP</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Ionicons name="flame" size={18} color={homeColors.orange} />
              <Text style={styles.heroStatValue}>{streak}</Text>
              <Text style={styles.heroStatLabel}>Day streak</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Ionicons name="book" size={18} color={homeColors.orange} />
              <Text style={styles.heroStatValue}>{totalLessonsCompleted}</Text>
              <Text style={styles.heroStatLabel}>Lessons done</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderContent}>
              <Text className="text--h3 text-foreground">Daily goal</Text>
              <Text className="text--body-sm text-secondary">
                Adjust how many XP you want to reach each day.
              </Text>
            </View>
            <Text style={styles.goalValueText}>{dailyXpGoal} XP</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(xpProgress * 100, 8)}%` },
              ]}
            />
          </View>

          <View style={styles.goalChipRow}>
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = goal === dailyXpGoal;

              return (
                <Pressable
                  key={goal}
                  onPress={() => setDailyXpGoal(goal)}
                  style={({ pressed }) => [
                    styles.goalChip,
                    isSelected && styles.goalChipSelected,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.goalChipText,
                      isSelected && styles.goalChipTextSelected,
                    ]}
                  >
                    {goal} XP
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderContent}>
              <Text className="text--h3 text-foreground">My languages</Text>
              <Text className="text--body-sm text-secondary">
                See how far you have gone in every language you have started.
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/language")}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text style={styles.linkText}>Manage</Text>
            </Pressable>
          </View>

          <View style={styles.languageList}>
            {startedLanguages.map((language) => (
              <View key={language.id} style={styles.languageCard}>
                <View style={styles.languageRow}>
                  <View style={styles.languageInfo}>
                    <Image
                      source={{ uri: language.flagEmoji }}
                      style={styles.languageFlag}
                      contentFit="cover"
                    />
                    <View style={styles.languageCopy}>
                      <View style={styles.languageTitleRow}>
                        <Text className="text--body-lg text-foreground">
                          {language.name}
                        </Text>
                        {language.isActive ? (
                          <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>Active</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text className="text--body-sm text-secondary">
                        {language.completedLessons} of {language.totalLessons} lessons
                        {" • "}
                        {language.completedUnits}/{language.totalUnits} units complete
                      </Text>
                    </View>
                  </View>

                  {!language.isActive ? (
                    <Pressable
                      onPress={() => router.push("/language")}
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={homeColors.textSecondary}
                      />
                    </Pressable>
                  ) : null}
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.max(language.progress * 100, 8)}%` },
                    ]}
                  />
                </View>

                <View style={styles.languageFooterRow}>
                  <Text className="text--body-sm text-secondary">
                    {Math.round(language.progress * 100)}% complete
                  </Text>
                  <Text className="text--body-sm text-secondary">
                    Next: {language.nextUnitTitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderContent}>
              <Text className="text--h3 text-foreground">Weekly XP chart</Text>
              <Text className="text--body-sm text-secondary">
                Your recent practice rhythm across the week.
              </Text>
            </View>
            <Text style={styles.goalValueText}>
              {weeklyXpHistory.reduce((sum, value) => sum + value, 0)} XP
            </Text>
          </View>

          <View style={styles.chartWrap}>
            {weeklyXpHistory.map((value, index) => {
              const barHeight = Math.max((value / maxWeeklyXp) * 110, 16);
              const isToday = index === weeklyXpHistory.length - 1;

              return (
                <View key={`${WEEK_DAYS[index]}-${index}`} style={styles.chartColumn}>
                  <View style={styles.chartValueWrap}>
                    <Text
                      style={[
                        styles.chartValueText,
                        isToday && styles.chartValueTextToday,
                      ]}
                    >
                      {value}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: barHeight,
                        width: chartBarWidth,
                        backgroundColor: isToday
                          ? homeColors.purple
                          : "#DDD6FF",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.chartDayLabel,
                      isToday && styles.chartDayLabelToday,
                    ]}
                  >
                    {WEEK_DAYS[index]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.rowSection}>
          <View style={[styles.statCard, styles.rowCard]}>
            <Text className="text--body-sm text-secondary">Units finished</Text>
            <Text style={styles.rowCardValue}>{totalUnitsCompleted}</Text>
            <Text className="text--body-sm text-secondary">
              Across all started languages
            </Text>
          </View>

          <View style={[styles.statCard, styles.rowCard]}>
            <Text className="text--body-sm text-secondary">Current focus</Text>
            <Text style={styles.rowCardValue}>{activeLanguage.name}</Text>
            <Text className="text--body-sm text-secondary">
              {activeLanguage.shortDescription}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text className="text--h3 text-foreground">Achievements</Text>
          <View style={styles.achievementList}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View
                  style={[
                    styles.achievementIconWrap,
                    { backgroundColor: `${achievement.color}18` },
                  ]}
                >
                  <Ionicons
                    name={achievement.icon}
                    size={18}
                    color={achievement.color}
                  />
                </View>
                <View style={styles.achievementCopy}>
                  <Text className="text--body-lg text-foreground">
                    {achievement.title}
                  </Text>
                  <Text className="text--body-sm text-secondary">
                    {achievement.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text className="text--h3 text-foreground">Settings</Text>

          <Pressable
            onPress={() => router.push("/language")}
            style={({ pressed }) => [
              styles.settingRow,
              { opacity: pressed ? 0.65 : 1 },
            ]}
          >
            <View style={styles.settingRowLeft}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="language" size={18} color={homeColors.purple} />
              </View>
              <View>
                <Text className="text--body-lg text-foreground">
                  Change learning language
                </Text>
                <Text className="text--body-sm text-secondary">
                  Switch your active course or start a new one.
                </Text>
              </View>
            </View>
            <View style={styles.settingChevronWrap}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={homeColors.textSecondary}
              />
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/learn")}
            style={({ pressed }) => [
              styles.settingRow,
              { opacity: pressed ? 0.65 : 1 },
            ]}
          >
            <View style={styles.settingRowLeft}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="school" size={18} color={homeColors.purple} />
              </View>
              <View>
                <Text className="text--body-lg text-foreground">
                  Continue learning
                </Text>
                <Text className="text--body-sm text-secondary">
                  Jump back into your next lesson.
                </Text>
              </View>
            </View>
            <View style={styles.settingChevronWrap}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={homeColors.textSecondary}
              />
            </View>
          </Pressable>

          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.logoutButton,
              { opacity: pressed || isSigningOut ? 0.75 : 1 },
            ]}
          >
            <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>
              {isSigningOut ? "Signing out..." : "Log out"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: homeColors.background,
  },
  scrollContent: {
    paddingHorizontal: homeSpacing.xl,
    paddingBottom: 120,
    gap: homeSpacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: homeSpacing.xs,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
    marginRight: homeSpacing.md,
  },
  brandLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: homeColors.purple,
    marginBottom: 4,
  },
  ghostButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: homeSpacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDD6FF",
    backgroundColor: "#F6F1FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ghostButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: homeColors.purple,
  },
  heroCard: {
    borderRadius: homeRadius.xl,
    backgroundColor: homeColors.purple,
    padding: homeSpacing.xl,
    ...homeCardShadow(6),
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: homeSpacing.md,
  },
  profileIdentity: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: homeSpacing.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.25)",
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.25)",
  },
  avatarFallbackText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileCopy: {
    flex: 1,
    gap: 6,
  },
  heroSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.82)",
  },
  activeLanguagePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeLanguagePillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  flagIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  levelBadge: {
    minWidth: 58,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: homeColors.textSecondary,
    textTransform: "uppercase",
  },
  levelValue: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "800",
    color: homeColors.purple,
  },
  heroStatsRow: {
    flexDirection: "row",
    gap: homeSpacing.sm,
    marginTop: homeSpacing.xl,
  },
  heroStatCard: {
    flex: 1,
    borderRadius: homeRadius.lg,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 4,
  },
  heroStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  heroStatLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
  },
  sectionCard: {
    borderRadius: homeRadius.xl,
    backgroundColor: "#FFFFFF",
    padding: homeSpacing.xl,
    gap: homeSpacing.lg,
    borderWidth: 1,
    borderColor: homeColors.border,
    ...homeCardShadow(3),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: homeSpacing.md,
  },
  sectionHeaderContent: {
    flex: 1,
    minWidth: 0,
  },
  goalValueText: {
    fontSize: 14,
    fontWeight: "700",
    color: homeColors.purple,
    flexShrink: 0,
    textAlign: "right",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#EEE9FF",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: homeColors.purple,
  },
  goalChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: homeSpacing.sm,
  },
  goalChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: homeColors.border,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  goalChipSelected: {
    borderColor: homeColors.purple,
    backgroundColor: "#F3F0FF",
  },
  goalChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: homeColors.textPrimary,
  },
  goalChipTextSelected: {
    color: homeColors.purple,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "700",
    color: homeColors.purple,
    flexShrink: 0,
    textAlign: "right",
  },
  languageList: {
    gap: homeSpacing.md,
  },
  languageCard: {
    gap: homeSpacing.sm,
    borderRadius: homeRadius.lg,
    backgroundColor: "#F9FAFB",
    padding: homeSpacing.lg,
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: homeSpacing.md,
  },
  languageInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: homeSpacing.md,
  },
  languageFlag: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  languageCopy: {
    flex: 1,
    gap: 4,
  },
  languageTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeBadge: {
    borderRadius: 999,
    backgroundColor: "#E9F8F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: homeColors.green,
  },
  languageFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: homeSpacing.sm,
  },
  chartWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: homeSpacing.sm,
  },
  chartColumn: {
    flex: 1,
    alignItems: "center",
    gap: homeSpacing.xs,
  },
  chartValueWrap: {
    minHeight: 18,
    justifyContent: "center",
  },
  chartValueText: {
    fontSize: 12,
    fontWeight: "700",
    color: homeColors.textSecondary,
  },
  chartValueTextToday: {
    color: homeColors.purple,
  },
  chartBar: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  chartDayLabel: {
    fontSize: 12,
    color: homeColors.textSecondary,
  },
  chartDayLabelToday: {
    fontWeight: "700",
    color: homeColors.purple,
  },
  rowSection: {
    flexDirection: "row",
    gap: homeSpacing.md,
  },
  rowCard: {
    flex: 1,
  },
  statCard: {
    borderRadius: homeRadius.xl,
    backgroundColor: "#F6F7FB",
    padding: homeSpacing.xl,
    gap: 8,
  },
  rowCardValue: {
    fontSize: 26,
    fontWeight: "800",
    color: homeColors.textPrimary,
  },
  achievementList: {
    gap: homeSpacing.md,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: homeSpacing.md,
    borderRadius: homeRadius.lg,
    backgroundColor: "#F9FAFB",
    padding: homeSpacing.md,
  },
  achievementIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementCopy: {
    flex: 1,
    gap: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: homeSpacing.md,
  },
  settingRowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: homeSpacing.md,
  },
  settingIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F0FF",
  },
  settingChevronWrap: {
    minHeight: 42,
    justifyContent: "center",
  },
  logoutButton: {
    marginTop: homeSpacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: homeSpacing.sm,
    borderRadius: homeRadius.lg,
    backgroundColor: "#111827",
    paddingVertical: 16,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
