/* eslint-disable */

import { exec } from 'child_process';

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  console.log(globalThis.__TEARDOWN_MESSAGE__);
  return new Promise<boolean>((resolve, reject) => {
    // Stop and remove the Docker container
    exec(`docker compose down`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error stopping Docker container: ${error.message}`);
        return reject(false);
      }
      if (stderr) {
        console.error(`Docker stderr: ${stderr}`);
      }
      console.log(`Docker stdout: ${stdout}`);
      resolve(true);
    });
    if (globalThis.__WALLET_SERVICE__) {
      globalThis.__WALLET_SERVICE__.kill();
    }

    if (globalThis.__BETTING_SERVICE__) {
      globalThis.__BETTING_SERVICE__.kill();
    }
  });
};
