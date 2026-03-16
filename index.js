#!/usr/bin/env node

import axios from 'axios';
import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

class TokenRefresherAgent {
  constructor(config) {
    this.username = config.username;
    this.password = config.password;
    this.autoRefresh = config.autoRefresh;
    this.refreshInterval = config.refreshInterval || '*/30 * * * *'; // Default: every 30 minutes
    this.apiEndpoint = config.apiEndpoint || process.env.AUTH_API_ENDPOINT;
    this.tokenServicePath = config.tokenServicePath || path.join(__dirname, '../../libs/core/src/lib/services/token.service.ts');
    this.tokenCachePath = path.join(__dirname, '.token-cache.json');
  }

  /**
   * Authenticate and get access token
   */
  async getAccessToken() {
    try {
      console.log(chalk.blue('🔐 Attempting to authenticate...'));

      // Adjust this endpoint and payload based on your actual authentication API
      const params = new URLSearchParams();
      params.append('username', this.username);  // ✅ This creates proper form data
      params.append('password', this.password);

      const response = await axios.post(this.apiEndpoint, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data && response.data.token) {
        console.log(chalk.green('✓ Authentication successful'));
        return response.data.token;
      } else if (response.data && response.data.accessToken) {
        console.log(chalk.green('✓ Authentication successful'));
        return response.data.accessToken;
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error(chalk.red('✗ Authentication failed:'), error.message);
      if (error.response) {
        console.error(chalk.red('Response status:'), error.response.status);
        console.error(chalk.red('Response data:'), error.response.data);
      }
      throw error;
    }
  }

  /**
   * Decode JWT token to get expiration time
   */
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        Buffer.from(base64, 'base64')
          .toString('ascii')
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error(chalk.red('Error decoding token:'), error.message);
      return null;
    }
  }

  /**
   * Cache token to local file
   */
  async cacheToken(token) {
    try {
      const tokenData = {
        accessToken: token,
        timestamp: new Date().toISOString(),
        decoded: this.decodeToken(token),
      };
      await fs.writeFile(this.tokenCachePath, JSON.stringify(tokenData, null, 2));
      console.log(chalk.green('✓ Token cached successfully'));
    } catch (error) {
      console.error(chalk.yellow('⚠ Failed to cache token:'), error.message);
    }
  }

  /**
   * Update token in the Angular service file
   */
  async updateTokenService(token) {
    try {
      let content = await fs.readFile(this.tokenServicePath, 'utf-8');
      
      // Find and replace the hardcoded token on line 11
      const lines = content.split('\n');
      const tokenLineIndex = lines.findIndex(line => line.includes('private accessToken = location.host.includes'));
      
      if (tokenLineIndex !== -1) {
        // Preserve the original structure but update the token
        lines[tokenLineIndex] = `  private accessToken = location.host.includes('localhost') ?`;
        lines[tokenLineIndex + 1] = `    '${token}' :`;
        
        content = lines.join('\n');
        await fs.writeFile(this.tokenServicePath, content);
        console.log(chalk.green('✓ Token service updated successfully'));
      } else {
        console.log(chalk.yellow('⚠ Could not find token line in service file'));
      }
    } catch (error) {
      console.error(chalk.red('✗ Failed to update token service:'), error.message);
      throw error;
    }
  }

  /**
   * Display token information
   */
  displayTokenInfo(token) {
    const decoded = this.decodeToken(token);
    if (decoded) {
      console.log(chalk.cyan('\n📋 Token Information:'));
      console.log(chalk.gray('  User:'), decoded.sub || decoded.xtlyEmail || 'N/A');
      console.log(chalk.gray('  Email:'), decoded.xtlyEmail || 'N/A');
      console.log(chalk.gray('  Role:'), decoded.roles || 'N/A');
      console.log(chalk.gray('  Issued At:'), new Date(decoded.iat * 1000).toLocaleString());
      console.log(chalk.gray('  Expires At:'), new Date(decoded.exp * 1000).toLocaleString());
      
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - now;
      const hoursLeft = Math.floor(timeLeft / 3600);
      const minutesLeft = Math.floor((timeLeft % 3600) / 60);
      console.log(chalk.gray('  Valid For:'), `${hoursLeft}h ${minutesLeft}m\n`);
    }
  }

  /**
   * Refresh token process
   */
  async refreshToken() {
    try {
      console.log(chalk.bold.blue('\n🔄 Starting token refresh...'));
      console.log(chalk.gray('Timestamp:'), new Date().toLocaleString());
      
      const token = await this.getAccessToken();
      
      if (token) {
        await this.cacheToken(token);
        await this.updateTokenService(token);
        this.displayTokenInfo(token);
        console.log(chalk.bold.green('✓ Token refresh completed successfully\n'));
        return true;
      } else {
        throw new Error('Failed to retrieve token');
      }
    } catch (error) {
      console.error(chalk.bold.red('✗ Token refresh failed\n'));
      return false;
    }
  }

  /**
   * Start auto-refresh mode
   */
  startAutoRefresh() {
    console.log(chalk.bold.yellow('\n🤖 Starting Auto-Refresh Mode'));
    console.log(chalk.gray('Interval:'), this.refreshInterval);
    console.log(chalk.gray('Username:'), this.username);
    console.log(chalk.gray('API Endpoint:'), this.apiEndpoint);
    console.log(chalk.gray('Press Ctrl+C to stop\n'));
  
    // Refresh immediately on start
    this.refreshToken().catch(error => {
      console.error(chalk.red('Initial refresh failed:'), error.message);
    });
  
    // Validate and schedule periodic refresh
    try {
      const scheduledTask = cron.schedule(this.refreshInterval, async () => {
        try {
          console.log(chalk.blue('\n⏰ Scheduled refresh triggered at'), new Date().toLocaleString());
          await this.refreshToken();
        } catch (error) {
          console.error(chalk.red('Scheduled refresh failed:'), error.message);
        }
      }, {
        scheduled: true,
        timezone: "Asia/Kolkata"  // Or your timezone
      });
  
      if (scheduledTask) {
        console.log(chalk.green('✓ Auto-refresh scheduler started'));
        console.log(chalk.gray(`Next refresh scheduled per interval: ${this.refreshInterval}\n`));
      } else {
        throw new Error('Failed to create scheduled task');
      }
    } catch (error) {
      console.error(chalk.red('✗ Failed to schedule auto-refresh:'), error.message);
      console.error(chalk.yellow('Falling back to manual mode...'));
      process.exit(1);
    }
  }

  /**
   * Manual refresh mode
   */
  async manualRefresh() {
    console.log(chalk.bold.yellow('\n🔧 Manual Refresh Mode'));
    await this.refreshToken();
    process.exit(0);
  }

  /**
   * Start the agent
   */
  async start() {
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      await this.manualRefresh();
    }
  }
}

