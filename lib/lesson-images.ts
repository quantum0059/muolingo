import { images, remoteImages } from "@/constants/images";
import type { ImageSource } from "expo-image";

const LESSON_IMAGE_URLS: Record<string, string> = {
  "lesson-greetings":
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=160&h=160&fit=crop",
  "lesson-intro":
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&h=160&fit=crop",
  "lesson-feelings":
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=160&h=160&fit=crop",
  "lesson-daily":
    "https://images.unsplash.com/photo-1497215728101-856fbe1b24d2?w=160&h=160&fit=crop",
  "lesson-cafe":
    "https://images.unsplash.com/photo-1554118811-1e0d582203f8?w=160&h=160&fit=crop",
  "lesson-directions":
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=160&h=160&fit=crop",
  "lesson-travel":
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=160&h=160&fit=crop",
  "lesson-shopping":
    "https://images.unsplash.com/photo-1483985988351-763728e1935b?w=160&h=160&fit=crop",
  "lesson-family":
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=160&h=160&fit=crop",
  "lesson-polite":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop",
  "lesson-numbers":
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=160&h=160&fit=crop",
  "lesson-thanks":
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=160&h=160&fit=crop",
};

export function getLessonImageSource(imageKey: string): ImageSource {
  if (imageKey === "lesson-cafe") {
    return images.lessonCafeIcon;
  }

  const remote =
    LESSON_IMAGE_URLS[imageKey] ??
    `https://picsum.photos/seed/${encodeURIComponent(imageKey)}/160/160`;

  return { uri: remote };
}

export function getUnitHeroSource(_unitId: string): ImageSource {
  return images.unitCafeHero;
}
