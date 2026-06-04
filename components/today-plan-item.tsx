import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  homeCardShadow,
  homeColors,
  homeRadius,
  homeSpacing,
} from "@/constants/home-ui";

import type { TodayPlanItem } from "@/lib/home-plan";

type TodayPlanItemRowProps = {
  item: TodayPlanItem;
  completed: boolean;
  onToggle?: () => void;
};

function PlanIcon({ item }: { item: TodayPlanItem }) {
  if (item.icon === "words") {
    return <Text style={styles.ghostIcon}>👻</Text>;
  }

  const iconName = item.icon === "book" ? "book" : "headset";
  return <Ionicons name={iconName} size={22} color={homeColors.white} />;
}

export function TodayPlanItemRow({
  item,
  completed,
  onToggle,
}: TodayPlanItemRowProps) {
  const isWords = item.icon === "words";

  return (
    <Pressable
      onPress={onToggle}
      disabled={!onToggle}
      unstable_pressDelay={0}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed && onToggle ? 0.7 : 1 },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          isWords ? styles.wordsIconBox : styles.purpleIconBox,
        ]}
      >
        <PlanIcon item={item} />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>

      <View
        style={[
          styles.statusCircle,
          completed ? styles.statusCompleted : styles.statusPending,
        ]}
      >
        {completed ? (
          <Ionicons name="checkmark" size={14} color={homeColors.white} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: homeColors.white,
    borderRadius: homeRadius.lg,
    paddingHorizontal: homeSpacing.lg,
    paddingVertical: homeSpacing.md,
    ...homeCardShadow(2),
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: homeRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  purpleIconBox: {
    backgroundColor: homeColors.purple,
  },
  wordsIconBox: {
    backgroundColor: homeColors.coral,
  },
  ghostIcon: {
    fontSize: 24,
  },
  textWrap: {
    flex: 1,
    marginLeft: homeSpacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: homeColors.textPrimary,
  },
  subtitle: {
    marginTop: homeSpacing.xs,
    fontSize: 13,
    color: homeColors.textSecondary,
  },
  statusCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCompleted: {
    borderColor: homeColors.purple,
    backgroundColor: homeColors.purple,
  },
  statusPending: {
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
  },
});
