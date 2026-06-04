import { Platform, type ViewStyle } from "react-native";

/** AI Teacher audio lesson — matches prompt_material/07-audio-lesson-screen.png */
export const audioLessonColors = {
  background: "#FFFFFF",
  textPrimary: "#1A1F36",
  textSecondary: "#8B93A7",
  online: "#21C16B",
  purple: "#6C4EF5",
  purpleDeep: "#5B3FE8",
  purpleLight: "#F3F0FF",
  navy: "#2D3A5C",
  navyMuted: "#4A5568",
  red: "#FF4D4F",
  redDeep: "#E53935",
  green: "#21C16B",
  blue: "#3B82F6",
  border: "#ECEEF4",
  bubbleBg: "#FFFFFF",
  stageOverlay: "rgba(15, 23, 42, 0.35)",
  controlLabel: "#6B7280",
  white: "#FFFFFF",
} as const;

export const audioLessonSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const audioLessonRadius = {
  stage: 24,
  pip: 14,
  bubble: 20,
  control: 32,
  feedback: 20,
  badge: 18,
} as const;

export function audioLessonShadow(elevation = 2): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: "#1A1F36",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: elevation * 4,
    },
    android: { elevation },
    default: {},
  }) as ViewStyle;
}
