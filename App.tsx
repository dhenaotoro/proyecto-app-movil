import React from 'react';
import { View } from 'react-native';
import ListarPQRs from './src/components/ListarPQRs/ListarPQRs';

function App(): React.JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <ListarPQRs />
    </View>
  );
}

export default App;
