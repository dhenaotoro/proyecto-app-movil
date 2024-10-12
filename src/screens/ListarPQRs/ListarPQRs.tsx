import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MainHeader from '../../components/Header/MainHeader';


const ListarPQRs = () => {
  const screen = 'ListarPQRs';

  return (
    <View style={styles.container} testID={screen}>
      <MainHeader></MainHeader>
      <Text style={styles.welcomeText}>Bienvenido</Text>
      <Text style={styles.username}>IVAN</Text>
      <Text style={styles.pqrText} testID={`${screen}.MainTitle`}>PQRs</Text>

      {/* Tabla */}
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.cell}>
          <TouchableOpacity style={styles.openButton} onPress={() => {}}>
           <View style={styles.rowContainer}>
             <Text style={styles.openBulletPoint}>•</Text>
             <Text style={styles.openButtonText}>Abierto</Text>
           </View>
           <Text style={styles.openCode}>000000001</Text>
        </TouchableOpacity>
          </View>
          <View style={styles.cell}>
            <Text style={styles.appText}>App móvil</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
          <TouchableOpacity style={styles.openButton} onPress={() => {}}>
           <View style={styles.rowContainer}>
             <Text style={styles.closedBulletPoint}>•</Text>
             <Text style={styles.closedButtonText}>Cerrado</Text>
           </View>
           <Text style={styles.openCode}>000000002</Text>
        </TouchableOpacity>
          </View>
          <View style={styles.cell}>
            <Text style={styles.appText}>Chatbot</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
          <TouchableOpacity style={styles.openButton} onPress={() => {}}>
           <View style={styles.rowContainer}>
             <Text style={styles.closedBulletPoint}>•</Text>
             <Text style={styles.closedButtonText}>Cerrado</Text>
           </View>
           <Text style={styles.openCode}>000000003</Text>
        </TouchableOpacity>
          </View>
          <View style={styles.cell}>
            <Text style={styles.appText}>Llamada</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={() => {}}>
          <Text style={styles.registerButtonText}>Registra tu PQR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#CC430A',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeText: {
    color: 'black',
    fontSize: 18,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
    paddingVertical: 20,
  },
  pqrText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  openButton: {
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  openButtonText: {
    color: '#CC430A',
    fontWeight: 'bold',
  },
  openBulletPoint: {
    color: '#CC430A',
    fontSize: 24,
    marginRight: 5,
  },
  closedBulletPoint: {
    color: '#4DCC0A',
    fontSize: 24,
    marginRight: 5,
  },
  closedButton: {
    backgroundColor: '#4DCC0A',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closedButtonText: {
    color: '#4DCC0A',
    fontWeight: 'bold',
  },
  openCode: {
    color: 'black',
    marginTop: 5,
  },
  appText: {
    fontWeight: 'bold',
    color: 'black',
  },
  buttonContainer: {
    marginTop: 40,
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#4DCC0A',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ListarPQRs;
