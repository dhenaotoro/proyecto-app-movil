import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import typography from '../../styles/typography';
import { useMenuModal } from '../../context/MenuModalContext';

export default function MainHeader(): React.JSX.Element  {
    const screen = 'MainHeader'
    const { openMenu } = useMenuModal();

    return (
        <View style={styles.mainHeaderContainer}>
          <Text style={styles.titleMainHeader}>ABCall</Text>
          <TouchableOpacity onPress={openMenu} style={styles.menuMainHeaderButton} testID={`${screen}.Button`}>
            <Icon name="menu" size={30} color={colors.brand_brown} />
          </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainHeaderContainer: {
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      height: 48,
      paddingHorizontal: 15,
    },
    titleMainHeader: {
      color: colors.brand_brown,
      fontFamily: typography.nunitoSanzBold,
      fontSize: typography.fontSizeLarge,
      letterSpacing: typography.letterSpacingMedium,
      lineHeight: typography.lineHeightLarge,
    },
    menuMainHeaderButton: {
      position: 'absolute',
      top: 10,
      right: 15,
    },
});
