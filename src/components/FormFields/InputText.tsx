import React, { PropsWithRef } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";

type InputTextProps = PropsWithRef<{
    label: string;
    required: boolean;
    value: string;
    onInputChange: (text: string) => void;
    testID: string;
    maxLength: number | undefined;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    multiline?: boolean;
}>;

export function InputText({label, required, value, onInputChange, testID, maxLength, secureTextEntry = false, keyboardType = 'default', multiline = false}: InputTextProps): React.JSX.Element  {
    const defineLabel = () => {
        return `${label}${required ? '*': ''}`
    };
    
    return (
        <View style={styles.containerInput}>
            <Text style={styles.inputLabel}>{defineLabel()}</Text>
            <TextInput style={multiline ? styles.textArea : styles.textInput}
                value={value}
                onChangeText={nexText => onInputChange(nexText)}
                testID={testID}
                aria-label={label}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                maxLength={maxLength}
                multiline={multiline}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    containerInput: {
        marginTop: 19
    },
    inputLabel: {
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
    },
    textInput: {
        height: 41,
        borderColor: colors.brand_violet,
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'solid',
        color: colors.black,
    },
    textArea: {
        height: 100,
        borderColor: colors.brand_violet,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
    },
});