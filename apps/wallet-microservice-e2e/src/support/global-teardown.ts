module.exports = async () => {
  console.log(globalThis.__TEARDOWN_MESSAGE__);

  if (globalThis.__TREASURY_SERVICE__) {
    globalThis.__TREASURY_SERVICE__.kill();
    globalThis.__SOLANA_TEST_VALIDATOR__.kill();
    globalThis.__Wallet_SERVICE__.kill();
    console.log('\nTreasury microservice stopped.\n');
  }
};
