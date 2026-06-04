import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text--h2 text-foreground">Home</Text>
        <Text className="text--body-md mt-2 text-center text-secondary">
          Home screen UI coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
