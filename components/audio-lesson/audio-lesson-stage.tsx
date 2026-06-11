import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import {
  audioLessonColors,
  audioLessonRadius,
  audioLessonShadow,
  audioLessonSpacing,
} from "@/constants/audio-lesson-ui";
import { images, remoteImages } from "@/constants/images";
import type { TeacherBubble } from "@/lib/audio-lesson-display";

type AudioLessonStageProps = {
  bubble: TeacherBubble;
  subtitlesOn: boolean;
  teacherCaption: string | null;
  learnerCaption: string | null;
  onToggleSpeaker: () => void;
};

/** ~52% of screen below header — matches design proportions when elongated */
const STAGE_HEIGHT_RATIO = 0.52;
const STAGE_MIN_HEIGHT = 400;

export function AudioLessonStage({
  bubble,
  subtitlesOn,
  teacherCaption,
  learnerCaption,
  onToggleSpeaker,
}: AudioLessonStageProps) {
  const displayTeacherText = subtitlesOn
    ? (teacherCaption ?? bubble.phrase)
    : bubble.phrase;
  const showLearnerCaption = subtitlesOn && Boolean(learnerCaption);
  const { height: windowHeight } = useWindowDimensions();
  const stageHeight = Math.max(
    STAGE_MIN_HEIGHT,
    Math.round(windowHeight * STAGE_HEIGHT_RATIO)
  );

  return (
    <View style={styles.stageWrap}>
      <View style={[styles.stage, { height: stageHeight }]}>
        <Image
          source={{ uri: remoteImages.audioLessonRoom }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.stageOverlay} />

        <View style={styles.pip}>
          <Image
            source={{ uri: remoteImages.learnerPreview }}
            style={styles.pipImage}
            contentFit="cover"
            accessibilityLabel="Your camera preview"
          />
        </View>

        <View style={styles.mascotWrap}>
          <Image
            source={images.mascotWelcome}
            style={styles.mascot}
            contentFit="contain"
            accessibilityLabel="AI teacher"
          />
        </View>

        {showLearnerCaption ? (
          <View style={styles.learnerCaption}>
            <Text style={styles.learnerCaptionLabel}>You</Text>
            <Text style={styles.learnerCaptionText}>{learnerCaption}</Text>
          </View>
        ) : null}

        <View style={styles.bubble}>
          <View style={styles.bubbleTextCol}>
            <Text style={styles.bubblePhrase}>{displayTeacherText}</Text>
            {subtitlesOn && !teacherCaption ? (
              <Text style={styles.bubbleTranslation}>{bubble.translation}</Text>
            ) : null}
          </View>
          <Pressable
            onPress={onToggleSpeaker}
            hitSlop={10}
            accessibilityLabel="Play teacher audio"
            style={({ pressed }) => [
              styles.speakerBtn,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Ionicons
              name="volume-high"
              size={20}
              color={audioLessonColors.purple}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stageWrap: {
    paddingHorizontal: audioLessonSpacing.lg,
    paddingTop: audioLessonSpacing.sm,
  },
  stage: {
    borderRadius: audioLessonRadius.stage,
    overflow: "hidden",
    backgroundColor: audioLessonColors.navy,
    ...audioLessonShadow(4),
  },
  stageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: audioLessonColors.stageOverlay,
  },
  pip: {
    position: "absolute",
    top: audioLessonSpacing.md,
    right: audioLessonSpacing.md,
    width: 72,
    height: 96,
    borderRadius: audioLessonRadius.pip,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: audioLessonColors.white,
    zIndex: 2,
    ...audioLessonShadow(3),
  },
  pipImage: {
    width: "100%",
    height: "100%",
  },
  mascotWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: audioLessonSpacing.xl,
    paddingBottom: 88,
  },
  mascot: {
    width: 248,
    height: 248,
  },
  learnerCaption: {
    position: "absolute",
    left: audioLessonSpacing.lg,
    right: audioLessonSpacing.lg,
    bottom: 96,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: audioLessonRadius.bubble,
    paddingVertical: audioLessonSpacing.sm,
    paddingHorizontal: audioLessonSpacing.md,
    ...audioLessonShadow(2),
  },
  learnerCaptionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: audioLessonColors.purple,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  learnerCaptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: audioLessonColors.textPrimary,
    lineHeight: 21,
  },
  bubble: {
    position: "absolute",
    left: audioLessonSpacing.lg,
    right: audioLessonSpacing.lg,
    bottom: audioLessonSpacing.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: audioLessonColors.bubbleBg,
    borderRadius: audioLessonRadius.bubble,
    paddingVertical: audioLessonSpacing.md,
    paddingLeft: audioLessonSpacing.lg,
    paddingRight: audioLessonSpacing.sm,
    gap: audioLessonSpacing.sm,
    ...audioLessonShadow(3),
  },
  bubbleTextCol: {
    flex: 1,
  },
  bubblePhrase: {
    fontSize: 17,
    fontWeight: "700",
    color: audioLessonColors.textPrimary,
  },
  bubbleTranslation: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "500",
    color: audioLessonColors.textSecondary,
    lineHeight: 20,
  },
  speakerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: audioLessonColors.purpleLight,
    alignItems: "center",
    justifyContent: "center",
  },
});
