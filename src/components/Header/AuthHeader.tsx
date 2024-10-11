import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import colors from "../../styles/colors";
import typography from "../../styles/typography";

export default function AuthHeader(): React.JSX.Element  {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ABCall</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingTop: 31,
      paddingLeft: 18
    },
    title: {
      color: colors.brand_brown,
      fontFamily: typography.nunitoSanzBold,
      fontSize: typography.fontSizeLarge,
      letterSpacing: typography.letterSpacingMedium,
      lineHeight: typography.lineHeightLarge
    }
});