import { useAuth, useUser } from "@clerk/expo";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";

import { audioLessonColors, audioLessonSpacing } from "@/constants/audio-lesson-ui";
import { fetchStreamToken } from "@/lib/stream";

type StreamVideoProviderProps = {
  children: ReactNode;
};

export function StreamVideoProvider({ children }: StreamVideoProviderProps) {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const getTokenRef = useRef(getToken);
  const [client, setClient] = useState<StreamVideoClient>();
  const [error, setError] = useState<string | null>(null);

  getTokenRef.current = getToken;

  const streamUser = useMemo(() => {
    if (!user?.id) {
      return null;
    }

    return {
      id: user.id,
      type: "authenticated" as const,
      name:
        user.fullName ??
        user.primaryEmailAddress?.emailAddress ??
        "Language learner",
      image: user.imageUrl,
    };
    // Keep the Stream client stable while Clerk hydrates profile fields.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reconnect when user id changes
  }, [user?.id]);

  useEffect(() => {
    let active = true;
    let videoClient: StreamVideoClient | undefined;

    async function connect() {
      if (!isLoaded || !isSignedIn || !streamUser) {
        setClient(undefined);
        return;
      }

      try {
        setError(null);
        const clerkToken = await getTokenRef.current();
        if (!clerkToken) {
          throw new Error("Missing Clerk session token.");
        }

        const credentials = await fetchStreamToken(clerkToken);
        if (!active) {
          return;
        }

        const tokenProvider = async () => {
          const refreshedClerkToken = await getTokenRef.current();
          if (!refreshedClerkToken) {
            throw new Error("Missing Clerk session token.");
          }
          const refreshed = await fetchStreamToken(refreshedClerkToken);
          return refreshed.token;
        };

        videoClient = StreamVideoClient.getOrCreateInstance({
          apiKey: credentials.apiKey,
          user: streamUser,
          token: credentials.token,
          tokenProvider,
        });

        if (active) {
          setClient(videoClient);
        }
      } catch (connectError) {
        console.error("Stream client connection failed:", connectError);
        if (active) {
          setError(
            connectError instanceof Error
              ? connectError.message
              : "Failed to connect to Stream.",
          );
          setClient(undefined);
        }
      }
    }

    connect();

    return () => {
      active = false;
      if (videoClient) {
        videoClient.disconnectUser().catch((disconnectError) => {
          console.error("Stream disconnect failed:", disconnectError);
        });
      }
      setClient(undefined);
    };
  }, [isLoaded, isSignedIn, streamUser]);

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={audioLessonColors.purple} />
      </View>
    );
  }

  if (!isSignedIn || !streamUser) {
    return <>{children}</>;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={audioLessonColors.purple} />
        <Text style={styles.loadingText}>Connecting to lesson audio…</Text>
      </View>
    );
  }

  return <StreamVideo client={client}>{children}</StreamVideo>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: audioLessonSpacing.xl,
    backgroundColor: audioLessonColors.background,
    gap: audioLessonSpacing.md,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
    color: audioLessonColors.textSecondary,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    color: audioLessonColors.red,
    textAlign: "center",
  },
});
