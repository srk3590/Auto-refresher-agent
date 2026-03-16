# Token Refresher Agent

Automatically refreshes JWT tokens for local development by updating `token.service.ts` on a schedule.

## Why Use This?

- No more manually copying tokens from Bruno every 2 hours when they expire
- No more restarting the app or getting 401 errors mid-development
- Set it up once and forget — tokens stay fresh automatically in the background

## How It Works

```
┌──────────────┐
│  Your Code   │
└──────┬───────┘
       │ uses
       ▼
┌──────────────────┐
│ token.service.ts │◄──── Updates automatically
└──────────────────┘
       ▲
       │
┌──────┴───────────┐
│  Refresher Agent │
└──────┬───────────┘
       │ authenticates with
       ▼
┌──────────────┐
│   Auth API   │
└──────────────┘
```

---

## Getting Started

```bash
cd tools/auto-refresher-agent

# 1. Install dependencies
npm install

# 2. Configure credentials
npm run setup

# 3. Start auto-refresh
npm run auto
```

Keep the terminal open. Tokens refresh automatically per the configured interval (`REFRESH_INTERVAL` in `.env`).

### What to enter during `npm run setup`

Use the same credentials you use in Bruno to fetch the token manually:

| Prompt | Value |
|--------|-------|
| Username | `xactly_user@xactlycorp.com` |
| Password | `demoUser1` |
| API Endpoint | `https://example.com/iam/auth/token` |
| Refresh Interval | e.g. `0 * * * *` for every hour (or press Enter to keep current) |

> These are the same credentials and endpoint URL from your Bruno auth request.

### Other Commands

| Command | Description |
|---------|-------------|
| `npm run refresh` | One-time manual refresh |
| `npm run view` | Check current cached token status |
| `npm run test` | Test connection and credentials |
| `npm run verify` | Verify installation |

### Cron Interval Reference

| Interval | Expression |
|----------|------------|
| Every 5 minutes | `*/5 * * * *` |
| Every 15 minutes | `*/15 * * * *` |
| Every 30 minutes | `*/30 * * * *` |
| Every hour | `0 * * * *` |
