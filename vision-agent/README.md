# Vision Agent — AI Language Teacher

Voice-only AI teacher for audio lessons. Uses **Gemini Realtime** for speech and **Stream Edge** for transport.

## Setup

From the repo root, ensure `.env` includes:

- `STREAM_API_KEY`
- `STREAM_SECRET_KEY` (mapped automatically to `STREAM_API_SECRET`)
- `GEMINI_API_KEY` (mapped automatically to `GOOGLE_API_KEY`)
- `GEMINI_REALTIME_MODEL` (optional, defaults to `gemini-2.5-flash-native-audio-latest`)

Install dependencies:

```bash
cd vision-agent
uv sync
```

## Run

Console mode (opens a browser demo link):

```bash
uv run main.py run
```

HTTP server (for Expo API routes to spawn sessions):

```bash
uv run main.py serve --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

## Call type

The Expo app creates Stream calls with type `audio_room` and IDs like `lesson-es-u1-l1`.
