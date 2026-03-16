#!/usr/bin/env node

/**
 * Test Connection Script
 * Tests authentication endpoint and credentials without modifying any files
 */

import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function testConnection() {
  console.log(chalk.bold.cyan('\n🧪 Token Refresher Agent - Connection Test\n'));
  
  // Get credentials
  let username = process.env.AUTH_USERNAME;
  let password = process.env.AUTH_PASSWORD;
  let endpoint = process.env.AUTH_API_ENDPOINT;
  
  if (!username) {
    username = await question(chalk.yellow('Enter username: '));
  } else {
    console.log(chalk.gray('Username:'), username);
  }
  
  if (!password) {
    password = await question(chalk.yellow('Enter password: '));
  } else {
    console.log(chalk.gray('Password:'), '********');
  }
  
  if (!endpoint) {
    endpoint = await question(chalk.yellow('Enter API endpoint: '));
  } else {
    console.log(chalk.gray('Endpoint:'), endpoint);
  }
  
  rl.close();
  
  console.log(chalk.blue('\n🔌 Testing connection...\n'));
  
  try {
    // Test 1: Network connectivity
    console.log(chalk.gray('1. Checking network connectivity...'));
    const url = new URL(endpoint);
    console.log(chalk.green(`   ✓ URL is valid: ${url.hostname}`));
    
    // Test 2: Authentication
    console.log(chalk.gray('\n2. Testing authentication...'));
    const response = await axios.post(endpoint, {
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 30000,
      validateStatus: () => true, // Don't throw on any status
    });
    
    console.log(chalk.gray('   Response status:'), response.status);
    
    if (response.status === 200 || response.status === 201) {
      console.log(chalk.green('   ✓ Authentication successful'));
      
      // Test 3: Token in response
      console.log(chalk.gray('\n3. Checking token in response...'));
      const token = response.data?.token || response.data?.accessToken;
      
      if (token) {
        console.log(chalk.green('   ✓ Token found in response'));
        console.log(chalk.gray('   Token length:'), token.length, 'characters');
        console.log(chalk.gray('   Token preview:'), token.substring(0, 50) + '...');
        
        // Test 4: Decode token
        console.log(chalk.gray('\n4. Decoding token...'));
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
          const decoded = JSON.parse(jsonPayload);
          
          console.log(chalk.green('   ✓ Token decoded successfully'));
          console.log(chalk.cyan('\n   Token Information:'));
          console.log(chalk.gray('   - User:'), decoded.sub || decoded.xtlyEmail || 'N/A');
          console.log(chalk.gray('   - Email:'), decoded.xtlyEmail || decoded.email || 'N/A');
          console.log(chalk.gray('   - Role:'), decoded.roles || decoded.role || 'N/A');
          console.log(chalk.gray('   - Issued:'), new Date(decoded.iat * 1000).toLocaleString());
          console.log(chalk.gray('   - Expires:'), new Date(decoded.exp * 1000).toLocaleString());
          
          const now = Math.floor(Date.now() / 1000);
          const timeLeft = decoded.exp - now;
          const hoursLeft = Math.floor(timeLeft / 3600);
          const minutesLeft = Math.floor((timeLeft % 3600) / 60);
          console.log(chalk.gray('   - Valid for:'), `${hoursLeft}h ${minutesLeft}m`);
          
          // Recommendations
          console.log(chalk.cyan('\n📝 Recommendations:'));
          if (timeLeft < 1800) { // Less than 30 minutes
            console.log(chalk.yellow('   ⚠ Token lifetime is short. Consider refresh interval: */10 * * * *'));
          } else if (timeLeft < 3600) { // Less than 1 hour
            console.log(chalk.blue('   💡 Recommended refresh interval: */15 * * * *'));
          } else if (timeLeft < 7200) { // Less than 2 hours
            console.log(chalk.blue('   💡 Recommended refresh interval: */30 * * * *'));
          } else {
            console.log(chalk.blue('   💡 Recommended refresh interval: 0 * * * * (every hour)'));
          }
          
        } catch (decodeError) {
          console.log(chalk.yellow('   ⚠ Could not decode token'));
          console.log(chalk.gray('   Error:'), decodeError.message);
        }
        
        console.log(chalk.bold.green('\n✓ All tests passed! Your configuration is correct.\n'));
        console.log(chalk.cyan('Next steps:'));
        console.log(chalk.gray('  1. Update your .env file with these credentials (if not already done)'));
        console.log(chalk.gray('  2. Run: npm run refresh (for one-time refresh)'));
        console.log(chalk.gray('  3. Run: npm run auto (for continuous refresh)\n'));
        
      } else {
        console.log(chalk.red('   ✗ Token not found in response'));
        console.log(chalk.yellow('\n   Response structure:'));
        console.log(JSON.stringify(response.data, null, 2));
        console.log(chalk.yellow('\n   ⚠ You may need to modify index.js to match your API response structure'));
      }
      
    } else if (response.status === 401) {
      console.log(chalk.red('   ✗ Authentication failed: Invalid credentials'));
      console.log(chalk.yellow('   Please verify your username and password'));
    } else if (response.status === 404) {
      console.log(chalk.red('   ✗ Endpoint not found'));
      console.log(chalk.yellow('   Please verify the API endpoint URL'));
    } else {
      console.log(chalk.red(`   ✗ Unexpected status code: ${response.status}`));
      console.log(chalk.yellow('   Response:'), JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.log(chalk.red('\n✗ Connection test failed\n'));
    
    if (error.code === 'ECONNREFUSED') {
      console.log(chalk.yellow('Error: Connection refused'));
      console.log(chalk.gray('  - Check if the API endpoint is correct'));
      console.log(chalk.gray('  - Verify the server is running'));
      console.log(chalk.gray('  - Check your network connection'));
    } else if (error.code === 'ENOTFOUND') {
      console.log(chalk.yellow('Error: Host not found'));
      console.log(chalk.gray('  - Check the API endpoint URL'));
      console.log(chalk.gray('  - Verify DNS resolution'));
    } else if (error.code === 'ETIMEDOUT') {
      console.log(chalk.yellow('Error: Connection timeout'));
      console.log(chalk.gray('  - The server may be slow or unreachable'));
      console.log(chalk.gray('  - Check your network connection'));
    } else {
      console.log(chalk.yellow('Error:'), error.message);
    }
    
    console.log(chalk.gray('\nFull error:'), error);
    process.exit(1);
  }
}

testConnection().catch(error => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
});
