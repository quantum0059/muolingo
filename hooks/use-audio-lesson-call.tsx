import { useAuth, useUser } from "@clerk/expo";
import {
  type Call,
  CallingState,
  OwnCapability,
  StreamCall,
  useCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { requestDeviceMicrophonePermission } from "@/lib/request-microphone-permission";
import {
  createStreamLessonCall,
  startVisionAgent,
  stopVisionAgent,
} from "@/lib/stream";

export type AudioLessonCallStatus =
  | "idle"
  | "loading"
  | "connecting"
  | "joined"
  | "muted"
  | "reconnecting"
  | "ended"
  | "error";

export type AudioLessonAgentStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "failed";

export type AudioLessonCallControls = {
  status: AudioLessonCallStatus;
  agentStatus: AudioLessonAgentStatus;
  agentError: string | null;
  error: string | null;
  micEnabled: boolean;
  userName: string;
  toggleMic: () => Promise<void>;
  endCall: () => Promise<void>;
  retryJoin: () => void;
};

type UseAudioLessonCallInput = {
  lessonId: string;
};

const AGENT_USER_ID = "language-teacher";
const SEND_AUDIO_PERMISSION_WAIT_MS = 10_000;

function hasSendAudioPermission(call: Call): boolean {
  const hasPermission = call.permissionsContext.hasPermission(OwnCapability.SEND_AUDIO);
  console.log('[AudioLesson] hasSendAudioPermission check:', hasPermission);
  return hasPermission;
}

async function waitForSendAudioPermission(
  call: Call,
  timeoutMs: number,
): Promise<boolean> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (hasSendAudioPermission(call)) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return hasSendAudioPermission(call);
}

function isLearnerMicPublishing(call: Call): boolean {
  const status = call.microphone.state.status;
  const isEnabled = status === "enabled";
  console.log('[AudioLesson] isLearnerMicPublishing - status:', status, 'isEnabled:', isEnabled);
  return isEnabled;
}

async function publishLearnerMicrophone(call: Call): Promise<void> {
  if (isLearnerMicPublishing(call)) {
    console.log('[AudioLesson] Microphone already publishing');
    return;
  }

  console.log('[AudioLesson] Requesting OS microphone permission...');
  const osGranted = await requestDeviceMicrophonePermission();
  if (!osGranted) {
    throw new Error(
      "Microphone permission is required. Enable it in your device settings, then tap the mic button.",
    );
  }

  console.log('[AudioLesson] Enabling microphone...');
  await call.microphone.enable();
  console.log('[AudioLesson] Microphone enabled successfully');
}

async function ensureSendAudioPermission(call: Call): Promise<void> {
  if (hasSendAudioPermission(call)) {
    console.log('[AudioLesson] Already has send-audio permission');
    return;
  }

  console.log('[AudioLesson] Requesting send-audio permission...');
  try {
    await call.requestPermissions({
      permissions: [OwnCapability.SEND_AUDIO],
    });
  } catch (requestError) {
    console.warn("[AudioLesson] Failed to request send-audio permission:", requestError);
  }

  console.log('[AudioLesson] Waiting for send-audio permission...');
  const granted = await waitForSendAudioPermission(
    call,
    SEND_AUDIO_PERMISSION_WAIT_MS,
  );

  if (!granted) {
    throw new Error(
      "The AI teacher could not get microphone access for this lesson. Tap Try again.",
    );
  }
  console.log('[AudioLesson] send-audio permission granted');
}

function mapCallingStateToStatus(
  callingState: CallingState,
  micEnabled: boolean,
  hasError: boolean,
): AudioLessonCallStatus {
  if (hasError) {
    return "error";
  }

  switch (callingState) {
    case CallingState.JOINED:
      return micEnabled ? "joined" : "muted";
    case CallingState.JOINING:
      return "connecting";
    case CallingState.RECONNECTING:
      return "reconnecting";
    case CallingState.LEFT:
      return "ended";
    case CallingState.IDLE:
    case CallingState.UNKNOWN:
      return "loading";
    default:
      return "connecting";
  }
}

type AgentSessionRef = {
  callId: string;
  sessionId: string;
};

