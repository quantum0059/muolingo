import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text--h2 text-foreground">Chat</Text>
        <Text className="text--body-md mt-2 text-center text-secondary">
          AI tutor chat coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
