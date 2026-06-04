import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  homeCardShadow,
  homeColors,
  homeSpacing,
} from "@/constants/home-ui";

const CIRCLE_SIZE = 48;

const springConfig = {
  damping: 18,
  stiffness: 220,
  mass: 0.6,
};

type TabIconName = keyof typeof Ionicons.glyphMap;

type TabConfig = {
  routeName: string;
  label: string;
  icon: TabIconName;
  iconActive: TabIconName;
};

const TAB_CONFIG: TabConfig[] = [
  {
    routeName: "index",
    label: "Home",
    icon: "home-outline",
    iconActive: "home",
  },
  {
    routeName: "learn",
    label: "Learn",
    icon: "book-outline",
    iconActive: "book",
  },
  {
    routeName: "ai-teacher",
    label: "AI Teacher",
    icon: "happy-outline",
    iconActive: "happy",
  },
  {
    routeName: "chat",
    label: "Chat",
    icon: "chatbubble-outline",
    iconActive: "chatbubble",
  },
  {
    routeName: "profile",
    label: "Profile",
    icon: "person-outline",
    iconActive: "person",
  },
];

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bottomInset = Math.max(insets.bottom, homeSpacing.sm);

  const barHorizontalPadding = homeSpacing.lg;
  const barWidth = width - barHorizontalPadding * 2;
  const tabRoutes = state.routes.filter(
    (route) => !route.name.startsWith("lesson")
  );
  const tabCount = tabRoutes.length;
  const tabWidth = barWidth / tabCount;

  const activeRoute = state.routes[state.index];
  const isAudioLesson =
    activeRoute?.name === "lesson/[id]" ||
    activeRoute?.name.startsWith("lesson");
  const learnTabIndex = tabRoutes.findIndex((route) => route.name === "learn");
  const highlightedIndex = isAudioLesson && learnTabIndex >= 0
    ? learnTabIndex
    : tabRoutes.findIndex((route) => route.key === activeRoute?.key);

  const indicatorX = useSharedValue(
    highlightedIndex * tabWidth + (tabWidth - CIRCLE_SIZE) / 2
  );

  useEffect(() => {
    indicatorX.value = withSpring(
      highlightedIndex * tabWidth + (tabWidth - CIRCLE_SIZE) / 2,
      springConfig
    );
  }, [highlightedIndex, indicatorX, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomInset }]}>
      <View style={[styles.bar, { width: barWidth }]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, indicatorStyle]}
        />

        {tabRoutes.map((route, index) => {
          const config = TAB_CONFIG.find((tab) => tab.routeName === route.name);
          const descriptor = descriptors[route.key];
          const isFocused = highlightedIndex === index;

          if (!config) {
            return null;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const accessibilityLabel =
            descriptor.options.tabBarAccessibilityLabel ?? config.label;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={accessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              {isFocused ? (
                <View style={styles.activeIconSlot}>
                  <Ionicons
                    name={config.iconActive}
                    size={24}
                    color={homeColors.white}
                  />
                </View>
              ) : (
                <View style={styles.inactiveTab}>
                  <Ionicons
                    name={config.icon}
                    size={22}
                    color={homeColors.tabInactive}
                  />
                  <Text style={styles.tabLabel}>{config.label}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingHorizontal: homeSpacing.lg,
    paddingTop: homeSpacing.sm,
    backgroundColor: homeColors.background,
    ...Platform.select({
      ios: {
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  bar: {
    position: "relative",
    flexDirection: "row",
    height: 64,
    borderRadius: 24,
    backgroundColor: homeColors.white,
    borderWidth: 1,
    borderColor: homeColors.border,
    ...homeCardShadow(4),
  },
  indicator: {
    position: "absolute",
    top: 8,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: homeColors.purple,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconSlot: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: homeSpacing.xs,
  },
  tabLabel: {
    marginTop: homeSpacing.xs,
    fontSize: 10,
    fontWeight: "500",
    color: homeColors.tabInactive,
  },
});
