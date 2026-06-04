import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { posthog } from "@/lib/posthog";

export const LEARNING_STORAGE_KEY = "learning-storage";

export type TodayPlanItemId = "lesson" | "ai-conversation" | "new-words";

type LearningState = {
  xp: number;
  dailyXpGoal: number;
  streak: number;
  completedLessonIds: string[];
  todayPlanCompleted: Record<TodayPlanItemId, boolean>;
  completeLesson: (lessonId: string, xpReward: number) => void;
  setTodayPlanItemCompleted: (id: TodayPlanItemId, completed: boolean) => void;
  resetProgress: () => void;
};

const DEFAULT_TODAY_PLAN: Record<TodayPlanItemId, boolean> = {
  lesson: true,
  "ai-conversation": false,
  "new-words": false,
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      xp: 15,
      dailyXpGoal: 20,
      streak: 12,
      completedLessonIds: ["es-u1-l1", "es-u1-l2", "es-u1-l3", "es-u2-l1"],
      todayPlanCompleted: DEFAULT_TODAY_PLAN,
      completeLesson: (lessonId, xpReward) => {
        const { completedLessonIds, xp } = get();
        if (completedLessonIds.includes(lessonId)) {
          return;
        }
        set({
          completedLessonIds: [...completedLessonIds, lessonId],
          xp: xp + xpReward,
          todayPlanCompleted: {
            ...get().todayPlanCompleted,
            lesson: true,
          },
        });
        posthog.capture("lesson_completed", {
          lesson_id: lessonId,
          xp_earned: xpReward,
          total_xp: xp + xpReward,
        });
      },
      setTodayPlanItemCompleted: (id, completed) =>
        set((state) => ({
          todayPlanCompleted: {
            ...state.todayPlanCompleted,
            [id]: completed,
          },
        })),
      resetProgress: () =>
        set({
          xp: 0,
          completedLessonIds: [],
          todayPlanCompleted: {
            lesson: false,
            "ai-conversation": false,
            "new-words": false,
          },
        }),
    }),
    {
      name: LEARNING_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        xp: state.xp,
        dailyXpGoal: state.dailyXpGoal,
        streak: state.streak,
        completedLessonIds: state.completedLessonIds,
        todayPlanCompleted: state.todayPlanCompleted,
      }),
    }
  )
);
