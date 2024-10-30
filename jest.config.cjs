// jest.config.cjs
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.mjs"],
  transform: {
    "^.+\\.mjs$": "babel-jest",
  },
  moduleFileExtensions: ["js", "mjs"],
};