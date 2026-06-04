import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { homeColors, homeRadius, homeSpacing } from "@/constants/home-ui";
import { getLessonById } from "@/data/lessons";
import { getLessonImageSource } from "@/lib/lesson-images";

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = id ? getLessonById(id) : undefined;

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Lesson not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel="Go back"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Ionicons name="chevron-back" size={24} color={homeColors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Image
          source={getLessonImageSource(lesson.imageKey)}
          style={styles.hero}
          contentFit="cover"
        />
        <Text style={styles.subtitle}>{lesson.subtitle}</Text>
        <Text style={styles.description}>{lesson.description}</Text>
        <Text style={styles.comingSoon}>
          Full lesson activities coming in the next step.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: homeColors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: homeSpacing.lg,
    paddingVertical: homeSpacing.md,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: homeColors.textPrimary,
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    paddingHorizontal: homeSpacing.xl,
    paddingTop: homeSpacing.md,
  },
  hero: {
    width: "100%",
    height: 180,
    borderRadius: homeRadius.xl,
    marginBottom: homeSpacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: homeSpacing.xxxl,
    color: homeColors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: homeColors.textSecondary,
    marginBottom: homeSpacing.sm,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: homeColors.textPrimary,
  },
  comingSoon: {
    marginTop: homeSpacing.xl,
    fontSize: 14,
    color: homeColors.textSecondary,
  },
  backButton: {
    alignSelf: "center",
    marginTop: homeSpacing.xl,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: homeColors.purple,
  },
});
