<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Foxilingo app. The integration covers the full user lifecycle — from first opening the app through onboarding, signup, language selection, and active learning — with user identification tied to Clerk authentication.

**Files created or modified:**

- `app.config.js` — converted from `app.json` to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` as Expo extras
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`
- `lib/posthog.ts` — PostHog client singleton using `expo-constants` config
- `app/_layout.tsx` — added `PostHogProvider` wrapping the app, manual screen tracking via `posthog.screen()`
- `app/onboarding.tsx` — `onboarding_started` event on Get Started tap
- `app/sign-up.tsx` — `user_signed_up` event + `posthog.identify()` on successful signup
- `app/sign-in.tsx` — `user_signed_in` event + `posthog.identify()` on successful sign-in
- `app/language.tsx` — `language_selected` event with language id/name on Continue
- `app/(tabs)/index.tsx` — `lesson_continued`, `daily_plan_item_completed`, and `ai_video_call_tapped` events
- `store/learning.ts` — `lesson_completed` event with XP properties on lesson completion

## Events

| Event | Description | File |
|---|---|---|
| `onboarding_started` | User taps 'Get Started' on the onboarding screen | `app/onboarding.tsx` |
| `user_signed_up` | User successfully creates an account via email | `app/sign-up.tsx` |
| `user_signed_in` | User successfully signs in to an existing account | `app/sign-in.tsx` |
| `language_selected` | User picks a language and confirms selection | `app/language.tsx` |
| `lesson_continued` | User taps Continue on the current lesson card | `app/(tabs)/index.tsx` |
| `daily_plan_item_completed` | User marks a today's plan item as completed | `app/(tabs)/index.tsx` |
| `ai_video_call_tapped` | User taps the AI video call button on home screen | `app/(tabs)/index.tsx` |
| `lesson_completed` | User completes a lesson and earns XP | `store/learning.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/454255/dashboard/1669036)
- [Signup conversion funnel](https://us.posthog.com/project/454255/insights/pC8mY6N9) — onboarding → signup → language selected
- [New signups over time](https://us.posthog.com/project/454255/insights/jmNtM6cw) — daily unique signups
- [Lessons completed over time](https://us.posthog.com/project/454255/insights/FYwqDzNn) — daily lesson completions
- [Language popularity](https://us.posthog.com/project/454255/insights/SDCO8Kkq) — which languages users select
- [AI video call engagement](https://us.posthog.com/project/454255/insights/0WVzQ9eD) — daily AI video call taps

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
