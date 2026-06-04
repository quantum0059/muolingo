import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text--h2 text-foreground">Profile</Text>
        <Text className="text--body-md mt-2 text-center text-secondary">
          Your profile and settings coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
