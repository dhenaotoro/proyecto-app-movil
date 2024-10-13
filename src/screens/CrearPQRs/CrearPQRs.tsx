import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MainHeader from '../../components/Header/MainHeader';


const CrearPQRs = () => {
  const screen = 'CrearPQRs';

  return (
    <View testID={screen} style={styles.container}>
      <Text style={styles.text}>Componente Crear PQR</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  });

export default CrearPQRs;
