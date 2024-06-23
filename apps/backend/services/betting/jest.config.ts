/* eslint-disable */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  displayName: "betting",
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/__tests__/**/*.tests.ts"],
  coverageDirectory: "../../coverage/apps/backend/services/betting",
  passWithNoTests: true,
  moduleNameMapper: {
    "^@solspin/types$": "<rootDir>/../../../../@solspin/types/src/index.ts",
    "^@solspin/events$": "<rootDir>/../../../../@solspin/events/src/index.ts",
  },
};
