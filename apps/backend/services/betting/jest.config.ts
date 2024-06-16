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
    "^@solpin/types$": "<rootDir>/../../../../@solpin/types/src/index.ts",
    "^@solpin/events$": "<rootDir>/../../../../@solpin/events/src/index.ts",
  },
};
