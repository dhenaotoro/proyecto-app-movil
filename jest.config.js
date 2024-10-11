
module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Usa babel-jest para archivos .js, .jsx, .ts, y .tsx
  },
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
  transformIgnorePatterns: [
    'node_modules\/(?!(jest-)?(react-native|@react-native|@react-navigation|uuid)\/)',
  ]
};