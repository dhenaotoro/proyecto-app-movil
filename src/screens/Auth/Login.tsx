import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../styles/colors";
import React, { useContext, useState } from "react";
import typography from "../../styles/typography";
import { InputText } from "../../components/FormFields/InputText";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { AuthContext } from "../../context/AuthContext";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'ListarPQRs'>;

export function Login(): React.JSX.Element  {
    const screen = 'Login';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NavigationProps>();
    const { signIn, fetchUserAttributes } = useContext(AuthContext);

    const handlePress = async () => {
        const isSigned = await signIn(email, password);
        if (isSigned) {
            const { userUuid, userName } = await fetchUserAttributes();
            navigation.navigate("ListarPQRs", { userUuid, userName, executeList: true });
        }
    };
    
    return (
        <View style={{...styles.loginContainer}} testID={screen}>
            <View style={styles.loginInnerContainer}>
                <View style={{height: 64}}>
                    <Text style={styles.loginMessageTitle}>Bienvenido(a), inicia sesión con tu correo y contraseña.</Text>
                </View>
                <View style={{height: 311}}>
                    <InputText label='Correo' required maxLength={255} keyboardType="email-address" value={email} onInputChange={(text: string) => setEmail(text)} testID={`${screen}.Correo`}/>
                    <InputText label='Contraseña' maxLength={255} required secureTextEntry value={password} onInputChange={(text: string) => setPassword(text)} testID={`${screen}.Password`}/>
                    <Text style={styles.loginLink}>Olvidaste tu contraseña?</Text>
                </View>
                <View style={{height: 92}}>
                    <TouchableOpacity style={styles.loginButton} onPress={handlePress} aria-label='loginButton' testID={`${screen}.Button`}>
                        <Text style={styles.loginButtonText}>Ingresar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{height: 189, paddingTop: 48}}>
                <Text style={{...styles.loginLink}} onPress={() => navigation.navigate('Register')}>No tienes cuenta? <Text style={{...styles.loginLink, fontFamily: typography.nunitoSanzBold, textDecorationLine: 'underline'}}>Regístrate</Text></Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
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
        borderRadius: 8,
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
