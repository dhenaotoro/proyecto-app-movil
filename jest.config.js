
module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': 'babel-jest',  // Usa babel-jest para archivos .js, .jsx, .mjs, .ts y .tsx
  },
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'json', 'node'],
  moduleNameMapper: {
    'aws-amplify': '<rootDir>/__mocks__/aws-amplify/aws-amplify-mocked.js'
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
  transformIgnorePatterns: [
    'node_modules\/(?!(jest-)?(react-native|@react-native|@react-navigation|uuid|axios)\/)',
  ]
};