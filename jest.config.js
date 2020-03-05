
/**
 * Jest configuration
 */
module.exports = {
  verbose: true,
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: -20
    }
  }
};
