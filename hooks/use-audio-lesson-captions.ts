import {
  CallingState,
  type ClosedCaptionEvent,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { useEffect, useState } from "react";

const AGENT_USER_ID = "language-teacher";
const CAPTION_LANGUAGE = "en";

export type AudioLessonCaptions = {
  teacherCaption: string | null;
  learnerCaption: string | null;
  isCaptioning: boolean;
};

export function useAudioLessonCaptions(): AudioLessonCaptions {
  const call = useCall();
  const { useCallCallingState, useIsCallCaptioningInProgress } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const isCaptioning = useIsCallCaptioningInProgress();

  const [teacherCaption, setTeacherCaption] = useState<string | null>(null);
  const [learnerCaption, setLearnerCaption] = useState<string | null>(null);

  useEffect(() => {
    if (!call) {
      return;
    }

    call.updateClosedCaptionSettings({
      visibilityDurationMs: 6000,
      maxVisibleCaptions: 2,
    });
  }, [call]);

  useEffect(() => {
    if (!call || callingState !== CallingState.JOINED) {
      return;
    }

    if (isCaptioning) {
      return;
    }

    void call.startClosedCaptions({ language: CAPTION_LANGUAGE }).catch((err) => {
      console.warn("[AudioLesson] Failed to start closed captions:", err);
    });
  }, [call, callingState, isCaptioning]);

  useEffect(() => {
    if (!call) {
      return;
    }

    const handleClosedCaption = (event: ClosedCaptionEvent) => {
      const text = event.closed_caption?.text?.trim();
      if (!text) {
        return;
      }

      const speakerId =
        event.closed_caption.speaker_id ?? event.closed_caption.user?.id ?? "";

      if (speakerId === AGENT_USER_ID) {
        setTeacherCaption(text);
        return;
      }

      setLearnerCaption(text);
    };

    const unsubscribe = call.on("call.closed_caption", handleClosedCaption);
    return unsubscribe;
  }, [call]);

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      setTeacherCaption(null);
      setLearnerCaption(null);
    }
  }, [callingState]);

  return {
    teacherCaption,
    learnerCaption,
    isCaptioning,
  };
}
