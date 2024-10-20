import React, { PropsWithRef } from 'react';
import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";

type InputTextProps = PropsWithRef<{
    label: string,
    required: boolean,
    value: string,
    onInputChange: Function,
    testID: string
}>;

export function InputText({label, required, value, onInputChange, testID}: InputTextProps): React.JSX.Element  {
    const defineLabel = () => {
        return `${label}${required ? '*': ''}`
    };
    
    return (
        <View style={styles.containerInput}>
            <Text style={styles.inputLabel}>{defineLabel()}</Text>
            <TextInput style={styles.textInput}
                value={value}
                onChangeText={nexText => onInputChange(nexText)}
                testID={testID}
                aria-label={label}
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
        borderStyle: 'solid'
    }
});