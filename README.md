# Token Refresher Agent

> Automated token management for the forecasting application

An intelligent tool that automatically refreshes JWT authentication tokens, eliminating manual updates and expired token errors during development.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Commands Reference](#commands-reference)
- [API Customization](#api-customization)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Workflows & Integration](#workflows--integration)
- [Examples](#examples)
- [FAQ](#faq)

---

## Overview

### What It Does

This tool automates the process of refreshing JWT authentication tokens for local development. Instead of manually updating tokens from Bruno or when they expire, this agent handles it automatically at scheduled intervals.

### Why Use It?

- 🔄 **Zero maintenance** - Set it once, tokens refresh automatically
- ⚡ **No downtime** - Never lose access due to expired tokens
- 🎨 **Developer-friendly** - Simple CLI with colored output
- 🔒 **Secure** - Credentials stored locally, never committed
- 🧪 **Testable** - Built-in connection and configuration testing

### How It Works

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

**The Flow:**
1. Agent authenticates with username/password
2. Receives fresh JWT token
3. Updates `token.service.ts` with new token
4. Caches token locally
5. Repeats at scheduled interval (default: every 30 minutes)

---

## Features

### Core Features
- ✅ Automatic token refresh at scheduled intervals
- ✅ Manual token refresh on-demand
- ✅ JWT token decoding and validation
- ✅ Token caching for quick reference
- ✅ Automatic service file updates
- ✅ Expiration time monitoring
- ✅ User information display

### Setup & Configuration
- ✅ Interactive setup wizard
- ✅ Environment variable configuration
- ✅ Multiple configuration methods (CLI, .env, interactive)
- ✅ Cron-based scheduling
- ✅ Customizable refresh intervals

### Testing & Verification
- ✅ Connection testing
- ✅ Credential validation
- ✅ API response verification
- ✅ Installation verification
- ✅ Token status viewer
- ✅ Comprehensive error messages

### Security
- ✅ Credentials stored securely in .env
- ✅ .gitignore for sensitive files
- ✅ No hardcoded credentials
- ✅ Password masking in output
- ✅ Secure file permissions guidance

---

## Quick Start

### ⚡ 60-Second Setup

```bash
cd tools/auto-refresher-agent
npm install
npm run setup
npm run auto
```

**Done!** Your tokens now refresh automatically. ✨

### Step-by-Step First Run

#### 1️⃣ Install Dependencies (30 seconds)

```bash
cd tools/auto-refresher-agent
npm install
```

#### 2️⃣ Configure Credentials (1 minute)

```bash
npm run setup
```

Follow the prompts to enter:
- Username (email)
- Password
- API endpoint URL
- Refresh interval (or use default: every 30 minutes)

#### 3️⃣ Verify Setup (5 seconds)

```bash
npm run verify
```

#### 4️⃣ Test Connection (5 seconds)

```bash
npm run test
```

✅ If successful, you'll see token information and recommendations.

#### 5️⃣ Start Auto-Refresh

```bash
npm run auto
```

Keep this terminal open while you work. Tokens refresh automatically!

---

## Installation

### Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** installed (version 14 or higher)
  ```bash
  node --version  # Should show v14.x.x or higher
  ```

- ✅ **npm** installed (comes with Node.js)
  ```bash
  npm --version
  ```

- ✅ **Authentication credentials**
  - Username (email)
  - Password
  - API endpoint URL

- ✅ **Access to the project**
  - You're in the `forecasting-ui` project directory

### Method 1: Automated Setup (Recommended)

```bash
cd tools/auto-refresher-agent
npm install
npm run verify    # Check installation
npm run setup     # Interactive setup
npm run test      # Verify configuration
npm run auto      # Start using
```

**Total time**: ~3 minutes

### Method 2: Manual Setup

```bash
# 1. Navigate
cd tools/auto-refresher-agent

# 2. Install dependencies
npm install

# 3. Create config file
cp env.example .env

# 4. Edit configuration
nano .env  # or use your favorite editor

# 5. Set secure permissions
chmod 600 .env

# 6. Verify
npm run verify

# 7. Test
npm run test

# 8. Start
npm run auto
```

### Dependencies Installed

The tool installs these packages:

| Package | Size | Purpose |
|---------|------|---------|
| axios | ~1 MB | HTTP client for API calls |
| node-cron | ~100 KB | Schedule automatic refreshes |
| dotenv | ~50 KB | Load environment variables |
| yargs | ~1 MB | Parse command-line arguments |
| chalk | ~200 KB | Colored terminal output |

**Total size**: ~50-80 MB (including sub-dependencies)

---

## Configuration

### Configuration Methods

You can configure the agent using any of these methods:

#### 1. Interactive Setup Wizard (Recommended)

```bash
npm run setup
```

Guides you through entering credentials and settings.

#### 2. Environment Variables (.env file)

Create a `.env` file in the tool directory:

```env
# Authentication
AUTH_USERNAME=your_email@example.com
AUTH_PASSWORD=your_password
AUTH_API_ENDPOINT=http://your-api-url.com/api/auth

# Refresh interval (cron expression)
REFRESH_INTERVAL=*/30 * * * *
```

#### 3. Command Line Arguments

Pass credentials directly when running:

```bash
node index.js \
  --username your_email@example.com \
  --password your_password \
  --endpoint http://api.url.com/auth \
  --auto \
  --interval "*/30 * * * *"
```

### Configuration Options

| Setting | Description | Example | Default |
|---------|-------------|---------|---------|
| `AUTH_USERNAME` | Your username (email) | `user@example.com` | Required |
| `AUTH_PASSWORD` | Your password | `MyP@ssw0rd` | Required |
| `AUTH_API_ENDPOINT` | Authentication API URL | `http://api.url/auth` | Required |
| `REFRESH_INTERVAL` | Cron expression for refresh | `*/30 * * * *` | Every 30 min |

### Refresh Interval Examples

The refresh interval uses cron expression format:

| Interval | Cron Expression | Good For |
|----------|-----------------|----------|
| Every 10 minutes | `*/10 * * * *` | Short-lived tokens (< 30 min) |
| Every 15 minutes | `*/15 * * * *` | Tokens lasting 30-60 min |
| Every 30 minutes | `*/30 * * * *` | **Recommended** for most cases |
| Every hour | `0 * * * *` | Long-lived tokens (> 2 hours) |
| Every 2 hours | `0 */2 * * *` | Very long-lived tokens |
| Every day | `0 0 * * *` | Daily refresh |

**Cron Format**: `minute hour day month weekday`

---

## Usage

### Daily Development Workflow

**Morning: Start auto-refresh**
```bash
cd tools/auto-refresher-agent
npm run auto
```

Leave this terminal running all day. Tokens refresh automatically every 30 minutes (or your configured interval).

**Check token status anytime**
```bash
npm run view
```

**Need a fresh token immediately?**
```bash
npm run refresh
```

### Common Use Cases

#### Use Case 1: Always-On Auto-Refresh

Keep the agent running in a dedicated terminal:

```bash
# Terminal 1: Agent
cd tools/auto-refresher-agent
npm run auto

# Terminal 2: Development
cd /path/to/project
npm start
```

#### Use Case 2: Quick Token Update

Need a fresh token right now:

```bash
cd tools/auto-refresher-agent
npm run refresh
```

#### Use Case 3: Pre-Work Check

Check token status before important work:

```bash
cd tools/auto-refresher-agent
npm run view

# If expiring soon
npm run refresh
```

### What Gets Updated

When the agent runs, it updates:

1. **Token Service File**
   - Path: `libs/core/src/lib/services/token.service.ts`
   - Line: 11 (localhost token)
   - Action: Replaces with fresh token

2. **Token Cache File**
   - Path: `.token-cache.json` (in tool directory)
   - Contents: Latest token + metadata + decoded info
   - Purpose: Quick reference and debugging

---

## Commands Reference

### Available Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run setup` | Interactive setup wizard | First time or credential change |
| `npm run verify` | Verify installation | Check if properly set up |
| `npm run test` | Test connection & credentials | Validate before running |
| `npm run view` | View cached token info | Check token status/expiration |
| `npm run refresh` | Manual token refresh | One-time refresh |
| `npm run auto` | Auto-refresh mode | Daily development |
| `npm start` | Default (manual refresh) | Quick refresh |

### Command Details

#### `npm run setup`

Interactive setup wizard that guides you through configuration.

**What it does:**
- Prompts for username
- Prompts for password
- Prompts for API endpoint
- Prompts for refresh interval
- Creates/updates `.env` file
- Validates configuration

**When to use:**
- First-time setup
- Changing credentials
- Updating configuration

---

#### `npm run verify`

Checks if the installation is properly set up.

**What it checks:**
- Required files exist
- Dependencies installed
- Configuration file exists
- Credentials configured
- Token service path exists
- File permissions

**Output:**
```
🔍 Token Refresher Agent - Verification

1. Checking Required Files
   ✓ index.js
   ✓ setup.js
   ...

2. Checking Configuration
   ✓ .env file exists
   ✓ Username configured
   ✓ Password configured
   ✓ API endpoint configured

✓ All checks passed! You're ready to go.
```

---

#### `npm run test`

Tests connection and credentials without making any changes.

**What it tests:**
- Network connectivity to API
- Authentication credentials
- Token structure in response
- Decodes token successfully
- Recommends refresh interval based on token lifetime

**Output:**
```
🧪 Token Refresher Agent - Connection Test

1. Checking network connectivity...
   ✓ URL is valid

2. Testing authentication...
   ✓ Authentication successful

3. Checking token in response...
   ✓ Token found in response

4. Decoding token...
   ✓ Token decoded successfully

   Token Information:
   - User: user-id
   - Email: your_email@example.com
   - Role: Administrator
   - Issued: 2/10/2026, 3:15:36 PM
   - Expires: 2/10/2026, 5:15:36 PM
   - Valid for: 2h 0m

✓ All tests passed! Your configuration is correct.
```

---

#### `npm run view`

Displays information about the currently cached token.

**What it shows:**
- Token expiration time
- User information (email, role, etc.)
- Time remaining
- Token validity status
- Token preview

**Output:**
```
📋 Cached Token Information

Cache File: .token-cache.json
Last Updated: 2/10/2026, 3:15:36 PM

🔐 Token Details:
  User ID: ff5e15fb-5c6f-4bd1-b743-50a004865430
  Email: your_email@example.com
  Role: Administrator
  Primary Role Type: BUSINESS_ADMINISTRATOR
  Business ID: 20181
  Pod Name: QAINTX
  Locale: en-US

⏰ Time Information:
  Issued At: 2/10/2026, 3:15:36 PM
  Expires At: 2/10/2026, 5:15:36 PM
  Status: ✓ Valid
  Time Remaining: 1h 45m 12s
```

---

#### `npm run refresh`

Refreshes the token once and exits (manual mode).

**What it does:**
1. Authenticates with API
2. Retrieves fresh token
3. Decodes token
4. Caches token locally
5. Updates token.service.ts
6. Displays token info
7. Exits

**When to use:**
- Quick token refresh
- Before starting work
- When token expired
- Testing after configuration

---

#### `npm run auto`

Starts auto-refresh mode (continuous).

**What it does:**
1. Refreshes token immediately
2. Starts cron scheduler
3. Refreshes at configured interval
4. Keeps running until stopped (Ctrl+C)

**When to use:**
- Daily development
- Long work sessions
- Keeping tokens always fresh

**Output:**
```
🤖 Starting Auto-Refresh Mode
Interval: */30 * * * *
Username: your_email@example.com
API Endpoint: http://api.url.com/auth
Press Ctrl+C to stop

🔄 Starting token refresh...
✓ Token refresh completed successfully

✓ Auto-refresh scheduler started
```

### Command Line Options

When running `index.js` directly:

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--username` | `-u` | Authentication username | From .env |
| `--password` | `-p` | Authentication password | From .env |
| `--endpoint` | `-e` | API endpoint URL | From .env |
| `--auto` | `-a` | Enable auto-refresh mode | false |
| `--interval` | `-i` | Cron expression for refresh | `*/30 * * * *` |
| `--mode` | `-m` | Mode: 'manual' or 'auto' | manual |
| `--help` | `-h` | Show help message | - |

**Example:**
```bash
node index.js -u user@example.com -p pass123 -e http://api.url/auth -m auto
```

---

## API Customization

### Finding Your API Endpoint

#### From Bruno

If you're using Bruno for API testing:

1. Open Bruno
2. Find your authentication request (usually "Login" or "Authenticate")
3. Copy the URL - this is your `AUTH_API_ENDPOINT`

**Example:**
```
POST http://ociqaintx.talarianweb.com:8080/api/auth/login
```

Your `.env`:
```env
AUTH_API_ENDPOINT=http://ociqaintx.talarianweb.com:8080/api/auth/login
```

#### Common Endpoint Patterns

| Provider | Typical Endpoint Pattern |
|----------|-------------------------|
| Okta | `https://your-domain.okta.com/oauth2/v1/token` |
| Auth0 | `https://your-domain.auth0.com/oauth/token` |
| Custom | `https://api.yourapp.com/v1/auth/login` |
| Local | `http://localhost:8080/api/authenticate` |

### Customizing the Request

The agent sends this request by default:

```javascript
POST /api/auth
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

If your API is different, edit `index.js` and find the `getAccessToken()` method.

#### Example 1: Different Field Names

If your API expects `email` instead of `username`:

```javascript
// In index.js, getAccessToken() method
const response = await axios.post(this.apiEndpoint, {
  email: this.username,      // Changed from username
  password: this.password,
});
```

#### Example 2: Additional Fields

If your API needs extra fields:

```javascript
const response = await axios.post(this.apiEndpoint, {
  username: this.username,
  password: this.password,
  grant_type: 'password',        // Add if needed
  client_id: 'your_client_id',   // Add if needed
  scope: 'openid profile email', // Add if needed
});
```

#### Example 3: Different Headers

If your API needs specific headers:

```javascript
const response = await axios.post(this.apiEndpoint, {
  username: this.username,
  password: this.password,
}, {
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_api_key',        // Custom header
    'X-Client-Version': '1.0.0',        // Custom header
  },
  timeout: 30000,
});
```

#### Example 4: OAuth2 Password Grant

If your API uses OAuth2:

```javascript
const params = new URLSearchParams();
params.append('grant_type', 'password');
params.append('username', this.username);
params.append('password', this.password);
params.append('client_id', 'your_client_id');

const response = await axios.post(this.apiEndpoint, params, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
```

### Customizing the Response

The agent expects one of these response formats:

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

OR

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

If your API returns a different format, edit the token extraction in `getAccessToken()`:

```javascript
// Nested token
const token = response.data.data.token;

// Different field name
const token = response.data.jwt;

// Token in headers
const token = response.headers['authorization'].replace('Bearer ', '');
```

### Testing Customizations

After customizing, test:

```bash
npm run test
```

This will show if:
- ✓ Authentication is successful
- ✓ Token is found in response
- ✓ Token can be decoded
- ⚠ Any issues with your customization

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                   Token Refresher Agent                      │
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   CLI Layer  │───▶│  Agent Core  │───▶│   Updater    │  │
│  │              │    │              │    │              │  │
│  │  - Commands  │    │  - Auth      │    │  - Service   │  │
│  │  - Options   │    │  - Schedule  │    │  - Cache     │  │
│  │  - Args      │    │  - Decode    │    │  - Logging   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
└─────────┼────────────────────┼────────────────────┼──────────┘
          │                    │                    │
          ▼                    ▼                    ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │   .env   │        │ Auth API │        │  token   │
    │  Config  │        │          │        │ service  │
    └──────────┘        └──────────┘        │   .ts    │
                                            └──────────┘
```

### Component Descriptions

#### 1. Main Agent (`index.js`)

**Purpose**: Core token refresh logic

**Key Methods**:
- `getAccessToken()`: Authenticates and retrieves token
- `decodeToken()`: Decodes JWT to extract information
- `cacheToken()`: Saves token to local cache
- `updateTokenService()`: Updates Angular service file
- `refreshToken()`: Orchestrates the refresh process
- `startAutoRefresh()`: Starts cron-based auto-refresh
- `manualRefresh()`: Single refresh execution

#### 2. Setup Wizard (`setup.js`)

**Purpose**: Interactive configuration

**Features**:
- Guided credential input
- Preserves existing config
- Validates required fields
- Creates .env file
- Provides next steps

#### 3. Connection Tester (`test-connection.js`)

**Purpose**: Validate configuration

**Tests**:
- Network connectivity
- Authentication credentials
- Token structure
- API response format
- Provides recommendations

#### 4. Token Viewer (`view-token.js`)

**Purpose**: Display cached token details

**Shows**:
- Token expiration time
- User information
- Time remaining
- Validity status
- Token preview

#### 5. Verifier (`verify.js`)

**Purpose**: Installation verification

**Checks**:
- Required files exist
- Dependencies installed
- Configuration valid
- Credentials set
- Token service accessible

### Data Flow

#### Manual Refresh Flow

```
User runs command
    │
    ▼
Parse CLI arguments / Load .env
    │
    ▼
Create TokenRefresherAgent instance
    │
    ▼
Call refreshToken()
    │
    ├──▶ Authenticate with API
    │    └──▶ Receive JWT token
    │
    ├──▶ Decode JWT
    │    └──▶ Extract user info & expiration
    │
    ├──▶ Cache token
    │    └──▶ Write to .token-cache.json
    │
    └──▶ Update service file
         └──▶ Modify token.service.ts
```

#### Auto-Refresh Flow

```
User starts auto-refresh
    │
    ▼
Create TokenRefresherAgent with auto=true
    │
    ▼
Execute immediate refresh
    │
    ▼
Start cron scheduler
    │
    ▼
Wait for interval ────┐
    │                 │
    ▼                 │
Execute refresh       │
    │                 │
    └─────────────────┘
    (repeat until stopped)
```

### Token Lifecycle

```
1. AUTHENTICATION
   POST /api/auth with username/password
   ↓
2. TOKEN RECEIPT
   Receive JWT token in response
   ↓
3. DECODE
   Extract payload: user info, exp, iat
   ↓
4. CACHE
   Save to .token-cache.json with metadata
   ↓
5. UPDATE SERVICE
   Replace token in token.service.ts line 11
   ↓
6. USE
   Application uses token for API calls
   ↓
7. MONITOR
   Check expiration time
   ↓
8. REFRESH (before expiration)
   Repeat from step 1
```

---

## File Structure

### Project Layout

```
tools/auto-refresher-agent/
│
├── 🚀 EXECUTABLE SCRIPTS (5 files)
│   ├── index.js              - Main token refresher agent
│   ├── setup.js              - Interactive setup wizard
│   ├── test-connection.js    - Connection and credential tester
│   ├── view-token.js         - Token information viewer
│   └── verify.js             - Installation verifier
│
├── 📚 DOCUMENTATION
│   └── README.md             - This file (complete documentation)
│
├── ⚙️ CONFIGURATION (4 files)
│   ├── package.json          - NPM configuration with scripts
│   ├── .gitignore           - Git ignore rules (security)
│   ├── env.example          - Environment config template
│   └── config.template.json - JSON config template
│
└── 🔒 GENERATED (created on first run)
    ├── .env                 - Your credentials (YOU create this)
    ├── .token-cache.json    - Token cache (auto-generated)
    └── node_modules/        - Dependencies (npm install)
```

### File Descriptions

| File | Purpose | Edit? |
|------|---------|-------|
| `index.js` | Main agent script | Only if customizing |
| `setup.js` | Interactive setup | No |
| `test-connection.js` | Connection tester | No |
| `view-token.js` | Token viewer | No |
| `verify.js` | Installation verifier | No |
| `package.json` | NPM config | No |
| `.gitignore` | Git ignore rules | No |
| `env.example` | Config template | No |
| `config.template.json` | JSON template | No |
| `.env` | **Your credentials** | **YES** |
| `.token-cache.json` | Token cache | No (auto-generated) |
| `node_modules/` | Dependencies | No (npm generated) |

### What Files You Need to Touch

**✅ Files You Edit:**
- `.env` - Your credentials and settings

**🚫 Files You Don't Edit:**
- All `.js` files (unless customizing)
- `package.json` (unless adding features)
- `.token-cache.json` (auto-generated)

**📖 Files You Read:**
- `README.md` - This documentation
- `env.example` - Configuration template
- `config.template.json` - JSON reference
- `.token-cache.json` - Via `npm run view`

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Username and password are required"

**Cause**: Configuration not set up

**Solutions**:
1. Run interactive setup: `npm run setup`
2. Create `.env` file from template: `cp env.example .env`
3. Pass credentials via command line: `--username` and `--password`

**Verify**:
```bash
cat .env | grep AUTH_
```

---

#### Issue: "Cannot find module 'axios'"

**Cause**: Dependencies not installed

**Solution**:
```bash
npm install
```

**Verify**:
```bash
ls node_modules/ | grep axios
```

---

#### Issue: "Authentication failed: 401"

**Cause**: Invalid credentials or wrong API endpoint

**Solutions**:
1. Verify username and password in `.env`
2. Check API endpoint URL
3. Test with curl:
   ```bash
   curl -X POST 'http://your-api-url.com/api/auth' \
     -H 'Content-Type: application/json' \
     -d '{"username":"your_email","password":"your_password"}'
   ```
4. Check if API is accessible
5. Verify your account has proper permissions

**Debug**:
```bash
npm run test
```

---

#### Issue: "ECONNREFUSED" or "Connection refused"

**Cause**: Cannot reach API endpoint

**Solutions**:
1. Check API endpoint URL in `.env`
2. Verify network connectivity: `ping api-host.com`
3. Check if API server is running
4. Try accessing URL in browser
5. Check firewall/VPN settings

**Debug**:
```bash
npm run test
```

---

#### Issue: "ENOENT: cannot find token service file"

**Cause**: Token service file not at expected location

**Solutions**:
1. Verify tool is in correct directory: `tools/auto-refresher-agent`
2. Check if file exists:
   ```bash
   ls ../../libs/core/src/lib/services/token.service.ts
   ```
3. Check file path in code if customized

**Expected path**: `libs/core/src/lib/services/token.service.ts`

---

#### Issue: "Token expires too quickly"

**Cause**: Refresh interval longer than token lifetime

**Solutions**:
1. Reduce refresh interval in `.env`:
   ```env
   REFRESH_INTERVAL=*/15 * * * *  # Every 15 minutes
   REFRESH_INTERVAL=*/10 * * * *  # Every 10 minutes
   ```
2. Run `npm run auto` to keep refreshing
3. Check token lifetime with `npm run view`
4. Contact API provider about token lifetime

---

#### Issue: "Permission denied" when running scripts

**Cause**: Scripts not executable

**Solution**:
```bash
chmod +x *.js
```

**Verify**:
```bash
ls -la *.js
```

---

#### Issue: Token not updating in application

**Cause**: Multiple possible reasons

**Solutions**:
1. Verify token was updated:
   ```bash
   npm run view
   cat libs/core/src/lib/services/token.service.ts | grep "private accessToken"
   ```
2. Restart application/dev server
3. Clear browser cache
4. Check if correct file is being updated

---

### Diagnostic Commands

Use these commands to diagnose issues:

```bash
# Check installation
npm run verify

# Test connection
npm run test

# View token status
npm run view

# Check configuration
cat .env

# Check if dependencies installed
ls node_modules/ | wc -l  # Should show ~200+ packages

# Check token service file
ls -la ../../libs/core/src/lib/services/token.service.ts
```

---

## Security

### Security Features

1. **Credentials Protection**
   - Stored in `.env` file (gitignored)
   - Never displayed in full in logs
   - Recommended file permissions: 600
   - Never hardcoded in code

2. **Token Security**
   - Cached locally in `.token-cache.json` (gitignored)
   - Not committed to version control
   - Refreshed before expiration
   - Can be viewed only via `npm run view`

3. **API Security**
   - Supports HTTPS endpoints
   - Configurable headers for API keys
   - No credentials in code
   - Timeout protection

### Security Best Practices

#### ✅ DO

1. **Use .env file** for credentials
   ```bash
   cp env.example .env
   # Edit .env with your credentials
   ```

2. **Restrict file permissions**
   ```bash
   chmod 600 .env
   chmod 600 .token-cache.json
   ```

3. **Use secure endpoints**
   - Always use HTTPS in production
   - Only use HTTP for local development

4. **Rotate passwords regularly**
   - Update `.env` when password changes
   - Run `npm run setup` to update

5. **Keep dependencies updated**
   ```bash
   npm update
   npm audit
   ```

#### ❌ DON'T

1. ❌ **Never commit `.env` file**
   - Already in `.gitignore`
   - Contains sensitive credentials

2. ❌ **Never share `.token-cache.json`**
   - Contains your access token
   - Can be used to access your account

3. ❌ **Never push credentials to git**
   ```bash
   # Check before committing
   git status
   git diff
   ```

4. ❌ **Never hardcode credentials**
   - Always use `.env` file
   - Or pass via command line

5. ❌ **Never share tokens in chat/email**
   - Tokens can be used to impersonate you
   - Treat like passwords

### Security Checklist

Before using in production:

- [ ] `.env` file has secure permissions (600)
- [ ] `.env` is in `.gitignore`
- [ ] Using HTTPS endpoint (not HTTP)
- [ ] Passwords are strong and unique
- [ ] Credentials stored in password manager
- [ ] `.token-cache.json` is gitignored
- [ ] Dependencies are up to date
- [ ] No credentials in code
- [ ] Team members have their own credentials

### What's in .gitignore

The `.gitignore` file prevents these from being committed:

```
# Sensitive
.env
.token-cache.json

# Dependencies
node_modules/
package-lock.json

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

---

## Workflows & Integration

### Daily Workflow

#### Morning Routine

```bash
cd tools/auto-refresher-agent
npm run auto
```

✨ Token stays fresh all day! Leave this terminal running.

#### During Work

```bash
# Check token status anytime
npm run view

# Get fresh token immediately if needed
npm run refresh
```

### Integration Options

#### Option 1: Dedicated Terminal (Recommended)

Keep the agent running in its own terminal:

```bash
# Terminal 1: Agent
cd tools/auto-refresher-agent
npm run auto

# Terminal 2: Development
cd /path/to/project
npm start
```

**Pros**:
- Always fresh tokens
- No interruptions
- Simple to use

**Cons**:
- Uses one terminal
- Must remember to start

---

#### Option 2: Pre-Development Refresh

Refresh token once before starting work:

```bash
cd tools/auto-refresher-agent
npm run refresh
cd ../..
npm start
```

**Pros**:
- Simple one-time action
- No ongoing process

**Cons**:
- Token may expire during work
- Must remember to refresh

---

#### Option 3: Shell Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Token management aliases
alias token-refresh="cd /path/to/tools/auto-refresher-agent && npm run refresh && cd -"
alias token-auto="cd /path/to/tools/auto-refresher-agent && npm run auto"
alias token-view="cd /path/to/tools/auto-refresher-agent && npm run view"
alias token-test="cd /path/to/tools/auto-refresher-agent && npm run test"
alias token-setup="cd /path/to/tools/auto-refresher-agent && npm run setup"
```

Then reload:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

**Usage**:
```bash
token-refresh  # Quick refresh
token-view     # Check status
token-auto     # Start auto mode
```

**Pros**:
- Quick access from anywhere
- Easy to remember
- Consistent commands

---

#### Option 4: NPM Scripts Integration

Add to main `package.json`:

```json
{
  "scripts": {
    "token-refresh": "cd tools/auto-refresher-agent && npm run refresh",
    "token-auto": "cd tools/auto-refresher-agent && npm run auto",
    "token-view": "cd tools/auto-refresher-agent && npm run view",
    "predev": "npm run token-refresh",
    "dev": "ng serve"
  }
}
```

**Usage**:
```bash
npm run dev  # Automatically refreshes token first
```

**Pros**:
- Integrated with project
- Automatic refresh before dev
- Team-wide setup

---

### Workflow Recommendations

#### For Short Sessions (< 2 hours)

```bash
npm run refresh  # Once before starting
```

Token will last the session.

#### For Normal Sessions (2-8 hours)

```bash
npm run auto  # Start auto-refresh
```

Keep running in background.

#### For All-Day Sessions

```bash
npm run auto  # Start in morning
```

Leave running entire day.

#### For Team Projects

1. Add to project documentation
2. Add NPM scripts integration
3. Share `.env.example` (not `.env`!)
4. Each developer sets up their own credentials

---

## Examples

### Example 1: Quick Manual Refresh

```bash
node index.js \
  --username john.doe@example.com \
  --password mySecurePass123 \
  --endpoint https://auth.talarianweb.com/oauth2/token \
  --mode manual
```

**Output**:
```
🔧 Manual Refresh Mode

🔄 Starting token refresh...
🔐 Attempting to authenticate...
✓ Authentication successful
✓ Token cached successfully
✓ Token service updated successfully

📋 Token Information:
  User: john.doe@example.com
  Role: Administrator
  Expires At: 2/10/2026, 5:15:36 PM
  Valid For: 2h 0m

✓ Token refresh completed successfully
```

---

### Example 2: Auto-Refresh Every 15 Minutes

```bash
node index.js \
  --username john.doe@example.com \
  --password mySecurePass123 \
  --endpoint https://auth.talarianweb.com/oauth2/token \
  --auto \
  --interval "*/15 * * * *"
```

**Output**:
```
🤖 Starting Auto-Refresh Mode
Interval: */15 * * * *
Username: john.doe@example.com
API Endpoint: https://auth.talarianweb.com/oauth2/token
Press Ctrl+C to stop

🔄 Starting token refresh...
✓ Token refresh completed successfully

✓ Auto-refresh scheduler started

[Waits 15 minutes]

🔄 Starting token refresh...
✓ Token refresh completed successfully

[Repeats every 15 minutes]
```

---

### Example 3: Using Environment Variables

```bash
# Set up .env file
cat > .env << EOF
AUTH_USERNAME=john.doe@example.com
AUTH_PASSWORD=mySecurePass123
AUTH_API_ENDPOINT=https://auth.example.com/api/auth
REFRESH_INTERVAL=*/30 * * * *
EOF

# Set secure permissions
chmod 600 .env

# Run with auto-refresh
npm run auto
```

---

### Example 4: Complete First-Time Setup

```bash
# 1. Navigate to directory
cd tools/auto-refresher-agent

# 2. Install dependencies
npm install

# 3. Run setup wizard
npm run setup
# Enter credentials when prompted

# 4. Verify installation
npm run verify

# 5. Test connection
npm run test

# 6. View configuration
cat .env

# 7. Do first refresh
npm run refresh

# 8. Check token
npm run view

# 9. Start auto-refresh
npm run auto
```

---

### Example 5: Debugging Connection Issues

```bash
# Test connection
npm run test

# If it fails, try curl
curl -X POST 'http://your-api-url.com/api/auth' \
  -H 'Content-Type: application/json' \
  -d '{"username":"your_email","password":"your_password"}'

# Check configuration
cat .env

# Verify endpoint
echo "Testing endpoint:"
curl -v http://your-api-url.com/api/auth

# Check DNS
nslookup your-api-host.com

# Check network
ping your-api-host.com
```

---

## FAQ

### General Questions

#### Q: How often should I refresh tokens?

**A**: Default is every 30 minutes, which works for most tokens lasting 1-2 hours. Adjust based on your token lifetime:
- Token < 1 hour: Every 10-15 minutes
- Token 1-2 hours: Every 30 minutes (recommended)
- Token > 2 hours: Every hour

Use `npm run view` to check token expiration and decide.

---

#### Q: Can I run multiple instances?

**A**: Yes, but they'll overwrite each other's tokens. Better to run one instance in auto mode.

---

#### Q: What if I'm offline?

**A**: The agent will fail to refresh and show an error. Once online, run `npm run refresh` manually.

---

#### Q: Does it work with VPN?

**A**: Yes, as long as your VPN allows access to the API endpoint.

---

### Configuration Questions

#### Q: Where are my credentials stored?

**A**: In `.env` file in the tool directory. This file is gitignored for security.

---

#### Q: Can I use different credentials for different projects?

**A**: Yes, create separate `.env` files or use command-line arguments.

---

#### Q: How do I change my password?

**A**: Edit `.env` file or run `npm run setup` again.

---

### Technical Questions

#### Q: What Node.js version do I need?

**A**: Version 14 or higher. Check with: `node --version`

---

#### Q: Can I customize the API request?

**A**: Yes! See the [API Customization](#api-customization) section above.

---

#### Q: Where is the token cached?

**A**: In `.token-cache.json` in the tool directory. View with `npm run view`.

---

#### Q: How do I know if the token was updated?

**A**: Run `npm run view` to see last update time and token info.

---

### Troubleshooting Questions

#### Q: Why is authentication failing?

**A**: Common causes:
1. Wrong username/password
2. Wrong API endpoint
3. API is down
4. Network issues

Run `npm run test` to diagnose.

---

#### Q: Why isn't my application using the new token?

**A**: Try:
1. Restart your dev server
2. Clear browser cache
3. Check if correct file is being updated
4. Verify token was actually updated: `npm run view`

---

#### Q: Can I see what's being sent to the API?

**A**: Yes, edit `index.js` and add console.log statements in the `getAccessToken()` method. Or use `npm run test` for diagnostics.

---

### Security Questions

#### Q: Is it safe to store my password in .env?

**A**: For local development, yes, as long as:
- `.env` is in `.gitignore` (it is by default)
- File permissions are set to 600: `chmod 600 .env`
- Your computer is secure

For production, use environment variables or secret management.

---

#### Q: Can someone steal my token?

**A**: The token is cached locally in `.token-cache.json`, which is gitignored. As long as:
- You don't commit it to git
- You don't share the file
- Your computer is secure

It's safe. Treat tokens like passwords.

---

#### Q: Should I commit .env to git?

**A**: **Never!** It contains credentials. It's already in `.gitignore`.

---

### Workflow Questions

#### Q: Should I keep auto-refresh running all day?

**A**: Yes, that's the recommended workflow. It uses minimal resources and keeps tokens always fresh.

---

#### Q: Can I use this in CI/CD?

**A**: It's designed for local development. For CI/CD, use proper secret management and service accounts.

---

#### Q: How do I stop auto-refresh?

**A**: Press `Ctrl+C` in the terminal where it's running.

---

## Quick Reference Card

```
╔════════════════════════════════════════════════════════════╗
║           TOKEN REFRESHER AGENT - QUICK REFERENCE          ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  SETUP                                                     ║
║  • npm install          Install dependencies               ║
║  • npm run setup        Interactive setup                  ║
║  • npm run verify       Verify installation                ║
║                                                            ║
║  DAILY USE                                                 ║
║  • npm run auto         Start auto-refresh                 ║
║  • npm run refresh      Manual refresh                     ║
║  • npm run view         Check token status                 ║
║                                                            ║
║  TESTING                                                   ║
║  • npm run test         Test connection                    ║
║  • npm run verify       Check setup                        ║
║                                                            ║
║  FILES                                                     ║
║  • .env                 Your credentials (edit this)       ║
║  • .token-cache.json    Token cache (auto-generated)       ║
║  • env.example          Configuration template             ║
║                                                            ║
║  LOCATION                                                  ║
║  • tools/auto-refresher-agent/                            ║
║                                                            ║
║  CRON INTERVALS                                            ║
║  • */10 * * * *         Every 10 minutes                   ║
║  • */15 * * * *         Every 15 minutes                   ║
║  • */30 * * * *         Every 30 minutes (default)         ║
║  • 0 * * * *            Every hour                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Support

For issues or questions:

1. **Check this README** - Most answers are here
2. **Run diagnostics**: `npm run verify` and `npm run test`
3. **Check configuration**: `cat .env`
4. **View token status**: `npm run view`
5. **Review error messages** - They usually indicate the problem

---

## License

MIT

---

## Summary

**Token Refresher Agent** automates JWT token management for local development:

- ✅ **Setup in 3 minutes** - Simple installation and configuration
- ✅ **Set and forget** - Automatic refresh at scheduled intervals
- ✅ **Always fresh tokens** - Never deal with expired tokens again
- ✅ **Secure by default** - Credentials stored safely, never committed
- ✅ **Easy to customize** - Adapt to any API structure
- ✅ **Comprehensive testing** - Built-in diagnostics and verification
- ✅ **Full documentation** - Everything you need in one place

**Get started now:**
```bash
cd tools/auto-refresher-agent
npm install && npm run setup && npm run auto
```

**Happy coding!** 🚀
