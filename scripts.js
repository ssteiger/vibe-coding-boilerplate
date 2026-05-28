const fs = require('node:fs');
const path = require('node:path');

function checkAndCreateEnvFile() {
  const envPath = path.join(process.cwd(), 'apps/web/.env.local');
  const exampleEnvPath = path.join(process.cwd(), 'apps/web/.env.example');
  
  if (!fs.existsSync(envPath)) {
    // Check if .env.example exists
    if (fs.existsSync(exampleEnvPath)) {
      fs.copyFileSync(exampleEnvPath, envPath);
      console.log('.env.local created from .env.example');
    } else {
      console.log('.env.example not found. Cannot create .env.local');
      process.exit(1);
    }
  } else {
    console.log('.env.local already exists');
  }
}

// Run the appropriate function based on the command line argument
const command = process.argv[2];

switch (command) {
  case 'env:check':
    checkAndCreateEnvFile();
    break;
  default:
    console.log('Unknown command. Available commands: env:check');
    process.exit(1);
} 