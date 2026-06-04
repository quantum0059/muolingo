import { Platform, type ViewStyle } from "react-native";

/** Home screen design tokens — matches prompt_material/05-home-and-tab-navigation.png */
export const homeColors = {
  background: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  purple: "#6D4AFF",
  purpleDeep: "#5B3FE8",
  purpleGlow: "#4D5BF6",
  orange: "#FF8A00",
  beige: "#F7F2EA",
  beigeTrack: "#E8E0D4",
  mint: "#EEF6EA",
  green: "#21C16B",
  coral: "#FF8E98",
  border: "#E5E7EB",
  tabInactive: "#9CA3AF",
  white: "#FFFFFF",
} as const;

export const homeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Gap between Today's Plan cards */
export const planCardGap = 10;

export const homeRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 28,
} as const;

export function homeCardShadow(elevation = 3): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: "#0D132B",
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.06,
      shadowRadius: elevation * 3,
    },
    android: { elevation },
    default: {},
  }) as ViewStyle;
}
