import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AudioLessonAgentStatusCard } from "@/components/audio-lesson/audio-lesson-agent-status";
import { AudioLessonCallStatusCard } from "@/components/audio-lesson/audio-lesson-call-status";
import { AudioLessonControls } from "@/components/audio-lesson/audio-lesson-controls";
import { AudioLessonFeedbackCard } from "@/components/audio-lesson/audio-lesson-feedback-card";
import { AudioLessonHeader } from "@/components/audio-lesson/audio-lesson-header";
import { AudioLessonStage } from "@/components/audio-lesson/audio-lesson-stage";
import { StreamVideoProvider } from "@/components/stream/stream-video-provider";
import { audioLessonColors, audioLessonSpacing } from "@/constants/audio-lesson-ui";
import { getLessonById } from "@/data/lessons";
import { useAudioLessonCaptions } from "@/hooks/use-audio-lesson-captions";
import {
  AudioLessonCallManager,
  type AudioLessonCallControls,
} from "@/hooks/use-audio-lesson-call";
import {
  getLanguageLabel,
  getLessonGoalSummary,
  getSessionFeedback,
  getTeacherBubble,
  type TeacherBubble,
} from "@/lib/audio-lesson-display";
import { posthog } from "@/lib/posthog";
import { useLearningStore } from "@/store/learning";
import type { Lesson } from "@/types/learning";

type AudioLessonSessionProps = {
  lesson: Lesson;
  bubble: TeacherBubble;
  call: AudioLessonCallControls;
  subtitlesOn: boolean;
  languageLabel: string;
  goalSummary: string;
  focusTopics: string[];
  streak: number;
  onBack: () => void;
  onToggleSubtitles: () => void;
  onCompleteLesson: () => void;
};

function AudioLessonActiveSession({
  lesson,
  bubble,
  call,
  subtitlesOn,
  languageLabel,
  goalSummary,
  focusTopics,
  streak,
  onBack,
  onToggleSubtitles,
  onCompleteLesson,
}: AudioLessonSessionProps) {
  const { teacherCaption, learnerCaption } = useAudioLessonCaptions();
  const feedback = useMemo(() => getSessionFeedback(), []);

  const controlsDisabled =
    call.status === "loading" ||
    call.status === "connecting" ||
    call.status === "ended" ||
    call.status === "error";

  const handleEndCall = async () => {
    await call.endCall();
    onCompleteLesson();
    onBack();
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeTop}>
        <AudioLessonHeader
          languageLabel={languageLabel}
          lessonTitle={lesson.title}
          streak={streak}
          onBack={onBack}
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AudioLessonStage
          bubble={bubble}
          subtitlesOn={subtitlesOn}
          teacherCaption={teacherCaption}
          learnerCaption={learnerCaption}
          onToggleSpeaker={() => {}}
        />

        <AudioLessonCallStatusCard
          status={call.status}
          userName={call.userName}
          languageLabel={languageLabel}
          error={call.error}
          onRetry={call.retryJoin}
        />

        <AudioLessonAgentStatusCard
          status={call.agentStatus}
          error={call.agentError}
        />

        <AudioLessonControls
          cameraOn={false}
          micOn={call.micEnabled}
          subtitlesOn={subtitlesOn}
          cameraDisabled
          micDisabled={controlsDisabled}
          endDisabled={controlsDisabled && call.status !== "error"}
          onToggleCamera={() => {}}
          onToggleMic={() => void call.toggleMic()}
          onToggleSubtitles={onToggleSubtitles}
          onEndCall={() => void handleEndCall()}
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

export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = id ? getLessonById(id) : undefined;

  const streak = useLearningStore((state) => state.streak);
  const completeLesson = useLearningStore((state) => state.completeLesson);

  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const lessonStartTimeRef = useRef<number | null>(null);
  const lessonCompletedRef = useRef(false);
  const abandonedCapturedRef = useRef(false);

  const bubble = useMemo(
    () => (lesson ? getTeacherBubble(lesson) : null),
    [lesson],
  );
  const goalSummary = lesson ? getLessonGoalSummary(lesson) : "";
  const languageLabel = lesson ? getLanguageLabel(lesson) : "";
  const focusTopics = lesson?.aiTeacher.focusTopics ?? [];

  const captureLessonAbandoned = useCallback(() => {
    if (
      !lesson ||
      lessonCompletedRef.current ||
      abandonedCapturedRef.current
    ) {
      return;
    }

    abandonedCapturedRef.current = true;
    const startTime = lessonStartTimeRef.current ?? Date.now();

    posthog.capture("lesson_abandoned", {
      lesson_id: lesson.id,
      time_into_lesson_seconds: Math.floor((Date.now() - startTime) / 1000),
      last_question_index: 0,
    });
  }, [lesson]);

  useEffect(() => {
    if (!lesson) {
      return;
    }

    lessonStartTimeRef.current = Date.now();
    lessonCompletedRef.current = false;
    abandonedCapturedRef.current = false;

    posthog.capture("lesson_started", {
      lesson_id: lesson.id,
      language: lesson.languageId,
      lesson_number: lesson.order,
    });

    return () => {
      captureLessonAbandoned();
    };
  }, [lesson, captureLessonAbandoned]);

  const handleBack = () => {
    captureLessonAbandoned();

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/learn");
    }
  };

  const handleCompleteLesson = () => {
    lessonCompletedRef.current = true;

    if (lesson) {
      completeLesson(lesson.id, lesson.xpReward);
    }
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
    <StreamVideoProvider>
      <AudioLessonCallManager lessonId={lesson.id}>
        {(call) => (
          <AudioLessonActiveSession
            lesson={lesson}
            bubble={bubble}
            call={call}
            subtitlesOn={subtitlesOn}
            languageLabel={languageLabel}
            goalSummary={goalSummary}
            focusTopics={focusTopics}
            streak={streak}
            onBack={handleBack}
            onToggleSubtitles={() => setSubtitlesOn((value) => !value)}
            onCompleteLesson={handleCompleteLesson}
          />
        )}
      </AudioLessonCallManager>
    </StreamVideoProvider>
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
    paddingBottom: audioLessonSpacing.md,
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
