export default {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setup/seed.ts"],
};