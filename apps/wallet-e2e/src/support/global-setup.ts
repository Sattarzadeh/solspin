/* eslint-disable */
import { exec } from "child_process";
import { spawnShellCommand } from "./helper";

require("dotenv").config();

module.exports = async function () {
  // Set the environment variable for tests
  process.env.NODE_ENV = "development";

  // Start services that the app needs to run (e.g., database, docker-compose, etc.).
  console.log("\nSetting up...\n");

  return new Promise<boolean>((resolve, reject) => {
    const treasuryService = spawnShellCommand("npx nx run treasury-microservice:serve", {});
    const walletService = spawnShellCommand("npx nx run wallet:serve", {});
    const solanaValidator = spawnShellCommand("solana-test-validator", {});

    // Hint: Use `globalThis` to pass variables to global teardown.
    globalThis.__TEARDOWN_MESSAGE__ = "\nTearing down...\n";
    globalThis.__TREASURY_SERVICE = treasuryService;
    globalThis.__WALLET_SERVICE = walletService;

    // Start the Docker container for DynamoDB
    exec("docker compose up -d", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting Docker container: ${error.message}`);
        return reject(false);
      }
      if (stderr) {
        console.error(`Docker stderr: ${stderr}`);
      }
      console.log(`Docker stdout: ${stdout}`);
      globalThis.__DYNAMODB_CONTAINER_ID__ = stdout.trim();
    });

    let solanaReady = false;

    // solanaValidator.stdout.on('data', (data: Buffer) => {
    //   console.log(`Solana Validator: ${data.toString().trim()}`);
    //   const output = data.toString().trim();
    //   if (output.includes('RPC URL')) {
    //     console.log('Solana Validator is ready');
    //     solanaReady = true;
    //     checkAllServicesReady();
    //   }
    // });

    // solanaValidator.stderr.on('data', (data: Buffer) => {
    //   console.error(`Solana Validator error: ${data.toString().trim()}`);
    //   reject(new Error('Failed to start Solana test validator'));
    // });
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
};
