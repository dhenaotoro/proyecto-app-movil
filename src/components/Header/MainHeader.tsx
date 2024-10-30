import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import typography from '../../styles/typography';
import { useMenuModal } from '../../context/MenuModalContext';

interface MainHeaderProps {
  showBackButton: boolean;
  showMenu: boolean;
  onBackPress?: () => void;
}

export default function MainHeader({ showBackButton, showMenu, onBackPress }: MainHeaderProps): React.JSX.Element  {
    const screen = 'MainHeader'
    const { openMenu } = useMenuModal();

    return (
        <View style={styles.mainHeaderContainer}>
          { showBackButton 
            ? (<TouchableOpacity style={styles.backButton} onPress={onBackPress} testID={`${screen}.CloseButton`}>
            <Icon name="window-close" size={20} color={colors.brand_brown} />
          </TouchableOpacity>)
            : (<></>)
          }
          <Text style={styles.titleMainHeader}>ABCall</Text>
          { showMenu 
            ? (<TouchableOpacity onPress={openMenu} style={styles.menuMainHeaderButton} testID={`${screen}.Button`}>
              <Icon name="menu" size={30} color={colors.brand_brown} />
            </TouchableOpacity>)
            : (<></>) }
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
    backButton: {
      position: 'absolute',
      top: 15,
      left: 15,
    },
});
