import fs from 'fs';
import path from 'path';
const folderName = 'test-ledger';
const folderPath = path.resolve(__dirname, '../../../../', folderName);

module.exports = async () => {
  console.log(globalThis.__TEARDOWN_MESSAGE__);

  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(`Failed to delete folder "${folderPath}":`, err);
    } else {
      console.log(`Folder "${folderPath}" deleted successfully.`);
    }
  });
  console.log('\nTreasury microservice stopped.\n');
  globalThis.__TREASURY_SERVICE__.kill();
  globalThis.__SOLANA_TEST_VALIDATOR__.kill();
  globalThis.__Wallet_SERVICE__.kill();
};
