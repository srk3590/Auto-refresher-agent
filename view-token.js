#!/usr/bin/env node

/**
 * View Token Script
 * Displays information about the currently cached token
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function viewToken() {
  const tokenCachePath = path.join(__dirname, '.token-cache.json');
  
  try {
    const content = await fs.readFile(tokenCachePath, 'utf-8');
    const tokenData = JSON.parse(content);
    
    console.log(chalk.bold.cyan('\n📋 Cached Token Information\n'));
    
    console.log(chalk.gray('Cache File:'), tokenCachePath);
    console.log(chalk.gray('Last Updated:'), new Date(tokenData.timestamp).toLocaleString());
    
    if (tokenData.decoded) {
      const decoded = tokenData.decoded;
      
      console.log(chalk.cyan('\n🔐 Token Details:'));
      console.log(chalk.gray('  User ID:'), decoded.sub || 'N/A');
      console.log(chalk.gray('  Email:'), decoded.xtlyEmail || decoded.email || 'N/A');
      console.log(chalk.gray('  Role:'), decoded.roles || decoded.role || 'N/A');
      console.log(chalk.gray('  Primary Role Type:'), decoded.primaryRoleType || 'N/A');
      console.log(chalk.gray('  Business ID:'), decoded.bizId || 'N/A');
      console.log(chalk.gray('  Pod Name:'), decoded.podName || 'N/A');
      console.log(chalk.gray('  Locale:'), decoded.locale || 'N/A');
      
      console.log(chalk.cyan('\n⏰ Time Information:'));
      console.log(chalk.gray('  Issued At:'), new Date(decoded.iat * 1000).toLocaleString());
      console.log(chalk.gray('  Expires At:'), new Date(decoded.exp * 1000).toLocaleString());
      
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - now;
      
      if (timeLeft > 0) {
        const hoursLeft = Math.floor(timeLeft / 3600);
        const minutesLeft = Math.floor((timeLeft % 3600) / 60);
        const secondsLeft = timeLeft % 60;
        
        console.log(chalk.green('  Status:'), '✓ Valid');
        console.log(chalk.gray('  Time Remaining:'), `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
        
        if (timeLeft < 300) { // Less than 5 minutes
          console.log(chalk.red('\n  ⚠ Token expires soon! Refresh recommended.'));
        } else if (timeLeft < 900) { // Less than 15 minutes
          console.log(chalk.yellow('\n  ⚠ Token expires in less than 15 minutes.'));
        }
      } else {
        const timeExpired = Math.abs(timeLeft);
        const hoursExpired = Math.floor(timeExpired / 3600);
        const minutesExpired = Math.floor((timeExpired % 3600) / 60);
        
        console.log(chalk.red('  Status:'), '✗ Expired');
        console.log(chalk.gray('  Expired:'), `${hoursExpired}h ${minutesExpired}m ago`);
        console.log(chalk.yellow('\n  ⚠ Token has expired. Run refresh to get a new token.'));
      }
      
      console.log(chalk.cyan('\n🔗 Token Preview:'));
      const token = tokenData.accessToken;
      console.log(chalk.gray('  Length:'), token.length, 'characters');
      console.log(chalk.gray('  First 50 chars:'), token.substring(0, 50) + '...');
      console.log(chalk.gray('  Last 50 chars:'), '...' + token.substring(token.length - 50));
      
    } else {
      console.log(chalk.yellow('\n⚠ Token could not be decoded'));
    }
    
    console.log(chalk.cyan('\n💡 Quick Actions:'));
    console.log(chalk.gray('  Refresh token:'), 'npm run refresh');
    console.log(chalk.gray('  Start auto-refresh:'), 'npm run auto');
    console.log(chalk.gray('  Test connection:'), 'npm run test\n');
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(chalk.yellow('\n⚠ No cached token found'));
      console.log(chalk.gray('\nTo get a token, run:'));
      console.log(chalk.cyan('  npm run refresh\n'));
    } else {
      console.error(chalk.red('\n✗ Error reading token cache:'), error.message);
    }
    process.exit(1);
  }
}

viewToken().catch(error => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
});
