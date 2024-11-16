import { Alert, StyleSheet, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import { updateUserChannels } from "../../services/Api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CheckBox from "@react-native-community/checkbox";

type AlertasRouteProp = RouteProp<RootStackParamList, 'Alertas'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'ListarPQRs'>;

const Alertas = (): React.JSX.Element => {
    const screen = 'Alertas';
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<AlertasRouteProp>();
    const { userUuid, userName, enableSms, enableEmail, enableCalls } = route.params;
    const [enableSmsToModify, setEnableSmsToModify] = useState<boolean>(enableSms);
    const [enableEmailToModify, setEnableEmailToModify] = useState<boolean>(enableEmail);
    const [enableCallsToModify, setEnableCallsToModify] = useState<boolean>(enableCalls);

    const handleGuardar = async () => {
      try {
        const response = await updateUserChannels(userUuid, { habilitar_sms: enableSmsToModify, habilitar_correo: enableEmailToModify, habilitar_llamada: enableCallsToModify });
        navigation.navigate('ListarPQRs', { userUuid, userName, executeList: false });
        Alert.alert('Guardado', response.message);
      } catch (error) {
        console.debug('error', error);
        Alert.alert('Error', 'Hubo un problema al guardar los canales de comunicación del usuario.');
      }
    };

    return (
        <View style={styles.alertasContainer} testID={screen}>
            <Text style={styles.title}>Alertas</Text>
            <View style={styles.formContent}>
                <View style={styles.checkboxContainer}>
                    <CheckBox testID={`${screen}.SmsCheckbox`} style={styles.checkbox} value={enableSmsToModify} onValueChange={setEnableSmsToModify}/>
                    <Text style={styles.checkboxText} testID={`${screen}.SmsText`}>Comunicar por SMS</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <CheckBox testID={`${screen}.EmailCheckbox`} style={styles.checkbox} value={enableEmailToModify} onValueChange={setEnableEmailToModify}/>
                    <Text style={styles.checkboxText} testID={`${screen}.EmailText`}>Comunicar por correo</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <CheckBox testID={`${screen}.CallCheckbox`} style={styles.checkbox} value={enableCallsToModify} onValueChange={setEnableCallsToModify}/>
                    <Text style={styles.checkboxText} testID={`${screen}.CallText`}>Comunicar por llamada</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.alertasButton} onPress={handleGuardar} testID={`${screen}.Button`}>
                <Text style={styles.alertasButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    alertasContainer: {
      flexGrow: 1,
      backgroundColor: colors.white,
      alignItems: 'center',
    },
    formContent: {
      top: 24,
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
      width: '80%',
      top: 24
    },
    alertasButton: {
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
    alertasButtonText: {
      marginTop: -5,
      fontFamily: typography.nunitoSanzBold,
      fontSize: typography.fontSizeLarge,
      letterSpacing: typography.letterSpacingMedium,
      color: colors.black,
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        top: 20,
    },
    checkbox: {
        alignSelf: 'center'
    },
    checkboxText: {
        marginTop: 4,
        marginLeft: 15,
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeXYSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightXYZSmall,
        color: colors.black,
    },
});

export default Alertas;