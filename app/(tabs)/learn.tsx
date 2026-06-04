import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LearnScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text--h2 text-foreground">Learn</Text>
        <Text className="text--body-md mt-2 text-center text-secondary">
          Lessons and units coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
