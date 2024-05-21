/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: "../..",
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.[jt]s"],
  preset: "ts-jest",
  verbose: true,
  modulePathIgnorePatterns: ["<rootDir>/out", "<rootDir>/.vscode-test"],
  moduleNameMapper: {
    "@codesandbox/pitcher-client": "@codesandbox/pitcher-client/dist/cjs",
    "@codesandbox/api": "<rootDir>/node_modules/@codesandbox/api/dist/cjs",
    "@codesandbox/create-gql-api":
      "<rootDir>/node_modules/@codesandbox/api/node_modules/@codesandbox/create-gql-api/dist/cjs",
    "^axios$": "axios/dist/node/axios.cjs",
  },
  setupFilesAfterEnv: ["<rootDir>/test/unit/setup.ts"],
  collectCoverage: true,
  maxWorkers: 2,
};
