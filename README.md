# Token Refresher Agent

Automatically refreshes JWT tokens for local development by updating `token.service.ts` on a schedule.

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
