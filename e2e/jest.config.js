/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest', 
  rootDir: '..',
  testRegex: "\\.e2e\\.ts$",
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
