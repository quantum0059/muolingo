import { permissions } from "@stream-io/react-native-webrtc";
import { Platform } from "react-native";

/**
 * Requests OS-level microphone access before Stream publishes audio.
 * On native, this shows the system permission dialog.
 */
async function requestWebMicrophonePermission(): Promise<boolean> {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    console.error("Failed to request web microphone permission:", error);
    return false;
  }
}

export async function requestDeviceMicrophonePermission(): Promise<boolean> {
  if (Platform.OS === "web") {
    return requestWebMicrophonePermission();
  }

  try {
    const granted = await permissions.request({ name: "microphone" });
    return Boolean(granted);
  } catch (error) {
    console.error("Failed to request microphone permission:", error);
    return false;
  }
}

export async function hasDeviceMicrophonePermission(): Promise<boolean> {
  if (Platform.OS === "web") {
    if (!navigator.permissions?.query) {
      return false;
    }

    try {
      const status = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      return status.state === "granted";
    } catch {
      return false;
    }
  }

  try {
    const status = await permissions.query({ name: "microphone" });
    return status === permissions.RESULT.GRANTED;
  } catch {
    return false;
  }
}
