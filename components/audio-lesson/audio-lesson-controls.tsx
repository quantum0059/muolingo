import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  audioLessonColors,
  audioLessonRadius,
  audioLessonSpacing,
} from "@/constants/audio-lesson-ui";

type AudioLessonControlsProps = {
  cameraOn: boolean;
  micOn: boolean;
  subtitlesOn: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onToggleSubtitles: () => void;
  onEndCall: () => void;
};

type ControlConfig = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  variant: "navy" | "white" | "red";
  onPress: () => void;
};

export function AudioLessonControls({
  cameraOn,
  micOn,
  subtitlesOn,
  onToggleCamera,
  onToggleMic,
  onToggleSubtitles,
  onEndCall,
}: AudioLessonControlsProps) {
  const controls: ControlConfig[] = [
    {
      key: "camera",
      label: "Camera",
      icon: cameraOn ? "videocam" : "videocam-outline",
      active: cameraOn,
      variant: cameraOn ? "navy" : "white",
      onPress: onToggleCamera,
    },
    {
      key: "mic",
      label: "Mic",
      icon: micOn ? "mic" : "mic-outline",
      active: micOn,
      variant: micOn ? "navy" : "white",
      onPress: onToggleMic,
    },
    {
      key: "subtitles",
      label: "Subtitles",
      icon: "language-outline",
      active: subtitlesOn,
      variant: subtitlesOn ? "navy" : "white",
      onPress: onToggleSubtitles,
    },
    {
      key: "end",
      label: "End Call",
      icon: "call",
      variant: "red",
      onPress: onEndCall,
    },
  ];

  return (
    <View style={styles.row}>
      {controls.map((control) => (
        <View key={control.key} style={styles.item}>
          <Pressable
            onPress={control.onPress}
            accessibilityRole="button"
            accessibilityLabel={control.label}
            style={({ pressed }) => [
              styles.button,
              control.variant === "navy" && styles.buttonNavy,
              control.variant === "white" && styles.buttonWhite,
              control.variant === "red" && styles.buttonRed,
              { opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Ionicons
              name={control.icon}
              size={22}
              color={
                control.variant === "white"
                  ? audioLessonColors.navy
                  : audioLessonColors.white
              }
              style={control.key === "end" ? styles.endIcon : undefined}
            />
          </Pressable>
          <Text style={styles.label}>{control.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: audioLessonSpacing.xl + 4,
    paddingTop: audioLessonSpacing.lg,
    paddingBottom: audioLessonSpacing.md,
  },
  item: {
    alignItems: "center",
    gap: audioLessonSpacing.sm,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: audioLessonRadius.control,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonNavy: {
    backgroundColor: audioLessonColors.navy,
  },
  buttonWhite: {
    backgroundColor: audioLessonColors.white,
    borderWidth: 1,
    borderColor: audioLessonColors.border,
  },
  buttonRed: {
    backgroundColor: audioLessonColors.red,
  },
  endIcon: {
    transform: [{ rotate: "135deg" }],
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: audioLessonColors.controlLabel,
  },
});
