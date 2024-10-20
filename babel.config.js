module.exports = function(api){
  api.cache(false);
  return {
    presets: [
      'module:metro-react-native-babel-preset', // El preset de React Native
      '@babel/preset-react',                    // Procesa JSX
      '@babel/preset-typescript'                // Procesa TypeScript
    ],
    plugins: [
      'react-native-reanimated/plugin',
      //'@babel/plugin-transform-modules-commonjs',
      //'@babel/plugin-transform-named-capturing-groups-regex',
      //['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-transform-private-methods', { "loose": true }],
      //['@babel/plugin-transform-class-properties', { "loose": true }],
      //['@babel/plugin-transform-private-property-in-object', { "loose": true }],
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',  // especifica el archivo que debe cargar según tu entorno
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true
      }]
    ]
  }
};