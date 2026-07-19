# Marva Nur Med — ENT Clinic Web App

A multilingual (Uzbek / Russian / English) clinic portal for Dr. Eldor Farxod o'g'li, chief ENT specialist at Marva Nur Med.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Backend**: Express (TypeScript, `tsx` dev server)
- **AI**: Google Gemini (`@google/genai`) — virtual consultation and diagnostic reports
- **Notifications**: Telegram Bot API — appointment booking alerts

## Features

- AI virtual consultant chat (Dr. Eldor persona, Gemini-powered)
- Interactive ENT diagnostic simulators (ear / nose / throat)
- Appointment booking with Telegram notification
- Three-language UI switcher (UZ / RU / EN)

## Running locally / on Replit

```bash
npm install
npm run dev        # starts Express + Vite dev server on port 5000
```

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Recommended | Powers AI chat and diagnostic reports; app falls back to scripted responses without it |
| `TELEGRAM_BOT_TOKEN` | Optional | Sends appointment booking notifications to a Telegram chat |

Set secrets via Replit's Secrets panel (never commit them to `.env`).

## Project structure

```
server.ts          # Express API + Vite dev middleware
src/
  App.tsx          # Root component / routing
  components/      # UI components
  translations.ts  # i18n strings (UZ/RU/EN)
  types.ts         # Shared TypeScript types
vite.config.ts     # Vite + Tailwind config
```
