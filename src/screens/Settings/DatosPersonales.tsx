import { Alert, StyleSheet, Text, View } from "react-native";
import { InputText } from "../../components/FormFields/InputText";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import { updateUser } from "../../services/Api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type DatosPersonalesRouteProp = RouteProp<RootStackParamList, 'DatosPersonales'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'ListarPQRs'>;

const DatosPersonales = (): React.JSX.Element => {
    const screen = 'DatosPersonales';
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<DatosPersonalesRouteProp>();
    const { userUuid, email, userName, telefono, direccion } = route.params;
    const [cellphoneToModify, setCellphoneToModify] = useState<string | null>(null);
    const [addressToModify, setAddressToModify] = useState<string | null>(null);

    const handleGuardar = async () => {
      if (!cellphoneToModify || !addressToModify) {
        Alert.alert('Error', 'Por favor, completa todos los campos obligatorios marcados con *.');
        return;
      }
      const telefono = `+57${cellphoneToModify}` 
    
      try {
        const response = await updateUser(userUuid, { telefono, direccion: addressToModify });
        navigation.navigate('ListarPQRs', { userUuid, userName, executeList: false });
        Alert.alert('Guardado', response.message);
      } catch (error) {
        console.debug('error', error);
        Alert.alert('Error', 'Hubo un problema al guardar el telefono o la direccion del usuario.');
      }
    };

    return (
        <View style={styles.datosPersonalesContainer} testID={screen}>
            <Text style={styles.title}>Datos personales</Text>
            <View style={styles.formContent}>
              <InputText label='Correo' editable={false} required maxLength={255} value={email} onInputChange={() => {}} testID={`${screen}.Correo`}/>
              <InputText label='Telefono' required maxLength={10} keyboardType='numeric' value={cellphoneToModify ?? telefono.replace('+57', '')} onInputChange={(text: string) => setCellphoneToModify(text)} testID={`${screen}.Telefono`}/>
              <InputText label='Direccion' required maxLength={255} value={addressToModify ?? direccion } onInputChange={(text: string) => setAddressToModify(text)} testID={`${screen}.Direccion`}/>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.datosPersonalesButton} onPress={handleGuardar} testID={`${screen}.Button`}>
                <Text style={styles.datosPersonalesButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    datosPersonalesContainer: {
      flexGrow: 1,
      backgroundColor: colors.white,
      paddingHorizontal: 15,
      alignItems: 'center',
    },
    formContent: {
      top: 24,
      width: '100%'
    },
    title: {
      top: 24,
      letterSpacing: typography.letterSpacingMedium,
      lineHeight: typography.lineHeightXYZSmall,
      fontFamily: typography.nunitoSanzBold,
      fontSize: typography.fontSizeXYZSmall,
      color: colors.black,
    },
    buttonContainer: {
      height: 92,
      paddingTop: 16,
      width: '60%',
      top: 24
    },
    datosPersonalesButton: {
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
    datosPersonalesButtonText: {
      marginTop: -5,
      fontFamily: typography.nunitoSanzBold,
      fontSize: typography.fontSizeLarge,
      letterSpacing: typography.letterSpacingMedium,
      color: colors.black,
    },
});

export default DatosPersonales;