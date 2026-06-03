import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type AuthInputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences";
  error?: string | null;
};

export function AuthInputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  error = null,
}: AuthInputFieldProps) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View>
      <View
        className={`rounded-2xl border px-4 py-3 ${
          error ? "border-red-400" : "border-border"
        }`}
      >
        <Text className="text--caption text-secondary">{label}</Text>
        <View className="mt-1 flex-row items-center">
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={hidden}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            className="text--body-md min-h-[24px] flex-1 text-foreground"
            style={styles.input}
          />
          {secureTextEntry ? (
            <Pressable
              onPress={() => setHidden((prev) => !prev)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={hidden ? "Show password" : "Hide password"}
            >
              <Ionicons
                name={hidden ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#9CA3AF"
              />
            </Pressable>
          ) : null}
        </View>
      </View>
      {error ? (
        <Text className="text--body-sm mt-1.5 px-1 text-red-500">{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 0,
    margin: 0,
  },
});
