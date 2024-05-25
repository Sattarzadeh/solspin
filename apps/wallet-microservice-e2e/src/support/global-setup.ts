/* eslint-disable */
import { spawnShellCommand } from './helper';
require('dotenv').config();

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');
  const command = 'npx nx run treasury-microservice:serve ';

  // return new Promise<boolean>((resolve, reject) => {
  //   const treasuryService = spawnShellCommand(command, {});
  //   const walletService = spawnShellCommand(
  //     'npx nx run wallet-microservice:serve',
  //     {}
  //   );
  //   const solanaValidator = spawnShellCommand('solana-test-validator', {});

  //   // Hint: Use `globalThis` to pass variables to global teardown.
  //   globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
  //   globalThis.__TREASURY_SERVICE = treasuryService;
  //   globalThis.__WALLET_SERVICE = walletService;

  //   solanaValidator.stdout.on('data', (data: Buffer) => {
  //     const output = data.toString().trim();
  //     if (output.includes('RPC URL')) {
  //       console.log('Solana Validator is ready');
  //       resolve(true);
  //     }
  //   });

  //   solanaValidator.stderr.on('data', (data: Buffer) => {
  //     console.error(`Solana Validator error: ${data.toString().trim()}`);
  //     reject(new Error('Failed to start Solana test validator'));
  //   });
  // });
};
