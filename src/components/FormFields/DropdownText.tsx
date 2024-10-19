import React, { PropsWithRef } from 'react';
import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import { Picker } from '@react-native-picker/picker';

type DropdownTextProps = PropsWithRef<{
    label: string,
    required: boolean,
    value: string,
    valuesToShow: { [key: string]: string; },
    onChange: Function,
    testID: string
}>;

export function DropdownText({label, required, valuesToShow, value, onChange, testID}: DropdownTextProps): React.JSX.Element  {
    const defineLabel = () => {
        return `${label}${required ? '*': ''}`
    };
    return (
        <View style={styles.containerInput}>
            <Text style={styles.inputLabel}>{defineLabel()}</Text>
            <View style={{height: 60, justifyContent: 'center', borderColor: colors.brand_violet, borderWidth: 1, borderRadius: 5, marginBottom: 10}}>
                <Picker
                    testID={testID}
                    selectedValue={value}
                    onValueChange={(selectedValue) => onChange(selectedValue)}
                    mode="dropdown"
                    style={styles.picker}>
                        {Object.keys(valuesToShow).map((k: string, i, _) => (<Picker.Item testID={`DropdownText.Picker.Item-${i}`} key={i} label={valuesToShow[k]} value={k} />))}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerInput: {
        marginTop: 19,
    },
    inputLabel: {
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
        marginVertical: 5,
    },
    picker: {
        height: 41,
        backgroundColor: 'white'
    }
});