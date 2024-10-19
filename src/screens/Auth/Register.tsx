import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import { DropdownText } from "../../components/FormFields/DropdownText";
import React, { useState } from "react";
import { InputText } from "../../components/FormFields/InputText";
import CheckBox from "@react-native-community/checkbox";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { signUp, AuthError } from "aws-amplify/auth";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../../services/api";

export function Register(): React.JSX.Element  {
    const screen = 'Register';
    const tiposDocumentos: { [key: string]: string } = {
        'Cedula Ciudadania': 'Cedula de ciudadanía',
        'Carnet Diplomatico': 'Carnet diplomatico',
        'Tarjeta Identidad': 'Tarjeta de identidad',
        'Cedula Extranjeria': 'Cédula de extranjería'
    };
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [documento, setDocumento] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [aceptadaPoliticaYAvisoPrivacidad, setAceptadaPoliticaYAvisoPrivacidad] = useState(false);
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const getStatusPassword = () => {
        const minLength = 8;
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);

        if (password.length < minLength) return { status: false, message: "Debe tener al menos 8 caracteres." };
        if (!hasNumber) return { status: false, message: "Debe contener al menos un número." };
        if (!hasSpecialChar) return { status: false, message: "Debe contener al menos un carácter especial." };
        if (!hasUpperCase) return { status: false, message: "Debe contener al menos una letra mayúscula." };
        if (!hasLowerCase) return { status: false, message: "Debe contener al menos una letra minúscula." };
        return { status: true, message: "" };
    }

    const handlePress = async () => {
        if(getStatusPassword().status) {
            setLoading(true); // Mostrar el estado de carga

            try {
                // Llamada al método de AWS Cognito para crear usuario
                const { isSignUpComplete, userId, nextStep }  = await signUp({
                    username: correo,
                    password: password,
                    options: {
                        userAttributes: {
                            email: correo,
                            given_name: nombres,
                            family_name: apellidos,
                            phone_number: "+57" + telefono,
                        }
                    }
                });
                console.log('Se creó el usuario', userId);
                console.log('El siguiente paso es', nextStep);
    
                const userData = {
                    uuid: userId,
                    nombre: nombres,
                    apellido: apellidos,
                    email: correo,
                    telefono: telefono,
                    front: 'cliente',
                    address: direccion,
                    identification: documento,
                    identificationType: tipoDocumento
                };
                const response = await registerUser(userData);
                if (response.code === 201 && response.message === "Usuario creado correctamente") {
                    // Aquí puedes redirigir al usuario a la pantalla principal
                    navigation.navigate('ActivationCode', { email: correo }); 
                }
            } catch (error) {
                console.debug('Error al iniciar sesión:', (error as AuthError).underlyingError);
                Alert.alert('Error', 'Correo o contraseña incorrectos');
            } finally {
                setLoading(false); // Detener el estado de carga
            }
        } else {
            console.debug('Las contraseñas definidas no son iguales');
            Alert.alert('Error', 'Las contraseñas definidas no son iguales.');
        }
    };

    return (
    <View style={{...styles.container}} testID={screen}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
            <View style={{height: 64}}>
                <Text style={styles.messageTitle}>Gestiona tus PQRs rápidamente, registrate ya!</Text>
            </View>
            <View style={{height: 311}}>
                <DropdownText label='Tipo documento' required value={tipoDocumento} valuesToShow={tiposDocumentos} onChange={(selectedValue: string) => setTipoDocumento(selectedValue)} testID={`${screen}.TipoDocumento`}/>
                <InputText label='Documento' required value={documento} onInputChange={(text: string) => setDocumento(text)} testID={`${screen}.Documento`}/>
                <InputText label='Nombres' required value={nombres} onInputChange={(text: string) => setNombres(text)} testID={`${screen}.Nombres`}/>
                <InputText label='Apellidos' required value={apellidos} onInputChange={(text: string) => setApellido(text)} testID={`${screen}.Apellidos`}/>
                <InputText label='Teléfono' required value={telefono} onInputChange={(text: string) => setTelefono(text)} testID={`${screen}.Telefono`}/>
                <InputText label='Dirección' required value={direccion} onInputChange={(text: string) => setDireccion(text)} testID={`${screen}.Direccion`}/>
                <InputText label='Correo' required value={correo} onInputChange={(text: string) => setCorreo(text)} testID={`${screen}.Correo`}/>
                <InputText label='Contraseña' required value={password} onInputChange={(text: string) => setPassword(text)} testID={`${screen}.Password`}/>
                <InputText label='Repite tu contraseña' required value={repeatedPassword} onInputChange={(text: string) => setRepeatedPassword(text)} testID={`${screen}.PasswordRepeated`}/>
                <View style={styles.avisoPrivacidad}>
                    <CheckBox style={styles.checkbox} value={aceptadaPoliticaYAvisoPrivacidad} onValueChange={setAceptadaPoliticaYAvisoPrivacidad}/>
                    <Text style={styles.avisoPrivacidadTexto}>Acepto la <Text style={styles.avisoPrivacidadTextoNegrita}>política de privacidad</Text> y <Text style={styles.avisoPrivacidadTextoNegrita}>aviso de privacidad de datos</Text></Text>
                </View>
            </View>
            <View style={{height: 92}}>
                <TouchableOpacity style={styles.button} onPress={handlePress} aria-label='registerButton' testID={`${screen}.Button`}>
                    <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Confirmar'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        <View style={{height: 189, paddingTop: 48}}>
            <Text style={{...styles.link}} onPress={() => navigation.navigate('Login')}>Cancelar</Text>
        </View>
    </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingTop: 0,
        paddingHorizontal: 15,
        height: 'auto'
    },
    innerContainer: {
        backgroundColor: colors.white,
        paddingTop: 28,
        paddingHorizontal: 15,
        height: 'auto',
        elevation: 2,
        borderColor: colors.white,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
    },
    messageTitle: {
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeMedium,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightMedium,
        color: colors.black,
    },
    avisoPrivacidad: {
        marginTop: 19,
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightXYSmall,
        color: colors.black,
    },
    checkbox: {

    },
    avisoPrivacidadTexto: {

    },
    avisoPrivacidadTextoNegrita: {
        
    },
    button: {
        marginTop: 29,
        height: 36,
        backgroundColor: colors.white,
        borderColor: colors.brand_green,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        alignItems: 'center',
    },
    buttonText: {
        marginTop: -5,
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeLarge,
        letterSpacing: typography.letterSpacingMedium,
        color: colors.black,
    },
    link: {
        marginTop: 19,
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightXYSmall,
        color: colors.black,
    },
});
