import { Platform, type ViewStyle } from "react-native";

/** Learn / lesson list screen — matches prompt_material/06-lesson-screen.png */
export const learnColors = {
  background: "#FFFFFF",
  sheetBg: "#FFFFFF",
  textPrimary: "#1A1F36",
  textSecondary: "#8B93A7",
  textMuted: "#9CA3AF",
  purple: "#6C4EF5",
  purpleLight: "#F3F0FF",
  purpleBorder: "#6C4EF5",
  tabTrack: "#ECE9F8",
  green: "#21C16B",
  lockBg: "#F0F1F5",
  lockIcon: "#B8BEC9",
  orange: "#FF8A00",
  border: "#ECEEF4",
} as const;

export const learnSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const learnRadius = {
  card: 20,
  tab: 26,
  tabInner: 22,
  icon: 12,
} as const;

export function learnCardShadow(elevation = 2): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: "#1A1F36",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: elevation * 4,
    },
    android: { elevation },
    default: {},
  }) as ViewStyle;
}
