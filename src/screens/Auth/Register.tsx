import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import { DropdownText } from "../../components/FormFields/DropdownText";
import React, { useContext, useState } from "react";
import { InputText } from "../../components/FormFields/InputText";
import CheckBox from "@react-native-community/checkbox";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../../services/Api";
import { AuthContext } from "../../context/AuthContext";

export function Register(): React.JSX.Element  {
    const screen = 'Register';
    const tiposDocumentos: { [key: string]: string } = {
        'Cedula Ciudadania': 'Cedula de ciudadanía',
        'Carnet Diplomatico': 'Carnet diplomático',
        'Tarjeta Identidad': 'Tarjeta de identidad',
        'Cedula Extranjeria': 'Cédula de extranjería'
    };
    const [tipoDocumento, setTipoDocumento] = useState('Cedula Ciudadania');
    const [documento, setDocumento] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [aceptadaPoliticaYAvisoPrivacidad, setAceptadaPoliticaYAvisoPrivacidad] = useState(false);
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { signUp } = useContext(AuthContext);

    const getStatusPassword = () => {
        const minLength = 8;
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);

        if (password !== repeatedPassword) return { status: false, message: "Las contraseñas deben ser iguales." }; 
        if (password.length < minLength) return { status: false, message: "Debe tener al menos 8 caracteres." };
        if (!hasNumber) return { status: false, message: "Debe contener al menos un número." };
        if (!hasSpecialChar) return { status: false, message: "Debe contener al menos un carácter especial." };
        if (!hasUpperCase) return { status: false, message: "Debe contener al menos una letra mayúscula." };
        if (!hasLowerCase) return { status: false, message: "Debe contener al menos una letra minúscula." };
        return { status: true, message: "" };
    }

    const handlePress = async () => {
        const passwordStatus = getStatusPassword();
        if(passwordStatus.status) {
            setLoading(true); // Mostrar el estado de carga
            const userId = await signUp({ correo, password, nombres, apellidos, telefono });
            try {
                const userData = {
                    uuid: userId,
                    nombre: nombres,
                    apellido: apellidos,
                    email: correo,
                    telefono: "+57" + telefono,
                    front: 'cliente',
                    direccion,
                    numero_documento: documento,
                    tipo_documento: tipoDocumento,
                    aceptada_politica_aviso_privacidad: aceptadaPoliticaYAvisoPrivacidad
                };
                const response = await registerUser(userData);
                if (response.code === 201 && response.message === "Usuario creado correctamente") {
                    // Aquí puedes redirigir al usuario a la pantalla principal
                    navigation.navigate('ActivationCode', { email: correo || '' }); 
                }
            } catch (error) {
                console.debug('Error al registrar el usuario:', error);
                Alert.alert('Error', 'Registro no exitoso.');
            } finally {
                setLoading(false); // Detener el estado de carga
            }
        } else {
            console.debug(passwordStatus.message);
            Alert.alert('Error', passwordStatus.message);
        }
    };

    return ( 
        <View style={{...styles.registerContainer}} testID={screen}>
            <ScrollView showsVerticalScrollIndicator={true} style={styles.scrollContainer}>
                <View style={{...styles.registerInnerContainer}}>
                    <View style={{height: 64}}>
                        <Text style={styles.registerMessageTitle}>Gestiona tus PQRs rápidamente, registrate ya!</Text>
                    </View>
                    <View style={{height: 821}}>
                        <DropdownText label='Tipo documento' required value={tipoDocumento} valuesToShow={tiposDocumentos} onChange={(selectedValue: string) => setTipoDocumento(selectedValue)} testID={`${screen}.TipoDocumento`}/>
                        <InputText label='Nombres' required maxLength={255} value={nombres} onInputChange={(text: string) => setNombres(text)} testID={`${screen}.Nombres`}/>
                        <InputText label='Apellidos' required maxLength={255} value={apellidos} onInputChange={(text: string) => setApellidos(text)} testID={`${screen}.Apellidos`}/>
                        <InputText label='Teléfono' required keyboardType='numeric' maxLength={10} value={telefono} onInputChange={(text: string) => setTelefono(text)} testID={`${screen}.Telefono`}/>
                        <InputText label='Dirección' required maxLength={255} value={direccion} onInputChange={(text: string) => setDireccion(text)} testID={`${screen}.Direccion`}/>
                        <InputText label='Correo' required keyboardType="email-address" maxLength={255} value={correo} onInputChange={(text: string) => setCorreo(text)} testID={`${screen}.Correo`}/>
                        <InputText label='Contraseña' secureTextEntry required value={password} maxLength={255} onInputChange={(text: string) => setPassword(text)} testID={`${screen}.Password`}/>
                        <InputText label='Repite tu contraseña' secureTextEntry required maxLength={255} value={repeatedPassword} onInputChange={(text: string) => setRepeatedPassword(text)} testID={`${screen}.PasswordRepeated`}/>
                        <View style={styles.avisoPrivacidadContainer}>
                            <CheckBox testID={`${screen}.PoliticaPrivacidad`} style={styles.registroCheckbox} value={aceptadaPoliticaYAvisoPrivacidad} onValueChange={setAceptadaPoliticaYAvisoPrivacidad}/>
                            <Text style={styles.avisoPrivacidadTexto}>
                                Acepto la <Text style={styles.avisoPrivacidadTextoNegrita} testID={`${screen}.PoliticsLink`} onPress={() => navigation.navigate('Politics')}>política de privacidad </Text>y
                                <Text style={styles.avisoPrivacidadTextoNegrita} testID={`${screen}.PrivacyLink`} onPress={() => navigation.navigate('Politics')}>aviso de privacidad de datos</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={{height: 92, paddingTop: 16}}>
                        <TouchableOpacity style={styles.registryButton} onPress={handlePress} aria-label='registerButton' testID={`${screen}.Button`}>
                            <Text style={styles.registryButtonText}>{loading ? 'Cargando...' : 'Confirmar'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height: 182, alignItems: 'center'}}>
                    <Text style={{...styles.registryLink}} onPress={() => navigation.navigate('Login')}>Cancelar</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    registerContainer: {
        paddingTop: 0,
        paddingHorizontal: 15,
        height: 'auto',
        flexGrow: 1
    },
    scrollContainer: {
        paddingVertical: 0,
    },
    registerInnerContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: 15,
        height: 'auto',
        elevation: 1,
        borderColor: colors.white,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
    },
    registerMessageTitle: {
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeMedium,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightMedium,
        color: colors.black,
    },
    avisoPrivacidadContainer: {
        paddingTop: 18,
        width: 280,
        flexDirection: 'row',
        marginBottom: 20
    },
    registroCheckbox: {
        alignSelf: 'center'
    },
    avisoPrivacidadTexto: {
        marginTop: 19,
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightXYSmall,
        color: colors.black,
    },
    avisoPrivacidadTextoNegrita: {
        fontWeight: typography.fontWeightBold as any,
        lineHeight: typography.lineHeightXYSmall,
    },
    registryButton: {
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
    registryButtonText: {
        marginTop: -5,
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeLarge,
        letterSpacing: typography.letterSpacingMedium,
        color: colors.black,
    },
    registryLink: {
        marginTop: 10,
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightXYSmall,
        color: colors.black,
        textDecorationLine: 'underline'
    },
});
