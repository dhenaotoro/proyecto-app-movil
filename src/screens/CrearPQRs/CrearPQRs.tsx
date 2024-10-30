import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { registerPqr } from '../../services/Api';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { DropdownText } from '../../components/FormFields/DropdownText';
import { InputText } from '../../components/FormFields/InputText';
import { InputDate } from '../../components/FormFields/InputDate';

type CrearPQRsRouteProp = RouteProp<RootStackParamList, 'CrearPQRs' | 'ListarPQRs'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'ListarPQRs'>;

const CrearPQRs = (): React.JSX.Element => {
  const screen = 'CrearPQRs';
  const [tipoSolicitud, setTipoSolicitud] = useState('Petición');
  const [descripcion, setDescripcion] = useState('');
  const [fechaAdquisicion, setFechaAdquisicion] = useState<Date | undefined>(new Date());
  const [numeroTransaccion, setNumeroTransaccion] = useState('');
  const [impactoProblema, setImpactoProblema] = useState('Bajo');
  const [impactoSolucion, setImpactoSolucion] = useState('Compensación de dinero');
  const [aceptoDatos, setAceptoDatos] = useState(false);
  const tiposSolicitud: { [key: string]: string } = {
    'Petición': 'Petición',
    'Queja': 'Queja',
    'Reclamo': 'Reclamo'
  };
  const impactosProblema: { [key: string]: string } = {
    'Bajo': 'Bajo',
    'Moderado': 'Moderado',
    'Alto': 'Alto',
    'Crítico': 'Crítico',
  };
  const impactosSolucion: { [key: string]: string } = {
    'Compensación de dinero': 'Compensación de dinero',
    'Cambio de producto': 'Cambio de producto',
    'Aclaración del servicio': 'Aclaración del servicio',
    'Modificación de una cita': 'Modificación de una cita',
  };
  const route = useRoute<CrearPQRsRouteProp>();
  const { userUuid, userName } = route.params;
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
      navigation.navigate('ListarPQRs', { userUuid, userName, executeList: true });
    } catch (error) {
      console.debug('error', error);
      Alert.alert('Error', 'Hubo un problema al guardar el PQR');
    }
  };

  return (
    <View style={{...styles.creatPqrContainer}} testID={screen}>
      <ScrollView contentContainerStyle={styles.crearPqrScrollcontainer}>
        <View style={styles.crearPqrInnerContainer}>
            <Text style={styles.crearPqrSubtitle} testID={`${screen}.MainTitle`}>Gestiona tus PQRs rápidamente, regístrate ya!</Text>
            <DropdownText label='Tipo de solicitud' required value={tipoSolicitud} valuesToShow={tiposSolicitud} onChange={(selectedValue: string) => setTipoSolicitud(selectedValue)} testID={`${screen}.TipoSolicitud`}/>
            <InputText label='Descripción' required multiline maxLength={150} value={descripcion} onInputChange={(text: string) => setDescripcion(text)} testID={`${screen}.Descripcion`}/>
            <InputDate label='Fecha Adquisición' required value={fechaAdquisicion || new Date()} onInputChange={(date: Date | undefined) => setFechaAdquisicion(date)} testID={`${screen}.FechaAdquisicion`}/>
            <InputText label='Número de transacción' required maxLength={255} keyboardType='numeric' value={numeroTransaccion} onInputChange={(text: string) => setNumeroTransaccion(text)} testID={`${screen}.NumeroTransaccion`}/>
            <DropdownText label='Impacto del problema' required value={impactoProblema} valuesToShow={impactosProblema} onChange={(selectedValue: string) => setImpactoProblema(selectedValue)} testID={`${screen}.ImpactoProblema`}/>
            <DropdownText label='Impacto de solución' required value={impactoSolucion} valuesToShow={impactosSolucion} onChange={(selectedValue: string) => setImpactoSolucion(selectedValue)} testID={`${screen}.ImpactoSolucion`}/>
            <View style={styles.crearPqrCheckboxContainer}>
              <CheckBox value={aceptoDatos} style={styles.crearPqrCheckbox} onValueChange={setAceptoDatos} testID={`${screen}.Checkbox`}/>
              <Text style={styles.crearPqrCheckboxLabel}>Acepto el uso de datos personales.</Text>
            </View>
            <View style={{height: 92, paddingTop: 16}}>
              <TouchableOpacity style={styles.crearPqrButton} onPress={handleGuardar} testID={`${screen}.Button`}>
                <Text style={styles.crearPqrButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
        </View>
        <View style={{height: 182}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  creatPqrContainer: {
    flexGrow: 1,
  },
  crearPqrInnerContainer: {
    backgroundColor: colors.white,
    top: 0,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    height: 'auto',
    elevation: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 8,
  },
  crearPqrScrollcontainer: {
    paddingVertical: 0,
  },
  crearPqrSubtitle: {
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeMedium,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightMedium,
    color: colors.black,
  },
  crearPqrCheckboxContainer: {
    paddingTop: 18,
    width: 280,
    flexDirection: 'row',
    marginBottom: 20
  },
  crearPqrCheckbox: {
    alignSelf: 'center'
  },
  crearPqrCheckboxLabel: {
    marginTop: 5,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightXYSmall,
    color: colors.black,
  },
  crearPqrButton: {
    marginTop: 29,
    height: 36,
    backgroundColor: colors.white,
    borderColor: colors.brand_green,
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    alignItems: 'center',
    color: colors.black
  },
  crearPqrButtonText: {
    marginTop: -5,
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeLarge,
    letterSpacing: typography.letterSpacingMedium,
    color: colors.black,
  },
});

export default CrearPQRs;
