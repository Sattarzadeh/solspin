/* eslint-disable */
export default {
  displayName: 'wallet-microservice',
  preset: '../../jest.preset.js',
  globalSetup: '<rootDir>/src/specs/support/global-setup.ts',
  globalTeardown: '<rootDir>/src/specs/support/global-teardown.ts',
  setupFiles: ['<rootDir>/src/specs/support/test-setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/wallet-microservice',
};
