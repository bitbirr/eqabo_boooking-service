export default {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(drizzle-orm)/)",
  ],
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setup/seed.js"],
};