/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = ({ swcOptions = {} } = {}) => ({
  testMatch: ["<rootDir>/src/**/*.test.ts*"],
  roots: ["<rootDir>"],
  testEnvironment: "node",
  passWithNoTests: true,
  modulePathIgnorePatterns: ["<rootDir>/node_modules"],
  transform: {
    "\\.tsx?$": ["@swc/jest", swcOptions],
  },
});