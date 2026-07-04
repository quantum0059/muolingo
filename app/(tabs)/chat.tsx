import { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as Speech from "expo-speech";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useLanguageStore } from "@/store/language";
import { getLanguageById } from "@/data/languages";
import { fetchApi } from "@/lib/api";
import { useRouter } from "expo-router";
import type { LanguageId } from "@/types/learning";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const speechLocales: Record<LanguageId, string> = {
  es: "es-ES",
  fr: "fr-FR",
  ja: "ja-JP",
  ko: "ko-KR",
  de: "de-DE",
  zh: "zh-CN",
};

function getPronunciationText(content: string) {
  const quotedPhrases = Array.from(
    content.matchAll(/["“]([^"”]+)["”]/g),
    (match) => match[1]?.trim()
  ).filter(Boolean);

  if (quotedPhrases.length > 0) {
    return quotedPhrases.join(". ");
  }

  return content.replace(/[👏😊🙂😀]/g, "").trim();
}

export default function ChatScreen() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { selectedLanguageId } = useLanguageStore();
  const language = selectedLanguageId ? getLanguageById(selectedLanguageId) : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(
    null
  );
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (language && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hi! Let's practice ${language.name}. How can I help you today?`,
        },
      ]);
    }
  }, [language, messages.length]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !selectedLanguageId) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const token = await getToken();
      const res = await fetchApi("/api/chat", {
        method: "POST",
        clerkToken: token,
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          languageId: selectedLanguageId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Sorry, I had trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakMessage = async (message: Message, index: number) => {
    if (!selectedLanguageId || message.role !== "assistant") {
      return;
    }

    if (speakingMessageIndex === index) {
      await Speech.stop();
      setSpeakingMessageIndex(null);
      return;
    }

    await Speech.stop();
    setSpeakingMessageIndex(index);

    Speech.speak(getPronunciationText(message.content), {
      language: speechLocales[selectedLanguageId],
      pitch: 1,
      rate: 0.9,
      onDone: () => setSpeakingMessageIndex(null),
      onStopped: () => setSpeakingMessageIndex(null),
      onError: () => setSpeakingMessageIndex(null),
    });
  };

  if (!selectedLanguageId || !language) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text--h2 text-center text-foreground">
            No Language Selected
          </Text>
          <Text className="text--body-md mt-2 text-center text-secondary">
            Please choose a language to start chatting with your AI tutor.
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-full bg-primary px-8 py-4"
            onPress={() => router.push("/(tabs)/learn")}
          >
            <Text className="text--body-lg text-center font-bold text-white">
              Go to Learn
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderMessage = ({
    item,
    index,
  }: {
    item: Message;
    index: number;
  }) => {
    const isUser = item.role === "user";
    const isSystem = item.role === "system";
    const isAssistant = item.role === "assistant";
    const isSpeaking = speakingMessageIndex === index;

    if (isSystem) {
      return (
        <View className="my-2 items-center">
          <Text className="text--body-sm text-secondary">{item.content}</Text>
        </View>
      );
    }

    return (
      <View
        className={`mb-4 max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "self-end rounded-tr-sm bg-primary"
            : "self-start rounded-tl-sm bg-gray-100"
        }`}
      >
        {isAssistant ? (
          <View className="mb-2 flex-row justify-end">
            <TouchableOpacity
              onPress={() => speakMessage(item, index)}
              accessibilityRole="button"
              accessibilityLabel={
                isSpeaking
                  ? `Stop ${language.name} pronunciation`
                  : `Play ${language.name} pronunciation`
              }
              className="h-8 w-8 items-center justify-center rounded-full bg-white"
              style={styles.pronunciationButton}
            >
              <Ionicons
                name={isSpeaking ? "stop" : "mic"}
                size={15}
                color="#6C47FF"
              />
            </TouchableOpacity>
          </View>
        ) : null}
        <Text
          className={`text--body-md ${isUser ? "text-white" : "text-foreground"}`}
        >
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.brandLabel}>Duolingo</Text>
          <Text className="text--h3 text-center text-foreground">
            {language.name} Tutor
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View className="border-t border-gray-200 bg-white px-4 py-3 pb-8">
          <View className="flex-row items-center rounded-full border border-gray-300 bg-gray-50 px-4 py-2">
            <TextInput
              className="text--body-md flex-1 text-foreground"
              placeholder={`Chat in ${language.name}...`}
              placeholderTextColor="#9CA3AF"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              editable={!isLoading}
            />
            {isLoading ? (
              <ActivityIndicator size="small" color="#58CC02" style={{ marginLeft: 8 }} />
            ) : (
              <TouchableOpacity
                onPress={sendMessage}
                disabled={!input.trim()}
                className={`ml-2 rounded-full p-2 ${
                  input.trim() ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <Ionicons
                  name="send"
                  size={16}
                  color={input.trim() ? "white" : "#9CA3AF"}
                  style={{ marginLeft: 2 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  brandLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#6C47FF",
    marginBottom: 4,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  pronunciationButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
