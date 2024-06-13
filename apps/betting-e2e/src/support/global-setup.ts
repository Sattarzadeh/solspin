import { ChildProcess } from "child_process";
import { spawnShellCommand } from "./helper";
import { setTimeout } from "timers/promises";
import axios from "axios";

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

function waitForLogMessage(process: ChildProcess, message: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const stdoutListener = (data: Buffer) => {
      if (data.toString().includes(message)) {
        process.stdout?.off("data", stdoutListener);
        resolve();
      }
    };

    const stderrListener = (data: Buffer) => {
      if (data.toString().includes(message)) {
        process.stderr?.off("data", stderrListener);
        resolve();
      }
    };

    process.stdout?.on("data", stdoutListener);
    process.stderr?.on("data", stderrListener);

    process.on("error", (err) => {
      process.stdout?.off("data", stdoutListener);
      process.stderr?.off("data", stderrListener);
      reject(err);
    });

    process.on("exit", (code) => {
      process.stdout?.off("data", stdoutListener);
      process.stderr?.off("data", stderrListener);
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

async function waitForDynamoDB() {
  const maxRetries = 10;
  const delay = 3000; // 3 seconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Attempt to connect to the DynamoDB Local endpoint
      await axios.get("http://localhost:8000");
      return true; // If successful, return true
    } catch (error) {
      console.log("Waiting for DynamoDB to be ready...");
      await setTimeout(delay);
    }
  }
  throw new Error("DynamoDB did not become ready in time");
}

module.exports = async function () {
  // Hint: Use `globalThis` to pass variables to global teardown.
  process.env.NODE_ENV = "development";
  globalThis.__TEARDOWN_MESSAGE__ = "\nTearing down...\n";

  return new Promise<boolean>(async (resolve, reject) => {
    try {
      // Start the Docker container for DynamoDB
      const dockerProcess = spawnShellCommand("docker compose up", {});
      // await waitForLogMessage(dockerProcess, 'Started');
      await setTimeout(3000);

      // Ensure DynamoDB is ready to accept connections
      // await waitForDynamoDB();

      // Start the wallet microservice
      const bettingService = spawnShellCommand("npx nx run betting-microservice:serve", {});

      const walletService = spawnShellCommand("npx nx run wallet:serve", {});

      globalThis.__BETTING_SERVICE = bettingService;
      globalThis.__WALLET_SERVICE = walletService;

      // Wait for the microservices to log that they are running
      await waitForLogMessage(bettingService, "Server is running on port");
      await waitForLogMessage(walletService, "Server is running on port");

      resolve(true);
    } catch (error) {
      console.error("Error in setup:", error);
      reject(false);
    }
  });
};
