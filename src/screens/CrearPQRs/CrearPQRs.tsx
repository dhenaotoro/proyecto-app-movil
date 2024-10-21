import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import { registerPqr } from '../../services/Api';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CrearPQRssRouteProp = RouteProp<RootStackParamList, 'CrearPQRs'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'ListarPQRs'>;

const CrearPQRs = () => {
  const screen = 'CrearPQRs';
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaAdquisicion, setFechaAdquisicion] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [numeroTransaccion, setNumeroTransaccion] = useState('');
  const [impactoProblema, setImpactoProblema] = useState('');
  const [impactoSolucion, setImpactoSolucion] = useState('');
  const [aceptoDatos, setAceptoDatos] = useState(false);
  const route = useRoute<CrearPQRssRouteProp>();
  const { userUuid, name } = route.params;
  const navigation = useNavigation<NavigationProps>();

  const handleGuardar = async () => {
    if (!tipoSolicitud || !descripcion || !numeroTransaccion || !impactoProblema || !aceptoDatos) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios marcados con *');
      return;
    }
  
    const pqrData = {
      uuidUsuario: userUuid,
      tipoSolicitud,
      descripcion,
      numeroTransaccion,
      impactoProblema,
      impactoSolucion,
      canal: 'App móvil',
    };
  
    try {
      const response = await registerPqr(pqrData);
      Alert.alert('Guardado', response.message);
      navigation.navigate('ListarPQRs', { userUuid, name });
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar el PQR');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} testID={screen}>
      <Text style={styles.title}>ABCall</Text>
      <Text style={styles.subtitle} testID={`${screen}.MainTitle`}>Gestiona tus PQRs rápidamente, regístrate ya!</Text>

      <Text style={styles.label}>Tipo de solicitud *</Text>
      <Picker testID="request-type-dropdown"
        selectedValue={tipoSolicitud}
        onValueChange={(value) => setTipoSolicitud(value)}
        style={styles.picker}>
        <Picker.Item label="Seleccione..." value="" />
        <Picker.Item label="Petición" value="Petición" />
        <Picker.Item label="Queja" value="Queja" />
        <Picker.Item label="Reclamo" value="Reclamo" />
      </Picker>

      <Text style={styles.label}>Descripción *</Text>
      <TextInput testID="description-textarea"
        style={styles.textArea}
        multiline
        maxLength={150}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Text style={styles.label}>Fecha de adquisición *</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton} testID="date-picker-button">
        <Text style={styles.dateText}>{fechaAdquisicion.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="date-picker"
          value={fechaAdquisicion}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setFechaAdquisicion(date);
          }}
        />
      )}

      <Text style={styles.label}>Número de transacción *</Text>
      <TextInput testID="transaction-input"
        style={styles.input}
        keyboardType="numeric"
        value={numeroTransaccion}
        onChangeText={setNumeroTransaccion}
      />

      <Text style={styles.label}>Impacto del problema</Text>
      <Picker testID="problem-impact-dropdown"
        selectedValue={impactoProblema}
        onValueChange={(value) => setImpactoProblema(value)}
        style={styles.picker}>
        <Picker.Item label="Seleccione..." value="" />
        <Picker.Item label="Bajo" value="Bajo" />
        <Picker.Item label="Moderado" value="Moderado" />
        <Picker.Item label="Alto" value="Alto" />
        <Picker.Item label="Crítico" value="Crítico" />
      </Picker>

      <Text style={styles.label}>Impacto de solución</Text>
      <Picker testID="solution-impact-dropdown"
        selectedValue={impactoSolucion}
        onValueChange={(value) => setImpactoSolucion(value)}
        style={styles.picker}>
        <Picker.Item label="Seleccione..." value="" />
        <Picker.Item label="Compensación de dinero" value="Compensación de dinero" />
        <Picker.Item label="Cambio de producto" value="Cambio de producto" />
        <Picker.Item label="Aclaración del servicio" value="Aclaración del servicio" />
        <Picker.Item label="Modificación de una cita" value="Modificación de una cita" />
      </Picker>

      <View style={styles.checkboxContainer}>
        <CheckBox value={aceptoDatos} onValueChange={setAceptoDatos} />
        <Text style={styles.checkboxLabel}>Acepto el uso de datos personales</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    color: '#CC430A',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginVertical: 5,
  },
  picker: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: 'white',
    height: 100,
    textAlignVertical: 'top',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: 'white',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    color: 'black',
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: 'black',
  },
  button: {
    borderWidth: 2,
    borderColor: '#4DCC0A',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default CrearPQRs;
