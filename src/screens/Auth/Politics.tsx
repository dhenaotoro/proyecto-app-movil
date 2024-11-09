import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

export function Politics(): React.JSX.Element {
    const screen = 'Politics';
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container} testID={screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Política y aviso de privacidad</Text>
                <Text testID={`${screen}.Introduction`} style={styles.text}>
                    En ABCall, nos comprometemos a proteger su privacidad y garantizar la seguridad de sus datos personales.
                    Este documento describe cómo recopilamos, utilizamos, y protegemos su información.
                    {"\n\n"}
                    1. Información que Recopilamos: Recopilamos diferentes tipos de datos personales cuando interactúa con
                    nuestros servicios, incluyendo:
                    {"\n"}Datos de contacto: como su nombre, dirección de correo electrónico y número de teléfono.
                    {"\n"}Datos de navegación: como su dirección IP, tipo de dispositivo, navegador, y páginas que ha visitado
                    en nuestro sitio.
                    {"\n"}Datos de uso: información sobre cómo utiliza nuestros productos y servicios.
                    {"\n"}Datos financieros: como detalles de su tarjeta de crédito o cuenta bancaria (en caso de que realice
                    compras en nuestro sitio).
                    {"\n\n"}
                    2. Cómo Usamos su Información: Utilizamos los datos personales que recopilamos para:
                    {"\n"}Proporcionar, personalizar y mejorar nuestros servicios.
                    {"\n"}Procesar sus pedidos, pagos y gestionar su cuenta.
                    {"\n"}Enviar notificaciones importantes, como actualizaciones de productos, cambios en términos y condiciones, o en nuestra política de privacidad.
                    {"\n"}Proporcionarle marketing personalizado sobre productos y servicios que puedan interesarle, siempre con su consentimiento previo.
                    {"\n"}Analizar el uso de nuestros sitios web y servicios para mejorar la experiencia de usuario.
                    {"\n"}Cumplir con nuestras obligaciones legales y resolver disputas.
                    {"\n\n"}
                    3. Cómo Compartimos su Información: No compartimos sus datos personales con terceros, excepto en los siguientes casos:
                    {"\n"}Con nuestros proveedores de servicios de confianza que nos ayudan a operar nuestro negocio y brindarle servicios (por ejemplo, plataformas de pago y empresas de envío).
                    {"\n"}Si es requerido por ley, para cumplir con una orden judicial o para proteger nuestros derechos legales.
                    {"\n\n"}
                    4. Seguridad de sus Datos: Implementamos medidas de seguridad apropiadas para proteger sus datos contra el acceso no autorizado, la alteración, divulgación o destrucción. Sin embargo, ningún sistema es completamente seguro, por lo que no podemos garantizar la seguridad absoluta de sus datos.
                    {"\n\n"}
                    5. Sus Derechos: Usted tiene el derecho a acceder, corregir, o eliminar sus datos personales. También puede solicitar la limitación o el cese del procesamiento de sus datos para ciertos fines, como el marketing. Para ejercer estos derechos, puede contactarnos a través de abcall@gmail.com.
                </Text>
                <TouchableOpacity testID={`${screen}.Button`} style={styles.button} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.buttonText}>Regresar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    title: {
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeLarge,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightMedium,
        color: colors.black,
        textAlign: 'center',
        marginBottom: 20,
    },
    text: {
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightMedium,
        color: colors.black,
        textAlign: 'left',
        marginBottom: 20,
    },
    button: {
        height: 36,
        backgroundColor: colors.white,
        borderColor: colors.brand_green,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeMedium,
        letterSpacing: typography.letterSpacingMedium,
        color: colors.black,
    },
});
