import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import { PropsWithoutRef } from "react";

type InputTextProps = PropsWithoutRef<{
    label: string,
    required: boolean,
    value: string,
    onInputChange: Function
}>;

export function InputText({label, required, value, onInputChange}: InputTextProps): React.JSX.Element  {
    const defineLabel = () => {
        return `${label}${required ? '*': ''}`
    };
    
    return (
        <View style={styles.containerInput}>
            <Text style={styles.inputLabel}>{defineLabel()}</Text>
            <TextInput style={styles.textInput}
                value={value}
                onChangeText={nexText => onInputChange(nexText)}
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
        borderRadius: 4,
        borderStyle: 'solid'
    }
});