export function useAudioLessonCall(): AudioLessonCallControls {
  const { getToken } = useAuth();
  const { user } = useUser();
  const call = useCall();
  const {
    useCallCallingState,
    useIsCallLive,
    useMicrophoneState,
    useParticipants,
  } = useCallStateHooks();
  const callingState = useCallCallingState();
  const isCallLive = useIsCallLive();
  const { microphone, isMute } = useMicrophoneState();
  const participants = useParticipants();

  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [error, setError] = useState<string | null>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [agentStatus, setAgentStatus] =
    useState<AudioLessonAgentStatus>("idle");
  const [agentError, setAgentError] = useState<string | null>(null);
  const agentSessionRef = useRef<AgentSessionRef | null>(null);
  const agentStartAttemptRef = useRef(0);
  const userDisabledMicRef = useRef(false);
  const publishMicInFlightRef = useRef(false);
  const micPublishedRef = useRef(false);

  const userName =
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Language learner";
  const status = hasEnded
    ? "ended"
    : mapCallingStateToStatus(callingState, !isMute, Boolean(error));

  const stopAgentSession = useCallback(async () => {
    const session = agentSessionRef.current;
    agentSessionRef.current = null;

    if (!session) {
      return;
    }

    try {
      const clerkToken = await getTokenRef.current();
      if (!clerkToken) {
        return;
      }

      await stopVisionAgent(clerkToken, session);
    } catch (stopError) {
      console.error("Failed to stop AI teacher session:", stopError);
    }
  }, []);

  const startAgentSession = useCallback(
    async (callId: string) => {
      agentStartAttemptRef.current += 1;
      const attempt = agentStartAttemptRef.current;

      setAgentStatus("connecting");
      setAgentError(null);

      try {
        const clerkToken = await getTokenRef.current();
        if (!clerkToken) {
          throw new Error("Missing Clerk session token.");
        }

        const session = await startVisionAgent(clerkToken, {
          callId,
          callType: "audio_room",
        });

        if (attempt !== agentStartAttemptRef.current) {
          await stopVisionAgent(clerkToken, {
            callId: session.callId,
            sessionId: session.sessionId,
          });
          return;
        }

        agentSessionRef.current = {
          callId: session.callId,
          sessionId: session.sessionId,
        };
        setAgentStatus("connected");
      } catch (startError) {
        console.error("Failed to start AI teacher session:", startError);
        if (attempt === agentStartAttemptRef.current) {
          setAgentStatus("failed");
          setAgentError(
            startError instanceof Error
              ? startError.message
              : "Failed to connect the AI teacher.",
          );
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (callingState !== CallingState.JOINED || !call || hasEnded) {
      return;
    }

    if (agentSessionRef.current || agentStatus === "connecting") {
      return;
    }

    void startAgentSession(call.id);
  }, [agentStatus, call, callingState, hasEnded, startAgentSession]);

  useEffect(() => {
    const agentJoined = participants.some(
      (participant) => participant.userId === AGENT_USER_ID,
    );

    if (agentJoined && agentStatus === "connecting") {
      setAgentStatus("connected");
      setAgentError(null);
    }
  }, [agentStatus, participants]);

  const tryPublishLearnerMic = useCallback(async () => {
    console.log('[AudioLesson] tryPublishLearnerMic called');
    console.log('[AudioLesson] Current call state:', {
      hasCall: !!call,
      hasEnded,
      userDisabledMic: userDisabledMicRef.current,
      callingState: call?.state.callingState,
      isCallLive,
      micPublished: micPublishedRef.current,
      publishInFlight: publishMicInFlightRef.current,
    });
    
    if (!call || hasEnded || userDisabledMicRef.current) {
      console.log('[AudioLesson] Early return - call:', !!call, 'hasEnded:', hasEnded, 'userDisabledMic:', userDisabledMicRef.current);
      return;
    }

    if (call.state.callingState !== CallingState.JOINED) {
      console.log('[AudioLesson] Early return - not joined, state:', call.state.callingState);
      return;
    }

    // audio_room only allows publishing after the host goes live.
    console.log('[AudioLesson] isCallLive:', isCallLive);
    if (!isCallLive) {
      console.log('[AudioLesson] Early return - call not live yet');
      return;
    }

    if (micPublishedRef.current && isLearnerMicPublishing(call)) {
      console.log('[AudioLesson] Early return - mic already published');
      return;
    }

    if (publishMicInFlightRef.current) {
      console.log('[AudioLesson] Early return - publish already in flight');
      return;
    }

    console.log('[AudioLesson] Starting microphone publish flow');
    console.log('[AudioLesson] Call ID:', call.id);
    console.log('[AudioLesson] Call type:', call.type);
    
    publishMicInFlightRef.current = true;

    try {
      console.log('[AudioLesson] Checking send-audio permission...');
      const hasPermission = hasSendAudioPermission(call);
      console.log('[AudioLesson] Has send-audio permission:', hasPermission);
      
      await ensureSendAudioPermission(call);
      console.log('[AudioLesson] Publishing microphone...');
      await publishLearnerMicrophone(call);
      
      // Wait a moment for the audio track to actually start transmitting
      console.log('[AudioLesson] Waiting 1 second for audio track to start...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      micPublishedRef.current = isLearnerMicPublishing(call);
      console.log('[AudioLesson] Publish completed - micPublished:', micPublishedRef.current);
      console.log('[AudioLesson] Microphone status:', call.microphone.state.status);

      // Verification: if mic didn't start transmitting after the 1s wait,
      // toggle it off/on once more and give it a longer warm-up.
      if (!micPublishedRef.current) {
        console.log('[AudioLesson] Mic not publishing after enable, retrying...');
        await call.microphone.disable();
        await new Promise(resolve => setTimeout(resolve, 500));
        await call.microphone.enable();
        await new Promise(resolve => setTimeout(resolve, 1500));
        micPublishedRef.current = isLearnerMicPublishing(call);
        console.log('[AudioLesson] Retry result - micPublished:', micPublishedRef.current);
      }
      
      setError(null);
    } catch (micError) {
      console.error("[AudioLesson] Failed to publish learner microphone:", micError);
      setError(
        micError instanceof Error
          ? micError.message
          : "Failed to enable your microphone.",
      );
    } finally {
      publishMicInFlightRef.current = false;
    }
  }, [call, hasEnded, isCallLive]);

  useEffect(() => {
    if (callingState !== CallingState.JOINED || hasEnded) {
      return;
    }

    console.log('[AudioLesson] Triggering mic publish - isCallLive:', isCallLive);
    void tryPublishLearnerMic();
  }, [agentStatus, callingState, hasEnded, isCallLive, tryPublishLearnerMic]);

  // Monitor call live state changes
  useEffect(() => {
    console.log('[AudioLesson] isCallLive changed to:', isCallLive);
  }, [isCallLive]);

  // Monitor participants for debugging
  useEffect(() => {
    const participantInfo = participants.map(p => ({
      userId: p.userId,
      name: p.name,
    }));
    console.log('[AudioLesson] Participants:', JSON.stringify(participantInfo, null, 2));
  }, [participants]);

  useEffect(() => {
    if (
      callingState !== CallingState.JOINED ||
      hasEnded ||
      !isCallLive ||
      micPublishedRef.current
    ) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 8;

    const retryTimer = setInterval(() => {
      if (micPublishedRef.current || attempts >= maxAttempts) {
        clearInterval(retryTimer);
        return;
      }

      attempts += 1;
      void tryPublishLearnerMic();
    }, 3000);

    return () => clearInterval(retryTimer);
  }, [callingState, hasEnded, isCallLive, tryPublishLearnerMic]);

  useEffect(() => {
    if (!call) {
      return;
    }

    const handlePermissionsUpdated = () => {
      if (!micPublishedRef.current) {
        void tryPublishLearnerMic();
      }
    };

    call.on("call.permissions_updated", handlePermissionsUpdated);

    return () => {
      call.off("call.permissions_updated", handlePermissionsUpdated);
    };
  }, [call, tryPublishLearnerMic]);

  const toggleMic = useCallback(async () => {
    if (!call) {
      return;
    }

    try {
      if (isMute) {
        userDisabledMicRef.current = false;
        await ensureSendAudioPermission(call);
        await publishLearnerMicrophone(call);
        micPublishedRef.current = isLearnerMicPublishing(call);
      } else {
        userDisabledMicRef.current = true;
        micPublishedRef.current = false;
        await microphone.disable();
      }
    } catch (toggleError) {
      console.error("Failed to toggle microphone:", toggleError);
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Failed to update microphone.",
      );
    }
  }, [call, isMute, microphone]);

  const endCall = useCallback(async () => {
    await stopAgentSession();
    setAgentStatus("idle");
    setAgentError(null);

    if (!call) {
      setHasEnded(true);
      return;
    }

    try {
      if (call.state.callingState !== CallingState.LEFT) {
        await call.leave();
      }
      setHasEnded(true);
    } catch (leaveError) {
      console.error("Failed to end call:", leaveError);
      setError(
        leaveError instanceof Error
          ? leaveError.message
          : "Failed to end the call.",
      );
    }
  }, [call, stopAgentSession]);

  const retryJoin = useCallback(() => {
    setError(null);
    setHasEnded(false);
    setAgentStatus("idle");
    setAgentError(null);
    agentSessionRef.current = null;
    userDisabledMicRef.current = false;
    micPublishedRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      void stopAgentSession();
    };
  }, [stopAgentSession]);

  return {
    status,
    agentStatus,
    agentError,
    error,
    micEnabled: !isMute,
    userName,
    toggleMic,
    endCall,
    retryJoin,
  };
}

type AudioLessonCallManagerProps = UseAudioLessonCallInput & {
  children: (result: AudioLessonCallControls) => ReactNode;
};

function AudioLessonCallSession({
  children,
}: {
  children: (result: AudioLessonCallControls) => ReactNode;
}) {
  const controls = useAudioLessonCall();
  return <>{children(controls)}</>;
}

export function AudioLessonCallManager({
  lessonId,
  children,
}: AudioLessonCallManagerProps) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const getTokenRef = useRef(getToken);
  const client = useStreamVideoClient();

  getTokenRef.current = getToken;
  const [call, setCall] = useState<Call>();
  const [error, setError] = useState<string | null>(null);
  const [joinAttempt, setJoinAttempt] = useState(0);
  const joinInFlightRef = useRef(false);

  const userId = user?.id ?? null;
  const userNameRef = useRef(
    user?.fullName ??
      user?.primaryEmailAddress?.emailAddress ??
      "Language learner",
  );

  userNameRef.current =
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Language learner";

  const userName = userNameRef.current;

  useEffect(() => {
    let active = true;
    let activeCall: Call | undefined;

    async function startCall() {
      if (!client || !userId || joinInFlightRef.current) {
        return;
      }

      joinInFlightRef.current = true;

      try {
        setError(null);
        const clerkToken = await getTokenRef.current();
        if (!clerkToken) {
          throw new Error("Missing Clerk session token.");
        }

        const createdCall = await createStreamLessonCall(clerkToken, {
          lessonId,
          userName: userNameRef.current,
        });

        if (!active) {
          return;
        }

        activeCall = client.call(createdCall.callType, createdCall.callId, {
          reuseInstance: true,
        });
        setCall(activeCall);

        const osMicGranted = await requestDeviceMicrophonePermission();
        if (!osMicGranted) {
          throw new Error(
            "Microphone permission is required for audio lessons. Enable it in Settings and try again.",
          );
        }

        await activeCall.join({ create: false });
        await activeCall.camera.disable();
      } catch (joinError) {
        console.error("Failed to join audio lesson call:", joinError);
        if (active) {
          setError(
            joinError instanceof Error
              ? joinError.message
              : "Failed to join the audio lesson.",
          );
          setCall(undefined);
        }
      } finally {
        joinInFlightRef.current = false;
      }
    }

    void startCall();

    return () => {
      active = false;
      if (activeCall && activeCall.state.callingState !== CallingState.LEFT) {
        activeCall.leave().catch((leaveError) => {
          console.error("Failed to leave call on cleanup:", leaveError);
        });
      }
      setCall(undefined);
    };
  }, [client, joinAttempt, lessonId, userId]);

  const fallbackResult: AudioLessonCallControls = {
    status: error ? "error" : "loading",
    agentStatus: "idle",
    agentError: null,
    error,
    micEnabled: true,
    userName,
    toggleMic: async () => {},
    endCall: async () => {},
    retryJoin: () => setJoinAttempt((value) => value + 1),
  };

  if (!call) {
    return <>{children(fallbackResult)}</>;
  }

  return (
    <StreamCall call={call}>
      <AudioLessonCallSession>{children}</AudioLessonCallSession>
    </StreamCall>
  );
}
