/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  setupFiles: ["testing/.jest/setEnvVars.js"],
  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",


  verbose: true,
  testTimeout:8000

};
