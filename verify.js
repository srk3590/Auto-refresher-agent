#!/usr/bin/env node

/**
 * Verification Script
 * Checks if the token refresher agent is properly set up
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function verify() {
  console.log(chalk.bold.cyan('\n🔍 Token Refresher Agent - Verification\n'));
  
  let allGood = true;
  
  // Check required files
  console.log(chalk.bold('1. Checking Required Files\n'));
  
  const requiredFiles = [
    'index.js',
    'setup.js',
    'test-connection.js',
    'view-token.js',
    'package.json',
    '.gitignore',
  ];
  
  for (const file of requiredFiles) {
    const exists = await fileExists(path.join(__dirname, file));
    if (exists) {
      console.log(chalk.green('   ✓'), file);
    } else {
      console.log(chalk.red('   ✗'), file, chalk.red('MISSING'));
      allGood = false;
    }
  }
  
  // Check documentation
  console.log(chalk.bold('\n2. Checking Documentation\n'));
  
  const readmeExists = await fileExists(path.join(__dirname, 'README.md'));
  if (readmeExists) {
    console.log(chalk.green('   ✓ README.md (complete documentation)'));
  } else {
    console.log(chalk.red('   ✗ README.md MISSING'));
    console.log(chalk.gray('     Documentation file is required'));
    allGood = false;
  }
  
  // Check dependencies
  console.log(chalk.bold('\n3. Checking Dependencies\n'));
  
  const nodeModulesExists = await fileExists(path.join(__dirname, 'node_modules'));
  if (nodeModulesExists) {
    console.log(chalk.green('   ✓ node_modules installed'));
  } else {
    console.log(chalk.yellow('   ⚠ node_modules not found'));
    console.log(chalk.gray('     Run: npm install'));
    allGood = false;
  }
  
  // Check configuration
  console.log(chalk.bold('\n4. Checking Configuration\n'));
  
  const envExists = await fileExists(path.join(__dirname, '.env'));
  if (envExists) {
    console.log(chalk.green('   ✓ .env file exists'));
    
    // Read and validate .env
    try {
      const envContent = await fs.readFile(path.join(__dirname, '.env'), 'utf-8');
      const hasUsername = envContent.includes('AUTH_USERNAME=') && !envContent.includes('AUTH_USERNAME=your_username');
      const hasPassword = envContent.includes('AUTH_PASSWORD=') && !envContent.includes('AUTH_PASSWORD=your_password');
      const hasEndpoint = envContent.includes('AUTH_API_ENDPOINT=') && !envContent.includes('AUTH_API_ENDPOINT=https://');
      
      if (hasUsername) {
        console.log(chalk.green('   ✓ Username configured'));
      } else {
        console.log(chalk.yellow('   ⚠ Username not configured'));
      }
      
      if (hasPassword) {
        console.log(chalk.green('   ✓ Password configured'));
      } else {
        console.log(chalk.yellow('   ⚠ Password not configured'));
      }
      
      if (hasEndpoint) {
        console.log(chalk.green('   ✓ API endpoint configured'));
      } else {
        console.log(chalk.yellow('   ⚠ API endpoint not configured'));
      }
      
      if (!hasUsername || !hasPassword || !hasEndpoint) {
        console.log(chalk.gray('     Run: npm run setup'));
        allGood = false;
      }
    } catch (error) {
      console.log(chalk.red('   ✗ Error reading .env file'));
      allGood = false;
    }
  } else {
    console.log(chalk.yellow('   ⚠ .env file not found'));
    console.log(chalk.gray('     Run: npm run setup'));
    allGood = false;
  }
  
  // Check token service path
  console.log(chalk.bold('\n5. Checking Token Service Path\n'));
  
  const tokenServicePath = path.join(__dirname, '../../libs/core/src/lib/services/token.service.ts');
  const tokenServiceExists = await fileExists(tokenServicePath);
  
  if (tokenServiceExists) {
    console.log(chalk.green('   ✓ token.service.ts found'));
  } else {
    console.log(chalk.red('   ✗ token.service.ts not found'));
    console.log(chalk.gray('     Expected at: ' + tokenServicePath));
    console.log(chalk.yellow('     ⚠ Agent may not update the correct file'));
  }
  
  // Check file permissions
  console.log(chalk.bold('\n6. Checking File Permissions\n'));
  
  const jsFiles = ['index.js', 'setup.js', 'test-connection.js', 'view-token.js'];
  let allExecutable = true;
  
  for (const file of jsFiles) {
    try {
      const stats = await fs.stat(path.join(__dirname, file));
      const isExecutable = !!(stats.mode & 0o111);
      if (isExecutable) {
        console.log(chalk.green('   ✓'), file, 'is executable');
      } else {
        console.log(chalk.yellow('   ⚠'), file, 'is not executable');
        allExecutable = false;
      }
    } catch (error) {
      // File doesn't exist, already reported above
    }
  }
  
  if (!allExecutable) {
    console.log(chalk.gray('     Run: chmod +x *.js'));
  }
  
  // Final summary
  console.log(chalk.bold.cyan('\n📊 Verification Summary\n'));
  
  if (allGood && nodeModulesExists && envExists) {
    console.log(chalk.bold.green('✓ All checks passed! You\'re ready to go.\n'));
    console.log(chalk.cyan('Next Steps:'));
    console.log(chalk.gray('  1. Test connection:'), chalk.cyan('npm run test'));
    console.log(chalk.gray('  2. Manual refresh:'), chalk.cyan('npm run refresh'));
    console.log(chalk.gray('  3. Start auto-refresh:'), chalk.cyan('npm run auto\n'));
  } else {
    console.log(chalk.yellow('⚠ Some issues found. Follow the suggestions above.\n'));
    console.log(chalk.cyan('Quick Fix:'));
    if (!nodeModulesExists) {
      console.log(chalk.gray('  1. Install dependencies:'), chalk.cyan('npm install'));
    }
    if (!envExists) {
      console.log(chalk.gray('  2. Configure credentials:'), chalk.cyan('npm run setup'));
    }
    console.log(chalk.gray('  3. Re-run verification:'), chalk.cyan('node verify.js\n'));
  }
}

verify().catch(error => {
  console.error(chalk.red('Verification failed:'), error);
  process.exit(1);
});
