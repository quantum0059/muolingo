import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import type { LanguageId } from "@/types/learning";

const HORIZONTAL_PADDING = 16;
const PURPLE = "#6C4EF5";
const SELECTED_BG = "#F3F0FF";
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
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#0D132B" />
        </Pressable>
        <Text style={styles.headerTitle}>Choose a language</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search languages"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* Popular */}
      {!searchQuery.trim() && (
        <Text style={styles.sectionTitle}>Popular</Text>
      )}

      {/* Scrollable Language List */}
      <FlatList
        style={styles.languageList}
        contentContainerStyle={styles.languageListContent}
        data={filteredLanguages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: lang }) => {
          const isSelected = lang.id === selectedId;
          return (
            <Pressable
              onPress={() => setSelectedId(lang.id)}
              style={[
                styles.languageRow,
                isSelected && styles.languageRowSelected,
              ]}
            >
              <Image
                source={{ uri: lang.flagEmoji }}
                style={styles.flag}
                contentFit="cover"
              />
              <View style={styles.languageText}>
                <Text style={styles.languageName}>{lang.name}</Text>
                <Text style={styles.learnerCount}>{lang.learnerCount}</Text>
              </View>
              {isSelected ? (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              )}
            </Pressable>
          );
        }}
      />

      {/* Continue Button — sits between list and earth */}
      <Pressable
        style={styles.continueButton}
        onPress={() => console.log(selectedId)}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>

      {/* Earth Illustration */}
      <Image
        source={images.earth}
        style={styles.earth}
        contentFit="cover"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 4,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#0D132B",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: HORIZONTAL_PADDING,
    marginTop: 8,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#0D132B",
  },

  sectionTitle: {
    marginHorizontal: HORIZONTAL_PADDING,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#0D132B",
  },

  languageList: {
    flex: 1,
  },

  languageListContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 16,
  },

  languageRowSelected: {
    borderWidth: 1,
    borderColor: PURPLE,
    backgroundColor: SELECTED_BG,
  },

  flag: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  languageText: {
    flex: 1,
    marginLeft: 14,
  },

  languageName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#0D132B",
  },

  learnerCount: {
    marginTop: 2,
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6B7280",
  },

  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  // Continue button sits in normal flow between list and earth
  continueButton: {
    height: 56,
    marginHorizontal: HORIZONTAL_PADDING,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },

  // Earth fills the remaining bottom space
  earth: {
    width: "100%",
    height: 160,
  },
});