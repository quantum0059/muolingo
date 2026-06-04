import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  learnCardShadow,
  learnColors,
  learnRadius,
  learnSpacing,
} from "@/constants/learn-ui";

type LearnTab = "lessons" | "practice";

type LearnTabSwitcherProps = {
  activeTab: LearnTab;
  onTabChange: (tab: LearnTab) => void;
};

export function LearnTabSwitcher({
  activeTab,
  onTabChange,
}: LearnTabSwitcherProps) {
  return (
    <View style={styles.track}>
      <Pressable
        onPress={() => onTabChange("lessons")}
        style={[styles.segment, activeTab === "lessons" && styles.segmentActive]}
      >
        <Text
          style={[
            styles.label,
            activeTab === "lessons" && styles.labelActive,
          ]}
        >
          Lessons
        </Text>
        {activeTab === "lessons" ? <View style={styles.indicator} /> : null}
      </Pressable>

      <Pressable
        onPress={() => onTabChange("practice")}
        style={[
          styles.segment,
          activeTab === "practice" && styles.segmentActive,
        ]}
      >
        <Text
          style={[
            styles.label,
            activeTab === "practice" && styles.labelActive,
          ]}
        >
          Practice
        </Text>
        {activeTab === "practice" ? <View style={styles.indicator} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    height: 48,
    borderRadius: learnRadius.tab,
    backgroundColor: learnColors.tabTrack,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: learnRadius.tabInner,
    position: "relative",
  },
  segmentActive: {
    backgroundColor: learnColors.background,
    ...learnCardShadow(2),
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: learnColors.textMuted,
  },
  labelActive: {
    color: learnColors.purple,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: learnSpacing.lg,
    right: learnSpacing.lg,
    height: 3,
    borderRadius: 2,
    backgroundColor: learnColors.purple,
  },
});
