import { exec, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);
const rmAsync = promisify(fs.rm);

const folderName = 'test-ledger';
const folderPath = path.resolve(__dirname, '../../../../', folderName);

module.exports = async () => {
  console.log(globalThis.__TEARDOWN_MESSAGE__);
  const stopAndRemoveDockerContainer = async () => {
    try {
      execSync('docker compose down');
    } catch (error) {
      console.error(
        `Error stopping/removing Docker container: ${error.message}`
      );
      throw new Error('Failed to stop/remove Docker container');
    }
  };

  const deleteFolder = async () => {
    try {
      execSync(`rm -rf ${folderPath}`);
      console.log(`Folder "${folderPath}" deleted successfully.`);
    } catch (err) {
      console.error(`Failed to delete folder "${folderPath}":`, err);
      throw new Error('Failed to delete folder');
    }
  };

  const killService = (service) => {
    if (service) {
      service.kill();
    }
  };

  try {
    await Promise.all([stopAndRemoveDockerContainer(), deleteFolder()]);

    console.log('\nTreasury microservice stopped.\n');

    killService(globalThis.__TREASURY_SERVICE__);
    killService(globalThis.__WALLET_SERVICE__);
    killService(globalThis.__SOLANA_TEST_VALIDATOR__);

    return true;
  } catch (error) {
    console.error('Error during teardown:', error);
    return false;
  }
};
