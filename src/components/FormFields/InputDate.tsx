import React, { PropsWithRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import DateTimePicker from '@react-native-community/datetimepicker';

type InputDateProps = PropsWithRef<{
    label: string;
    required: boolean;
    value: Date;
    onInputChange: (dateToReturn: Date | undefined) => void;
    testID: string;
}>;

export function InputDate({label, required, value, onInputChange, testID}: InputDateProps): React.JSX.Element  {
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const defineLabel = () => `${label}${required ? '*': ''}`;

    const inputDateChange = (date: Date | undefined) => {
        setShowDatePicker(false);
        if (date) onInputChange(date);
    }
    
    return (
        <View style={styles.containerInputDate}>
            <Text style={styles.inputDateLabel}>{defineLabel()}</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputDateButton} testID={testID}>
                <Text style={styles.inputDateButtonText}>{value.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    testID={`${testID}-Date-Picker`}
                    value={value}
                    mode="date"
                    display="default"
                    onChange={(_, date) => inputDateChange(date)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    containerInputDate: {
        marginTop: 19
    },
    inputDateLabel: {
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
    },
    inputDateButton: {
        height: 41,
        padding: 10,
        borderColor: colors.brand_violet,
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'solid',
        color: colors.black,
    },
    inputDateButtonText: {
        color: colors.black,
    },
});