// CLI Configuration
const argv = yargs(hideBin(process.argv))
  .option('username', {
    alias: 'u',
    type: 'string',
    description: 'Username for authentication',
  })
  .option('password', {
    alias: 'p',
    type: 'string',
    description: 'Password for authentication',
  })
  .option('auto', {
    alias: 'a',
    type: 'boolean',
    description: 'Enable auto-refresh mode',
    default: false,
  })
  .option('interval', {
    alias: 'i',
    type: 'string',
    description: 'Cron expression for refresh interval (e.g., "*/30 * * * *" for every 30 minutes)',
  })
  .option('endpoint', {
    alias: 'e',
    type: 'string',
    description: 'Authentication API endpoint',
  })
  .option('mode', {
    alias: 'm',
    type: 'string',
    description: 'Mode: manual or auto',
    choices: ['manual', 'auto'],
  })
  .help()
  .alias('help', 'h')
  .argv;

// Main execution
(async () => {
  try {
    const config = {
      username: argv.username || process.env.AUTH_USERNAME,
      password: argv.password || process.env.AUTH_PASSWORD,
      autoRefresh: argv.auto || argv.mode === 'auto',
      refreshInterval: process.env.REFRESH_INTERVAL || argv.interval || '*/30 * * * *',
      apiEndpoint: argv.endpoint || process.env.AUTH_API_ENDPOINT,
    };

    // Validate required configuration
    if (!config.username || !config.password) {
      console.error(chalk.red('\n✗ Error: Username and password are required'));
      console.log(chalk.yellow('\nProvide them via:'));
      console.log(chalk.gray('  1. Command line: --username <user> --password <pass>'));
      console.log(chalk.gray('  2. Environment variables: AUTH_USERNAME and AUTH_PASSWORD'));
      console.log(chalk.gray('  3. .env file in the tool directory\n'));
      process.exit(1);
    }

    if (!config.apiEndpoint) {
      console.error(chalk.red('\n✗ Error: API endpoint is required'));
      console.log(chalk.yellow('\nProvide it via:'));
      console.log(chalk.gray('  1. Command line: --endpoint <url>'));
      console.log(chalk.gray('  2. Environment variable: AUTH_API_ENDPOINT'));
      console.log(chalk.gray('  3. .env file in the tool directory\n'));
      process.exit(1);
    }

    const agent = new TokenRefresherAgent(config);
    await agent.start();
  } catch (error) {
    console.error(chalk.red('\n✗ Fatal error:'), error.message);
    process.exit(1);
  }
})();
