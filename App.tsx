/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';


function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      {/* Proveedor del contexto de autenticación */}
      <AuthProvider>
        {/* Navegación dinámica dependiendo del estado de autenticación */}
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
