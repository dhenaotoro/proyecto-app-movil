import { StyleSheet, Text, View } from "react-native";
import { InputText } from "../../components/FormFields/InputText";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

type DatosPersonalesRouteProp = RouteProp<RootStackParamList, 'DatosPersonales'>;

const DatosPersonales = (): React.JSX.Element => {
    const screen = 'DatosPersonales';
    const route = useRoute<DatosPersonalesRouteProp>();
    const { userUuid, email, telefono, direccion } = route.params;
    const [cellphoneToModify, setCellphoneToModify] = useState('');
    const [addressToModify, setAddressToModify] = useState('');

    const handleGuardar = () => {};

    return (
        <View style={{...styles.datosPersonalesContainer}} testID={screen}>
            <InputText label='Correo' required maxLength={255} keyboardType='numeric' value={email} onInputChange={() => {}} testID={`${screen}.Correo`}/>
            <InputText label='Telefono' required maxLength={10} keyboardType='numeric' value={cellphoneToModify !== '' ? cellphoneToModify : telefono} onInputChange={(text: string) => setCellphoneToModify(text)} testID={`${screen}.Telefono`}/>
            <InputText label='Direccion' required maxLength={255} keyboardType='numeric' value={addressToModify !== '' ? addressToModify : direccion } onInputChange={(text: string) => setAddressToModify(text)} testID={`${screen}.Direccion`}/>
            <View style={{height: 92, paddingTop: 16}}>
              <TouchableOpacity onPress={handleGuardar} testID={`${screen}.Button`}>
                <Text>Guardar</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    datosPersonalesContainer: {
      flexGrow: 1,
    },
});

export default DatosPersonales;