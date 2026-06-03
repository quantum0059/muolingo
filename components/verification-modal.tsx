import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function VerificationModal({ visible, onClose }: VerificationModalProps) {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (visible) {
      setCode("");
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
    Keyboard.dismiss();
    return undefined;
  }, [visible]);

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);

    if (digits.length === CODE_LENGTH) {
      Keyboard.dismiss();
      onClose();
      router.replace("/");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="mx-6 rounded-3xl bg-background px-6 pb-8 pt-6 shadow-lg">
              <Pressable
                onPress={onClose}
                className="mb-4 self-end"
                accessibilityRole="button"
                accessibilityLabel="Close verification"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>

              <Text className="text--h3 text-center text-foreground">
                Check your email
              </Text>
              <Text className="text--body-md mt-2 text-center text-secondary">
                We sent you a verification code. Enter the 6-digit code below to
                continue.
              </Text>

              <Pressable
                className="mt-8 flex-row justify-center gap-2.5"
                onPress={() => inputRef.current?.focus()}
                accessibilityRole="button"
                accessibilityLabel="Enter verification code"
              >
                {Array.from({ length: CODE_LENGTH }).map((_, index) => {
                  const digit = code[index] ?? "";
                  const isActive = index === code.length;

                  return (
                    <View
                      key={index}
                      className={`h-14 w-11 items-center justify-center rounded-xl border-2 ${
                        isActive ? "border-lingua-purple" : "border-border"
                      } bg-surface`}
                    >
                      <Text className="text--h3 text-foreground">{digit}</Text>
                    </View>
                  );
                })}
              </Pressable>

              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                style={styles.hiddenInput}
                accessibilityLabel="Verification code input"
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(13, 19, 43, 0.45)",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 8 : 16,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});
