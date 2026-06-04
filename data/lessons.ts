import {
  buildBasicsLessons,
  buildUnit3PathLessons,
} from "@/data/path-lessons";
import type { LanguageId, Lesson } from "@/types/learning";

function buildAiTeacherPrompt(
  languageName: string,
  lessonTitle: string,
  focusTopics: string[],
  openingLine: string,
): Lesson["aiTeacher"] {
  return {
    systemPrompt: `You are a friendly AI language teacher. Always speak in clear English. Teach ${languageName} to an English-speaking beginner. Stay on topic for "${lessonTitle}". Use short sentences, repeat key phrases, and encourage the learner to speak aloud. Correct mistakes gently and celebrate small wins.`,
    openingLine,
    focusTopics,
    estimatedMinutes: 5,
  };
}

export const lessons: Lesson[] = [
  // ─── Spanish ───────────────────────────────────────────────────────────────
  {
    id: "es-u1-l1",
    languageId: "es",
    unitId: "es-unit-1",
    title: "Hello!",
    subtitle: "Greetings",
    description: "Learn how to say hello and goodbye in Spanish.",
    order: 1,
    xpReward: 10,
    estimatedMinutes: 5,
    imageKey: "lesson-greetings",
    goals: [
      { id: "g1", description: "Say hello and goodbye in Spanish" },
      { id: "g2", description: "Recognize common greeting words" },
    ],
    vocabulary: [
      { id: "v1", word: "hola", translation: "hello", pronunciation: "OH-lah" },
      { id: "v2", word: "adiós", translation: "goodbye", pronunciation: "ah-DYOHS" },
      { id: "v3", word: "buenos días", translation: "good morning", example: "Buenos días, ¿cómo estás?" },
    ],
    phrases: [
      { id: "p1", text: "¡Hola!", translation: "Hello!", context: "Casual greeting" },
      { id: "p2", text: "Buenos días.", translation: "Good morning.", context: "Polite morning greeting" },
    ],
    activities: [
      {
        id: "a1",
        type: "vocabulary",
        title: "Learn the words",
        description: "Match Spanish greetings to English meanings.",
        xpReward: 5,
        vocabulary: [
          { id: "v1", word: "hola", translation: "hello" },
          { id: "v2", word: "adiós", translation: "goodbye" },
        ],
      },
      {
        id: "a2",
        type: "video_teacher",
        title: "Practice with your AI teacher",
        description: "Speak greetings aloud with guided feedback.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "Hello!",
      ["hola", "adiós", "buenos días", "pronunciation practice"],
      "¡Hola! Welcome to your first Spanish lesson. Let's practice saying hello together.",
    ),
  },
  {
    id: "es-u1-l2",
    languageId: "es",
    unitId: "es-unit-1",
    title: "Nice to meet you",
    subtitle: "Introductions",
    description: "Introduce yourself and ask someone's name.",
    order: 2,
    xpReward: 10,
    estimatedMinutes: 6,
    imageKey: "lesson-intro",
    goals: [
      { id: "g1", description: "Introduce yourself in Spanish" },
      { id: "g2", description: "Ask and answer ¿Cómo te llamas?" },
    ],
    vocabulary: [
      { id: "v1", word: "me llamo", translation: "my name is", example: "Me llamo Ana." },
      { id: "v2", word: "¿Cómo te llamas?", translation: "What is your name?" },
      { id: "v3", word: "mucho gusto", translation: "nice to meet you" },
    ],
    phrases: [
      { id: "p1", text: "Me llamo Alex.", translation: "My name is Alex." },
      { id: "p2", text: "Mucho gusto.", translation: "Nice to meet you." },
    ],
    activities: [
      {
        id: "a1",
        type: "phrase_practice",
        title: "Build the phrase",
        description: "Put words in order to form introductions.",
        xpReward: 5,
        phrases: [
          { id: "p1", text: "Me llamo Alex.", translation: "My name is Alex." },
        ],
      },
      {
        id: "a2",
        type: "speaking",
        title: "Say your name",
        description: "Practice introducing yourself out loud.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "Nice to meet you",
      ["me llamo", "¿Cómo te llamas?", "mucho gusto", "role-play introductions"],
      "Let's practice introductions. I'll say my name in Spanish, then you try!",
    ),
  },
  {
    id: "es-u1-l3",
    languageId: "es",
    unitId: "es-unit-1",
    title: "How are you?",
    subtitle: "Small talk",
    description: "Ask and answer how someone is feeling.",
    order: 3,
    xpReward: 10,
    estimatedMinutes: 6,
    imageKey: "lesson-feelings",
    goals: [
      { id: "g1", description: "Ask how someone is (¿Cómo estás?) and understand replies" },
      { id: "g2", description: "Say you are fine or not well" },
    ],
    vocabulary: [
      { id: "v1", word: "¿Cómo estás?", translation: "How are you?" },
      { id: "v2", word: "bien", translation: "well / fine" },
      { id: "v3", word: "mal", translation: "bad / not well" },
    ],
    phrases: [
      { id: "p1", text: "¿Cómo estás?", translation: "How are you?" },
      { id: "p2", text: "Estoy bien, gracias.", translation: "I'm fine, thank you." },
    ],
    activities: [
      {
        id: "a1",
        type: "listening",
        title: "Listen and choose",
        description: "Pick the correct reply to ¿Cómo estás?",
        xpReward: 5,
      },
      {
        id: "a2",
        type: "chat",
        title: "Quick chat",
        description: "Have a short exchange about how you feel.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "How are you?",
      ["¿Cómo estás?", "bien", "mal", "Estoy bien, gracias"],
      "Time for small talk! I'll ask how you are — try answering in Spanish.",
    ),
  },
  {
    id: "es-u2-l1",
    languageId: "es",
    unitId: "es-unit-2",
    title: "Where is...?",
    subtitle: "Directions",
    description: "Ask for locations and understand simple directions.",
    order: 1,
    xpReward: 12,
    estimatedMinutes: 7,
    imageKey: "lesson-directions",
    goals: [
      { id: "g1", description: "Ask where something is (¿Dónde está...?)" },
      { id: "g2", description: "Understand left and right in Spanish" },
    ],
    vocabulary: [
      { id: "v1", word: "¿Dónde está?", translation: "Where is...?" },
      { id: "v2", word: "la estación", translation: "the station" },
      { id: "v3", word: "a la derecha", translation: "to the right" },
      { id: "v4", word: "a la izquierda", translation: "to the left" },
    ],
    phrases: [
      { id: "p1", text: "¿Dónde está la estación?", translation: "Where is the station?" },
      { id: "p2", text: "Está a la derecha.", translation: "It's on the right." },
    ],
    activities: [
      {
        id: "a1",
        type: "vocabulary",
        title: "Places and directions",
        description: "Learn words for locations and left/right.",
        xpReward: 6,
      },
      {
        id: "a2",
        type: "video_teacher",
        title: "Ask for directions",
        description: "Role-play asking where the station is.",
        xpReward: 6,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "Where is...?",
      ["¿Dónde está?", "a la derecha", "a la izquierda", "travel role-play"],
      "Imagine you're in Madrid and need the train station. Let's practice asking in Spanish!",
    ),
  },
  {
    id: "es-u2-l2",
    languageId: "es",
    unitId: "es-unit-2",
    title: "At the café",
    subtitle: "Ordering",
    description: "Order a drink and say please and thank you.",
    order: 2,
    xpReward: 12,
    estimatedMinutes: 7,
    imageKey: "lesson-cafe",
    goals: [
      { id: "g1", description: "Order a drink politely" },
      { id: "g2", description: "Use por favor and gracias" },
    ],
    vocabulary: [
      { id: "v1", word: "un café", translation: "a coffee" },
      { id: "v2", word: "agua", translation: "water" },
      { id: "v3", word: "por favor", translation: "please" },
      { id: "v4", word: "gracias", translation: "thank you" },
    ],
    phrases: [
      { id: "p1", text: "Un café, por favor.", translation: "A coffee, please." },
      { id: "p2", text: "Muchas gracias.", translation: "Thank you very much." },
    ],
    activities: [
      {
        id: "a1",
        type: "phrase_practice",
        title: "Order politely",
        description: "Practice café ordering phrases.",
        xpReward: 6,
        phrases: [
          { id: "p1", text: "Un café, por favor.", translation: "A coffee, please." },
        ],
      },
      {
        id: "a2",
        type: "review",
        title: "Unit review",
        description: "Review travel vocabulary from this unit.",
        xpReward: 6,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "At the café",
      ["un café", "agua", "por favor", "gracias", "ordering role-play"],
      "Welcome to our virtual café! Order a drink in Spanish — I'll be your barista.",
    ),
  },

  // ─── French ────────────────────────────────────────────────────────────────
  {
    id: "fr-u1-l1",
    languageId: "fr",
    unitId: "fr-unit-1",
    title: "Bonjour!",
    subtitle: "Greetings",
    description: "Learn essential French greetings for any time of day.",
    order: 1,
    xpReward: 10,
    estimatedMinutes: 5,
    imageKey: "lesson-greetings",
    goals: [
      { id: "g1", description: "Say bonjour and bonsoir appropriately" },
      { id: "g2", description: "Use au revoir when leaving" },
    ],
    vocabulary: [
      { id: "v1", word: "bonjour", translation: "hello / good day", pronunciation: "bon-ZHOOR" },
      { id: "v2", word: "bonsoir", translation: "good evening" },
      { id: "v3", word: "au revoir", translation: "goodbye" },
    ],
    phrases: [
      { id: "p1", text: "Bonjour!", translation: "Hello!" },
      { id: "p2", text: "Au revoir!", translation: "Goodbye!" },
    ],
    activities: [
      {
        id: "a1",
        type: "vocabulary",
        title: "Morning or evening?",
        description: "Choose the right greeting for the time of day.",
        xpReward: 5,
      },
      {
        id: "a2",
        type: "video_teacher",
        title: "Greet your teacher",
        description: "Practice greetings with your AI teacher.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Bonjour!",
      ["bonjour", "bonsoir", "au revoir", "French pronunciation"],
      "Bonjour! Let's start with the greetings every French speaker uses every day.",
    ),
  },
  {
    id: "fr-u1-l2",
    languageId: "fr",
    unitId: "fr-unit-1",
    title: "Enchanté",
    subtitle: "Introductions",
    description: "Introduce yourself and respond politely.",
    order: 2,
    xpReward: 10,
    estimatedMinutes: 6,
    imageKey: "lesson-intro",
    goals: [
      { id: "g1", description: "Say Je m'appelle and ask someone's name" },
      { id: "g2", description: "Use enchanté(e) after introductions" },
    ],
    vocabulary: [
      { id: "v1", word: "Je m'appelle", translation: "My name is" },
      { id: "v2", word: "Comment tu t'appelles?", translation: "What's your name?" },
      { id: "v3", word: "Enchanté", translation: "Nice to meet you (said by a man)" },
    ],
    phrases: [
      { id: "p1", text: "Je m'appelle Marie.", translation: "My name is Marie." },
      { id: "p2", text: "Enchanté!", translation: "Nice to meet you!" },
    ],
    activities: [
      {
        id: "a1",
        type: "phrase_practice",
        title: "Introduce yourself",
        description: "Form correct introduction sentences.",
        xpReward: 5,
        phrases: [
          { id: "p1", text: "Je m'appelle Marie.", translation: "My name is Marie." },
        ],
      },
      {
        id: "a2",
        type: "speaking",
        title: "Say your name",
        description: "Practice Je m'appelle out loud.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Enchanté",
      ["Je m'appelle", "Comment tu t'appelles?", "Enchanté", "introductions"],
      "Let's meet in French! Tell me your name with Je m'appelle...",
    ),
  },
  {
    id: "fr-u1-l3",
    languageId: "fr",
    unitId: "fr-unit-1",
    title: "Ça va?",
    subtitle: "Small talk",
    description: "Ask how someone is and give simple answers.",
    order: 3,
    xpReward: 10,
    estimatedMinutes: 6,
    imageKey: "lesson-feelings",
    goals: [
      { id: "g1", description: "Ask Ça va? and understand replies" },
      { id: "g2", description: "Say Ça va bien or Pas très bien" },
    ],
    vocabulary: [
      { id: "v1", word: "Ça va?", translation: "How are you? / How's it going?" },
      { id: "v2", word: "Ça va bien", translation: "I'm doing well" },
      { id: "v3", word: "Pas très bien", translation: "Not so well" },
    ],
    phrases: [
      { id: "p1", text: "Ça va?", translation: "How are you?" },
      { id: "p2", text: "Ça va bien, merci.", translation: "I'm fine, thanks." },
    ],
    activities: [
      {
        id: "a1",
        type: "listening",
        title: "How are they?",
        description: "Listen and pick the correct feeling.",
        xpReward: 5,
      },
      {
        id: "a2",
        type: "chat",
        title: "Quick chat",
        description: "Exchange a short Ça va? conversation.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Ça va?",
      ["Ça va?", "Ça va bien", "merci", "small talk"],
      "Ça va? Let's have a quick chat about how you're doing — in French!",
    ),
  },
  {
    id: "fr-u2-l1",
    languageId: "fr",
    unitId: "fr-unit-2",
    title: "Excusez-moi",
    subtitle: "Politeness",
    description: "Get someone's attention and ask for help politely.",
    order: 1,
    xpReward: 12,
    estimatedMinutes: 7,
    imageKey: "lesson-polite",
    goals: [
      { id: "g1", description: "Use Excusez-moi to get attention" },
      { id: "g2", description: "Ask Pouvez-vous m'aider? for help" },
    ],
    vocabulary: [
      { id: "v1", word: "Excusez-moi", translation: "Excuse me" },
      { id: "v2", word: "Pouvez-vous m'aider?", translation: "Can you help me?" },
      { id: "v3", word: "s'il vous plaît", translation: "please (formal)" },
    ],
    phrases: [
      { id: "p1", text: "Excusez-moi, pouvez-vous m'aider?", translation: "Excuse me, can you help me?" },
      { id: "p2", text: "Oui, bien sûr.", translation: "Yes, of course." },
    ],
    activities: [
      {
        id: "a1",
        type: "phrase_practice",
        title: "Ask politely",
        description: "Practice polite help requests.",
        xpReward: 6,
      },
      {
        id: "a2",
        type: "video_teacher",
        title: "Need help?",
        description: "Role-play asking a stranger for help.",
        xpReward: 6,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Excusez-moi",
      ["Excusez-moi", "Pouvez-vous m'aider?", "s'il vous plaît", "polite requests"],
      "You're on a Paris street and need help. Let's practice Excusez-moi together!",
    ),
  },
  {
    id: "fr-u2-l2",
    languageId: "fr",
    unitId: "fr-unit-2",
    title: "Où est...?",
    subtitle: "Directions",
    description: "Ask where something is and understand simple answers.",
    order: 2,
    xpReward: 12,
    estimatedMinutes: 7,
    imageKey: "lesson-directions",
    goals: [
      { id: "g1", description: "Ask Où est la gare? for a location" },
      { id: "g2", description: "Understand tout droit (straight ahead)" },
    ],
    vocabulary: [
      { id: "v1", word: "Où est", translation: "Where is" },
      { id: "v2", word: "la gare", translation: "the train station" },
      { id: "v3", word: "tout droit", translation: "straight ahead" },
    ],
    phrases: [
      { id: "p1", text: "Où est la gare?", translation: "Where is the train station?" },
      { id: "p2", text: "C'est tout droit.", translation: "It's straight ahead." },
    ],
    activities: [
      {
        id: "a1",
        type: "vocabulary",
        title: "Find your way",
        description: "Learn direction vocabulary.",
        xpReward: 6,
      },
      {
        id: "a2",
        type: "review",
        title: "Unit review",
        description: "Review town and politeness phrases.",
        xpReward: 6,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Où est...?",
      ["Où est", "la gare", "tout droit", "directions role-play"],
      "You need the train station in Lyon. Ask me Où est la gare? in French!",
    ),
  },

  // ─── Japanese ──────────────────────────────────────────────────────────────
  {
    id: "ja-u1-l1",
    languageId: "ja",
    unitId: "ja-unit-1",
    title: "こんにちは",
    subtitle: "Greetings",
    description: "Learn basic Japanese greetings in hiragana and romaji.",
    order: 1,
    xpReward: 10,
    estimatedMinutes: 5,
    imageKey: "lesson-greetings",
    goals: [
      { id: "g1", description: "Say こんにちは and さようなら" },
      { id: "g2", description: "Read greetings in hiragana" },
    ],
    vocabulary: [
      { id: "v1", word: "こんにちは", translation: "hello (afternoon)", pronunciation: "konnichiwa" },
      { id: "v2", word: "おはよう", translation: "good morning", pronunciation: "ohayō" },
      { id: "v3", word: "さようなら", translation: "goodbye", pronunciation: "sayōnara" },
    ],
    phrases: [
      { id: "p1", text: "こんにちは！", translation: "Hello!", context: "Used from late morning to evening" },
      { id: "p2", text: "さようなら。", translation: "Goodbye." },
    ],
    activities: [
      {
        id: "a1",
        type: "vocabulary",
        title: "Hiragana greetings",
        description: "Match hiragana greetings to English.",
        xpReward: 5,
      },
      {
        id: "a2",
        type: "video_teacher",
        title: "Practice aloud",
        description: "Repeat greetings with pronunciation help.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "こんにちは",
      ["こんにちは", "おはよう", "さようなら", "hiragana reading", "pronunciation"],
      "Konnichiwa! Let's practice Japanese greetings — I'll help with pronunciation.",
    ),
  },
  {
    id: "ja-u1-l2",
    languageId: "ja",
    unitId: "ja-unit-1",
    title: "はじめまして",
    subtitle: "Introductions",
    description: "Introduce yourself politely in Japanese.",
    order: 2,
    xpReward: 10,
    estimatedMinutes: 6,
    imageKey: "lesson-intro",
    goals: [
      { id: "g1", description: "Say はじめまして and よろしくお願いします" },
      { id: "g2", description: "Introduce yourself with わたしのなまえは" },
    ],
    vocabulary: [
      { id: "v1", word: "はじめまして", translation: "nice to meet you", pronunciation: "hajimemashite" },
      { id: "v2", word: "わたしのなまえは", translation: "my name is", pronunciation: "watashi no namae wa" },
      { id: "v3", word: "よろしくお願いします", translation: "pleased to meet you", pronunciation: "yoroshiku onegaishimasu" },
    ],
    phrases: [
      { id: "p1", text: "はじめまして。", translation: "Nice to meet you." },
      { id: "p2", text: "わたしのなまえはユキです。", translation: "My name is Yuki." },
    ],
    activities: [
      {
        id: "a1",
        type: "phrase_practice",
        title: "First meeting",
        description: "Practice introduction phrases in order.",
        xpReward: 5,
        phrases: [
          { id: "p1", text: "はじめまして。", translation: "Nice to meet you." },
        ],
      },
      {
        id: "a2",
        type: "speaking",
        title: "Introduce yourself",
        description: "Say your name using わたしのなまえは.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "はじめまして",
      ["はじめまして", "わたしのなまえは", "よろしくお願いします", "polite introductions"],
      "Hajimemashite! Let's do a polite Japanese self-introduction together.",
    ),
  },
  {
    id: "ja-u1-l3",
    languageId: "ja",
    unitId: "ja-unit-1",
    title: "げんきですか",
    subtitle: "Small talk",
    description: "Ask if someone is well and respond politely.",
    order: 3,
    xpReward: 10,
    estimatedMinutes: 6,
    imageKey: "lesson-feelings",
    goals: [
      { id: "g1", description: "Ask げんきですか politely" },
      { id: "g2", description: "Answer はい、げんきです" },
    ],
    vocabulary: [
      { id: "v1", word: "げんきですか", translation: "How are you?", pronunciation: "genki desu ka" },
      { id: "v2", word: "はい", translation: "yes", pronunciation: "hai" },
      { id: "v3", word: "げんきです", translation: "I'm fine", pronunciation: "genki desu" },
    ],
    phrases: [
      { id: "p1", text: "げんきですか？", translation: "How are you?" },
      { id: "p2", text: "はい、げんきです。", translation: "Yes, I'm fine." },
    ],
    activities: [
      {
        id: "a1",
        type: "listening",
        title: "Are they well?",
        description: "Listen and choose the correct reply.",
        xpReward: 5,
      },
      {
        id: "a2",
        type: "chat",
        title: "Quick chat",
        description: "Practice a short wellness exchange.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "げんきですか",
      ["げんきですか", "げんきです", "はい", "polite small talk"],
      "Genki desu ka? Let's practice asking and answering how you are in Japanese.",
    ),
  },
  {
    id: "ja-u2-l1",
    languageId: "ja",
    unitId: "ja-unit-2",
    title: "Numbers 1–5",
    subtitle: "Counting",
    description: "Count from one to five in Japanese.",
    order: 1,
    xpReward: 12,
    estimatedMinutes: 7,
    imageKey: "lesson-numbers",
    goals: [
      { id: "g1", description: "Count いち through ご" },
      { id: "g2", description: "Recognize numbers in hiragana" },
    ],
    vocabulary: [
      { id: "v1", word: "いち", translation: "one", pronunciation: "ichi" },
      { id: "v2", word: "に", translation: "two", pronunciation: "ni" },
      { id: "v3", word: "さん", translation: "three", pronunciation: "san" },
      { id: "v4", word: "よん", translation: "four", pronunciation: "yon" },
      { id: "v5", word: "ご", translation: "five", pronunciation: "go" },
    ],
    phrases: [
      { id: "p1", text: "いち、に、さん", translation: "one, two, three" },
      { id: "p2", text: "よん、ご", translation: "four, five" },
    ],
    activities: [
      {
        id: "a1",
        type: "vocabulary",
        title: "Count up",
        description: "Match hiragana numbers to digits.",
        xpReward: 6,
      },
      {
        id: "a2",
        type: "speaking",
        title: "Count aloud",
        description: "Say numbers 1–5 in order.",
        xpReward: 6,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "Numbers 1–5",
      ["いち", "に", "さん", "よん", "ご", "counting practice"],
      "Let's count together in Japanese — from ichi to go!",
    ),
  },
  {
    id: "ja-u2-l2",
    languageId: "ja",
    unitId: "ja-unit-2",
    title: "ありがとう",
    subtitle: "Thanks",
    description: "Say thank you and you're welcome in Japanese.",
    order: 2,
    xpReward: 12,
    estimatedMinutes: 7,
    imageKey: "lesson-thanks",
    goals: [
      { id: "g1", description: "Say ありがとう and どういたしまして" },
      { id: "g2", description: "Use すみません to apologize lightly" },
    ],
    vocabulary: [
      { id: "v1", word: "ありがとう", translation: "thank you", pronunciation: "arigatō" },
      { id: "v2", word: "どういたしまして", translation: "you're welcome", pronunciation: "dōitashimashite" },
      { id: "v3", word: "すみません", translation: "excuse me / sorry", pronunciation: "sumimasen" },
    ],
    phrases: [
      { id: "p1", text: "ありがとうございます。", translation: "Thank you very much." },
      { id: "p2", text: "どういたしまして。", translation: "You're welcome." },
    ],
    activities: [
      {
        id: "a1",
        type: "phrase_practice",
        title: "Thanks and reply",
        description: "Practice thank-you exchanges.",
        xpReward: 6,
      },
      {
        id: "a2",
        type: "review",
        title: "Unit review",
        description: "Review daily life vocabulary.",
        xpReward: 6,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "ありがとう",
      ["ありがとう", "どういたしまして", "すみません", "polite exchanges"],
      "Arigatō! Let's practice thanking someone and responding politely in Japanese.",
    ),
  },
  ...buildUnit3PathLessons(),
  ...buildBasicsLessons(),
];

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getLessonsForLanguage(languageId: LanguageId): Lesson[] {
  return lessons
    .filter((lesson) => lesson.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

export function getFirstLessonForLanguage(
  languageId: LanguageId,
): Lesson | undefined {
  return getLessonsForLanguage(languageId)[0];
}
