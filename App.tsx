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
  </SafeAreaProvider>);
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
