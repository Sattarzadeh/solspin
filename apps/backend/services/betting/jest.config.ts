/* eslint-disable */
export default {
  displayName: "betting",
  preset: "../../../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/apps/backend/services/betting",
  passWithNoTests: true,
};
