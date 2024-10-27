import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputText } from "../../components/FormFields/InputText";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import React, { useContext, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { AuthContext } from "../../context/AuthContext";

type ActivactionCodeRouteProp = RouteProp<RootStackParamList, 'ActivationCode'>;

export function ActivationCode(): React.JSX.Element  {
    const screen = 'ActivationCode';
    const [codigoActivacion, setCodigoActivacion] = useState('');
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { confirmSignUp } = useContext(AuthContext);
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
        setLoading(true);
        await confirmSignUp(email, codigoActivacion);
        navigation.navigate('Login');
        setLoading(false);
    }

    return (
        <View style={{...styles.activationCodeContainer}} testID={screen}>
            <View style={styles.activationCodeInnerContainer}>
                <View style={{height: 244}}>
                    <Text style={styles.activationCodeMessageTitle}>Se envió correo de confirmación al correo {maskEmail()} con el código de activación. Por favor verificalo en tu bandeja de entrada y registralo aquí abajo.</Text>
                </View>
                <View style={{height: 161}}>
                    <InputText label='Código de Activación' maxLength={10} required value={codigoActivacion} onInputChange={(text: string) => setCodigoActivacion(text)} testID={`${screen}.CodigoActivacion`}/>
                </View>
                <View style={{height: 92}}>
                    <TouchableOpacity style={styles.activationCodeButton} onPress={handlePress} aria-label='activationCodeButton' testID={`${screen}.Button`}>
                        <Text style={styles.activationCodeButtonText}>{loading ? 'Cargando...' : 'Continuar'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    activationCodeContainer: {
        backgroundColor: colors.white,
        paddingTop: 0,
        paddingHorizontal: 15,
        height: 'auto'
    },
    activationCodeInnerContainer: {
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
    activationCodeMessageTitle: {
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeMedium,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightMedium,
        color: colors.black,
    },
    activationCodeButton: {
        marginTop: 29,
        height: 36,
        backgroundColor: colors.white,
        borderColor: colors.brand_green,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        alignItems: 'center',
    },
    activationCodeButtonText: {
        marginTop: -5,
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeLarge,
        letterSpacing: typography.letterSpacingMedium,
        color: colors.black,
    }
});