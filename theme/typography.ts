/**
 * Lingua design system — typography scale (Poppins)
 */
export const typography = {
  h1: {
    usage: "Page / Screen Title",
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 1.2,
    fontFamily: "Poppins-Bold",
  },
  h2: {
    usage: "Section Title",
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 1.3,
    fontFamily: "Poppins-SemiBold",
  },
  h3: {
    usage: "Card / Module Title",
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 1.3,
    fontFamily: "Poppins-SemiBold",
  },
  h4: {
    usage: "Subheading",
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 1.4,
    fontFamily: "Poppins-Medium",
  },
  bodyLarge: {
    usage: "Important content",
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 1.6,
    fontFamily: "Poppins-Regular",
  },
  bodyMedium: {
    usage: "Body text",
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 1.6,
    fontFamily: "Poppins-Regular",
  },
  bodySmall: {
    usage: "Supporting text",
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 1.6,
    fontFamily: "Poppins-Regular",
  },
  caption: {
    usage: "Labels, meta text",
    fontSize: 11,
    fontWeight: "400" as const,
    lineHeight: 1.4,
    fontFamily: "Poppins-Regular",
  },
} as const;

export type Typography = typeof typography;
