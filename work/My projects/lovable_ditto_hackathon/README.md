# Slack Events → WebSocket Bridge

Backend service that verifies Slack Events, classifies messages by keywords, and broadcasts actions to WebSocket clients.

## Setup

1. Copy `.env.example` to `.env` and set values.
2. Install deps and run dev server:

```bash
npm install
npm run dev
```

Server: `http://localhost:3000`
WebSocket: `ws://localhost:3000/ws`

## Slack App Configuration

- Enable Events API and set Request URL to `https://your-host/slack/events` (or `http://localhost:3000/slack/events` if tunneled).
- Subscribe to `message.channels` (or other message events as needed).
- Use the Signing Secret from Slack in `SLACK_SIGNING_SECRET`.

## Exa GIF Search (optional)

- Set `EXA_API_KEY` in `.env` to enable fetching a relevant meme/GIF based on the action.
- The search uses simple queries per action (e.g., "cry at desk gif", "celebration success dance gif").

## Broadcast Payload

The server broadcasts on each qualifying message:

```json
{
  "type": "slack_message_action",
  "action": "cry|rage|dance|sleep|party|neutral",
  "matched": "keyword or null",
  "confidence": 0.2,
  "gifUrl": "https://... optional if available",
  "message": "text",
  "channel": "C123",
  "user": "U123",
  "ts": "1725555555.0001"
}
```

## Actions & Keywords

- **cry**: deadline, due, late, delay, overdue, stress, overwhelmed, tired
- **rage**: bug, error, crash, issue, fail, broken, angry, frustrated, mad  
- **dance**: success, shipped, done, fixed, win, yay, hooray, celebration
- **sleep**: sleep, tired, exhausted, nap, zzz, bedtime, rest
- **party**: party, celebrate, fun, excited, woohoo, awesome, amazing
- **neutral**: default fallback

## Notes
- URL verification is handled by echoing the `challenge`.
- Slack retries are acknowledged idempotently.
- Signature verification uses raw body and HMAC-SHA256.
