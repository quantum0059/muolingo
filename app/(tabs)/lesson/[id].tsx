import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AudioLessonControls } from "@/components/audio-lesson/audio-lesson-controls";
import { AudioLessonFeedbackCard } from "@/components/audio-lesson/audio-lesson-feedback-card";
import { AudioLessonHeader } from "@/components/audio-lesson/audio-lesson-header";
import { AudioLessonStage } from "@/components/audio-lesson/audio-lesson-stage";
import { audioLessonColors, audioLessonSpacing } from "@/constants/audio-lesson-ui";
import { getLessonById } from "@/data/lessons";
import {
  getLanguageLabel,
  getLessonGoalSummary,
  getSessionFeedback,
  getTeacherBubble,
} from "@/lib/audio-lesson-display";
import { useLearningStore } from "@/store/learning";

export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = id ? getLessonById(id) : undefined;

  const streak = useLearningStore((state) => state.streak);
  const completeLesson = useLearningStore((state) => state.completeLesson);

  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [subtitlesOn, setSubtitlesOn] = useState(true);

  const bubble = useMemo(
    () => (lesson ? getTeacherBubble(lesson) : null),
    [lesson]
  );
  const feedback = useMemo(() => getSessionFeedback(), []);
  const goalSummary = lesson ? getLessonGoalSummary(lesson) : "";
  const languageLabel = lesson ? getLanguageLabel(lesson) : "";
  const focusTopics = lesson?.aiTeacher.focusTopics ?? [];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/learn");
    }
  };

  const handleEndCall = () => {
    if (lesson) {
      completeLesson(lesson.id, lesson.xpReward);
    }
    handleBack();
  };

  if (!lesson || !bubble) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorTitle}>Lesson not found</Text>
        <Pressable onPress={handleBack} style={styles.errorButton}>
          <Text style={styles.errorLink}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeTop}>
        <AudioLessonHeader
          languageLabel={languageLabel}
          lessonTitle={lesson.title}
          streak={streak}
          onBack={handleBack}
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AudioLessonStage
          bubble={bubble}
          subtitlesOn={subtitlesOn}
          onToggleSpeaker={() => {}}
        />

        <AudioLessonControls
          cameraOn={cameraOn}
          micOn={micOn}
          subtitlesOn={subtitlesOn}
          onToggleCamera={() => setCameraOn((value) => !value)}
          onToggleMic={() => setMicOn((value) => !value)}
          onToggleSubtitles={() => setSubtitlesOn((value) => !value)}
          onEndCall={handleEndCall}
        />

        <AudioLessonFeedbackCard
          feedback={feedback}
          goalSummary={goalSummary}
          focusTopics={focusTopics}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: audioLessonColors.background,
  },
  safeTop: {
    backgroundColor: audioLessonColors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  safeArea: {
    flex: 1,
    backgroundColor: audioLessonColors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: audioLessonSpacing.xl,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: audioLessonColors.textPrimary,
  },
  errorButton: {
    marginTop: audioLessonSpacing.lg,
  },
  errorLink: {
    fontSize: 16,
    fontWeight: "600",
    color: audioLessonColors.purple,
  },
});
