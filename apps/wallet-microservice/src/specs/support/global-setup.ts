/* eslint-disable */
import { exec } from 'child_process';
import { spawnShellCommand } from './helper';
require('dotenv').config();

module.exports = async function () {
  // Set the environment variable for tests
  process.env.NODE_ENV = 'development';

  // Start services that the app needs to run (e.g., database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  // return new Promise<boolean>((resolve, reject) => {
  //   // Hint: Use `globalThis` to pass variables to global teardown.
  //   globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';

  //   // Start the Docker container for DynamoDB
  //   exec('docker compose up -d', (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`Error starting Docker container: ${error.message}`);
  //       return reject(false);
  //     }
  //     if (stderr) {
  //       console.error(`Docker stderr: ${stderr}`);
  //     }
  //     console.log(`Docker stdout: ${stdout}`);
  //     globalThis.__DYNAMODB_CONTAINER_ID__ = stdout.trim();
  //   });

  //   setTimeout(() => {
  //     resolve(true);
  //   }, 5000);
  // });
};
