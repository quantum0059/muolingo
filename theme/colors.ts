/**
 * Lingua design system — color tokens (matches prompt_material/01-design-system.png)
 */
export const colors = {
  primary: {
    purple: "#6C4EF5",
    deepPurple: "#5B3BF6",
    blue: "#4D8BFF",
    green: "#21C16B",
  },
  semantic: {
    success: "#21C16B",
    warning: "#FFC800",
    streak: "#FF8A00",
    error: "#FF4D4F",
    info: "#4D8BFF",
  },
  neutral: {
    /** TEXT / PRIMARY */
    foreground: "#0D132B",
    /** TEXT / SECONDARY */
    secondary: "#6B7280",
    border: "#E5E7EB",
    surface: "#F6F7FB",
    background: "#FFFFFF",
  },
} as const;

export type Colors = typeof colors;
