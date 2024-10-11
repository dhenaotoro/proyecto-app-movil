module.exports = {
  presets: [
    'module:metro-react-native-babel-preset', // El preset de React Native
    '@babel/preset-env',                      // Transforma el código según el entorno
    '@babel/preset-react',                    // Procesa JSX
    '@babel/preset-typescript'                // Procesa TypeScript
  ],
  plugins: [
    ["@babel/plugin-transform-private-methods", { "loose": true }],
    ["@babel/plugin-transform-class-properties", { "loose": true }],
    ["@babel/plugin-transform-private-property-in-object", { "loose": true }]
  ]
};