import React, { PropsWithRef } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type InputTextProps = PropsWithRef<{
    readonly label: string;
    readonly required: boolean;
    readonly value: string;
    readonly onInputChange: (text: string) => void;
    readonly testID: string;
    readonly maxLength: number | undefined;
    readonly secureTextEntry?: boolean;
    readonly keyboardType?: KeyboardTypeOptions;
    readonly multiline?: boolean;
    readonly showIcon?: boolean;
    readonly iconToShow?: string;
    readonly editable?: boolean;
    readonly onIconClick?: () => void;
}>;

export function InputText({label, required, value, onInputChange, testID, maxLength, secureTextEntry = false, keyboardType = 'default', multiline = false, showIcon = false, iconToShow = 'send', onIconClick = () => {}, editable = true}: InputTextProps): React.JSX.Element  {
    const defineLabel = () => {
        return `${label}${required ? '*': ''}`
    };
    
    return (
        <View style={styles.containerInput}>
            <Text style={styles.inputLabel}>{defineLabel()}</Text>
            <View>
                <TextInput style={multiline ? styles.textArea : {...styles.textInput, width: showIcon ? '90%': '100%', borderColor: editable ? colors.brand_violet : colors.brand_grey_light, backgroundColor: editable ? colors.white : colors.brand_grey_light }}
                    value={value}
                    onChangeText={nexText => onInputChange(nexText)}
                    testID={testID}
                    aria-label={label}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    multiline={multiline}
                    editable={editable}
                />
                { showIcon
                    ? (<TouchableOpacity onPress={onIconClick} style={styles.iconButton} testID={`${testID}.IconButton`}>
                        <Icon name={iconToShow} size={20} color={colors.brand_violet} />
                    </TouchableOpacity>)
                    : (<></>)
                }    
            </View>         
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
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'solid',
        color: colors.black,
        paddingLeft: 15,
    },
    textArea: {
        height: 100,
        borderColor: colors.brand_violet,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
    },
    iconButton: {
        position: 'absolute',
        top: 10,
        right: 5
    }
});