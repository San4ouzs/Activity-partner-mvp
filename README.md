
# Activity Partner MVP (English UI)

A cross‑platform MVP for an app where users create accounts, choose activities, set a search zone (radius), discover nearby people with overlapping interests, and chat 1:1.

**Stack**
- Mobile: React Native (Expo, TypeScript).
- Backend: Node.js + Express + Prisma (PostgreSQL). Realtime chat via Socket.IO.
- DB: PostgreSQL (Docker). Geo filtering via Haversine.
- Auth: Email & password with JWT.
- Language: English in UI.

## Quick start (local)

### 1) Start database and server
```bash
cd infra
docker compose up --build -d
# Once server is up, open logs to see it's running:
docker compose logs -f server
```
The API will run on `http://localhost:8080`.

Seed default activities (runs automatically on first boot, but you can re-run):
```bash
cd ../server
npx tsx src/seed.ts
```

### 2) Run the mobile app
Install Expo CLI if needed: `npm i -g expo`.

```bash
cd ../mobile
npm install
# Point the app to your API (optional if using defaults):
# echo 'EXPO_PUBLIC_API_BASE="http://localhost:8080"' > .env
npm run start
```
Open on Android/iOS emulator or Expo Go.

### Test flow
1. Register a couple of users (use different emails).
2. For each, open **Your Profile**, select activities, allow location, adjust **Search radius**.
3. Open **Nearby partners** to see matches.
4. Tap **Chat** to start messaging.

## API overview
- `POST /auth/register` { email, password, displayName }
- `POST /auth/login` { email, password }
- `GET /activities` → list of activities
- `GET /profile` (auth)
- `POST /profile` (auth) → { displayName, latitude, longitude, radiusKm, activityKeys }
- `GET /partners` (auth) → nearby users sharing at least one activity
- `POST /conversations` (auth) → { peerUserId } ⇒ creates/returns a direct conversation
- `GET /conversations/:id/messages` (auth)

**WebSocket (Socket.IO)**
- `join` → `{ conversationId }`
- `message` → `{ conversationId, senderId, body }`

## Notes / Next steps
- Add real senderId from JWT in mobile client.
- Push notifications (e.g., FCM/APNs) for new messages.
- Report/block, privacy controls, online status.
- Replace Haversine with PostGIS for scalable geo queries.
- E2E encryption (e.g., Double Ratchet) if needed.
- Multi-language later (currently English).
