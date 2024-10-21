import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../styles/colors";
import React, { useState } from "react";
import typography from "../../styles/typography";
import { InputText } from "../../components/FormFields/InputText";
import { Amplify } from 'aws-amplify';
import { signIn, fetchUserAttributes, type SignInInput } from 'aws-amplify/auth';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import awsconfig from "../../aws-exports";
import AuthHeader from "../../components/Header/AuthHeader";

//, borderStyle: 'solid', borderWidth: 1, borderColor: 'blue'
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'ListarPQRs'>;
type LoginRouteProp = RouteProp<RootStackParamList, 'Login'>;
Amplify.configure(awsconfig);

export function Login(): React.JSX.Element  {
    const screen = 'Login';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<LoginRouteProp>();
    const { userId } = route.params;

    const handlePress = async () => {
        setLoading(true); // Mostrar el estado de carga

        try {
            // Llamada al método de AWS Cognito para iniciar sesión
            const { isSignedIn, nextStep }  = await signIn({ username: email, password} as SignInInput);
            console.log('Inicio de sesión exitoso:', isSignedIn);
            console.log('El siguiente paso es', nextStep);
            const userAttribute = await fetchUserAttributes();
            console.log('Los atributos son: ', userAttribute);
            // Aquí puedes redirigir al usuario a la pantalla principal
            navigation.navigate('ListarPQRs', { userUuid: userAttribute.sub, name: userAttribute.given_name });
        } catch (error) {
            console.debug('Error al iniciar sesión:', error);
            const userAttribute = await fetchUserAttributes();
            console.log('Error Los atributos son: ', userAttribute);
            if (error instanceof Error) {
                if (error.name === "UserAlreadyAuthenticatedException") {
                    navigation.navigate("ListarPQRs", { userUuid: userAttribute.sub, name: userAttribute.given_name });
                }
            }
            Alert.alert('Error', 'Correo o contraseña incorrectos');
        } finally {
            setLoading(false); // Detener el estado de carga
        }
    };
    
    return (
        <View>
        <AuthHeader />
        <View style={{...styles.loginContainer}} testID={screen}>
            <View style={styles.loginInnerContainer}>
                <View style={{height: 64}}>
                    <Text style={styles.loginMessageTitle}>Bienvenido(a), inicia sesión con tu correo y contraseña.</Text>
                </View>
                <View style={{height: 311}}>
                    <InputText label='Correo' required value={email} onInputChange={(text: string) => setEmail(text)} testID={`${screen}.Correo`}/>
                    <InputText label='Contraseña' required value={password} onInputChange={(text: string) => setPassword(text)} testID={`${screen}.Password`}/>
                    <Text style={styles.loginLink}>Olvidaste tu contraseña?</Text>
                </View>
                <View style={{height: 92}}>
                    <TouchableOpacity style={styles.loginButton} onPress={handlePress} aria-label='loginButton' testID={`${screen}.Button`}>
                        <Text style={styles.loginButtonText}>{loading ? 'Cargando...' : 'Ingresar'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{height: 189, paddingTop: 48}}>
                <Text style={{...styles.loginLink}} onPress={() => navigation.navigate('Register')}>No tienes cuenta? <Text style={{...styles.loginLink, fontFamily: typography.nunitoSanzBold, textDecorationLine: 'underline'}}>Regístrate</Text></Text>
            </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        backgroundColor: colors.white,
        paddingTop: 0,
        paddingHorizontal: 15,
        height: 'auto'
    },
    loginInnerContainer: {
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
    loginMessageTitle: {
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeMedium,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightMedium,
        color: colors.black,
    },
    loginLink: {
        marginTop: 19,
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightXYSmall,
        color: colors.black,
    },
    loginButton: {
        marginTop: 29,
        height: 36,
        backgroundColor: colors.white,
        borderColor: colors.brand_green,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        alignItems: 'center',
    },
    loginButtonText: {
        marginTop: -5,
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeLarge,
        letterSpacing: typography.letterSpacingMedium,
        color: colors.black,
    }
});
