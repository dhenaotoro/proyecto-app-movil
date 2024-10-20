import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputText } from "../../components/FormFields/InputText";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import React, { useState } from "react";
import { confirmSignUp } from "aws-amplify/auth";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import AuthHeader from "../../components/Header/AuthHeader";

type ActivactionCodeRouteProp = RouteProp<RootStackParamList, 'ActivationCode'>;

export function ActivationCode(): React.JSX.Element  {
    const screen = 'ActivationCode';
    const [codigoActivacion, setCodigoActivacion] = useState('');
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<ActivactionCodeRouteProp>();
    const { email } = route.params;

    const maskEmail = () => {
        if(email) {
            const [name, domain] = email.split('@');
            if (name.length < 3) {
                // Si el nombre es muy corto, solo muestra el primer carácter
                return `${name[0]}***@${domain}`;
            }
            // Mostrar las dos primeras letras, luego asteriscos y después el último carácter antes del @
            const maskedName = `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`;
            return `${maskedName}@${domain}`;
        }
        return '***@***.com';
    };

    const handlePress = async () => {
        try {
            setLoading(true);

            const { nextStep } = await confirmSignUp({
              username: email,
              confirmationCode: codigoActivacion,
            });
            console.log('Estado del usuario: ', nextStep);
            
            navigation.navigate("Login");
        } catch (error) {
            console.debug("Error confirmando el código:", error);
            Alert.alert("Error", "Error confirmando el código");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <AuthHeader />
            <View style={{...styles.container}} testID={screen}>
                <View style={styles.innerContainer}>
                    <View style={{height: 244}}>
                        <Text style={styles.messageTitle}>Se envió correo de confirmación al correo {maskEmail()} con el código de activación. Por favor verificalo en tu bandeja de entrada y registralo aquí abajo.</Text>
                    </View>
                    <View style={{height: 161}}>
                        <InputText label='Código de Activación' required value={codigoActivacion} onInputChange={(text: string) => setCodigoActivacion(text)} testID={`${screen}.CodigoActivacion`}/>
                    </View>
                    <View style={{height: 92}}>
                        <TouchableOpacity style={styles.button} onPress={handlePress} aria-label='activationCodeButton' testID={`${screen}.Button`}>
                            <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Continuar'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    }
});