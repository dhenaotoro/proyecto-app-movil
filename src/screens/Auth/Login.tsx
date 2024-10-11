import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../styles/colors";
import React, { useState } from "react";
import typography from "../../styles/typography";
import { InputText } from "../FormFields/InputText";
import Auth from 'aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/MainNavigator";

//, borderStyle: 'solid', borderWidth: 1, borderColor: 'blue'
type ListarPQRsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ListarPQRs'>;

export function Login(): React.JSX.Element  {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
    const navigation = useNavigation<ListarPQRsScreenNavigationProp>();

    const handlePress = async () => {
        setLoading(true); // Mostrar el estado de carga
        navigation.navigate('ListarPQRs');

       /* try {
            // Llamada al método de AWS Cognito para iniciar sesión
            const user = await Auth.signIn({ username: email, password });
            console.log('Inicio de sesión exitoso:', user);
            // Aquí puedes redirigir al usuario a la pantalla principal
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Alert.alert('Error', 'Correo o contraseña incorrectos');
        } finally {
            setLoading(false); // Detener el estado de carga
        }*/
    };
    
    return (
    <View style={{...styles.container}} testID='screen.Login'>
        <View style={styles.innerContainer}>
            <View style={{height: 64}}>
                <Text style={styles.messageTitle}>Bienvenido(a), inicia sesión con tu correo y contraseña.</Text>
            </View>
            <View style={{height: 311}}>
                <InputText label='Correo' required value={email} onInputChange={(text: string) => setEmail(text)}/>
                <InputText label='Contraseña' required value={password} onInputChange={(text: string) => setPassword(text)}/>
                <Text style={styles.link}>Olvidaste tu contraseña?</Text>
            </View>
            <View style={{height: 92}}>
                <TouchableOpacity style={styles.button} onPress={handlePress} aria-label='loginButton' testID='Login.loginButton'>
                    <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Ingresar'}</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={{height: 189, paddingTop: 48}}>
            <Text style={{...styles.link}}>No tienes cuenta? <Text style={{...styles.link, fontFamily: typography.nunitoSanzBold, textDecorationLine: 'underline'}}>Regístrate</Text></Text>
        </View>
    </View>
    );
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
    link: {
        marginTop: 19,
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightXYSmall,
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
