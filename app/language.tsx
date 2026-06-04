import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import type { LanguageId } from "@/types/learning";

const POPULAR_COUNT = 6;

export default function LanguageScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<LanguageId>("es");
  const [showAll, setShowAll] = useState(false);

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const base = query
      ? languages.filter(
          (lang) =>
            lang.name.toLowerCase().includes(query) ||
            lang.nativeName.toLowerCase().includes(query)
        )
      : languages;

    if (!query && !showAll) {
      return base.slice(0, POPULAR_COUNT);
    }

    return base;
  }, [searchQuery, showAll]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View className="mt-1 h-12 flex-row items-center px-4">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          unstable_pressDelay={0}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          className="z-[1] h-10 w-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={28} color="#0D132B" />
        </Pressable>
        <Text className="absolute inset-x-0 text-center text-[17px] font-semibold text-foreground">
          Choose a language
        </Text>
      </View>

      {/* Search */}
      <View className="mx-4 mt-2 h-12 flex-row items-center rounded-3xl border border-border bg-white px-4">
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search languages"
          placeholderTextColor="#9CA3AF"
          className="ml-2.5 flex-1 text-base font-normal text-foreground"
        />
      </View>

      {/* Popular */}
      {!searchQuery.trim() && (
        <Text className="mx-4 mb-2 mt-4 text-base font-semibold text-foreground">
          Popular
        </Text>
      )}

      {/* Scrollable Language List */}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={filteredLanguages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: lang }) => {
          const isSelected = lang.id === selectedId;
          return (
            <Pressable
              onPress={() => setSelectedId(lang.id)}
              unstable_pressDelay={0}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
              className={`mb-2 flex-row items-center rounded-2xl px-4 py-4 ${
                isSelected
                  ? "border border-lingua-purple bg-[#F3F0FF]"
                  : "border border-transparent"
              }`}
            >
              {/* Larger flag */}
              <Image
                source={{ uri: lang.flagEmoji }}
                style={{ width: 52, height: 52, borderRadius: 26 }}
                contentFit="cover"
              />
              <View className="ml-4 flex-1">
                <Text className="text-[17px] font-semibold text-foreground">
                  {lang.name}
                </Text>
                <Text className="mt-0.5 text-sm font-normal text-secondary">
                  {lang.learnerCount}
                </Text>
              </View>
              {isSelected ? (
                <View className="h-8 w-8 items-center justify-center rounded-full bg-lingua-purple">
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              )}
            </Pressable>
          );
        }}
      />

      {/* Continue Button */}
      <Pressable
        unstable_pressDelay={0}
        style={({ pressed }) => ({
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}
        className="mx-4 mb-2 mt-2 h-14 items-center justify-center rounded-2xl bg-lingua-purple"
        onPress={() => console.log(selectedId)}
      >
        <Text className="text-base font-semibold text-white">Continue</Text>
      </Pressable>

      {/* Earth Illustration */}
      <Image
        source={images.earth}
        style={{ width: "100%", height: 160 }}
        contentFit="cover"
      />
    </SafeAreaView>
  );
}