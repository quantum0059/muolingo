import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

const CIRCLE_SIZE = 48;
const TAB_COUNT = 5;

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
    icon: "sparkles-outline",
    iconActive: "sparkles",
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

const springConfig = {
  damping: 18,
  stiffness: 220,
  mass: 0.6,
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabWidth = width / TAB_COUNT;
  const indicatorX = useSharedValue(
    state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2
  );

  useEffect(() => {
    indicatorX.value = withSpring(
      state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2,
      springConfig
    );
  }, [indicatorX, state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      className="border-t border-border bg-white"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      <View className="relative h-[64px] flex-row">
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 8,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              backgroundColor: colors.primary.purple,
            },
            indicatorStyle,
          ]}
        />

        {state.routes.map((route, index) => {
          const config = TAB_CONFIG.find((tab) => tab.routeName === route.name);
          const descriptor = descriptors[route.key];
          const isFocused = state.index === index;

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
              className="flex-1 items-center justify-center"
            >
              {isFocused ? (
                <View
                  className="items-center justify-center"
                  style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                >
                  <Ionicons
                    name={config.iconActive}
                    size={24}
                    color={colors.neutral.background}
                  />
                </View>
              ) : (
                <View className="items-center justify-center gap-0.5 pt-1">
                  <Ionicons
                    name={config.icon}
                    size={22}
                    color={colors.neutral.secondary}
                  />
                  <Text className="text-[10px] font-medium text-secondary">
                    {config.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
