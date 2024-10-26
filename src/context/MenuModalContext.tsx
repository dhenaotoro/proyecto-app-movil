import React, { createContext, useContext, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../styles/colors';
import typography from '../styles/typography';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

interface MenuModalContextProps {
  openMenu: () => void;
  closeMenu: () => void;
}

const MenuModalContext = createContext<MenuModalContextProps | undefined>(undefined);

export const useMenuModal = () => {
  const context = useContext(MenuModalContext);
  if (!context) {
    throw new Error('useMenuModal debe usarse dentro de un MenuModalProvider');
  }
  return context;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const MenuModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigation = useNavigation<NavigationProps>();
  const { signOut } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSignOut = async () => {
    await signOut();
    navigation.navigate('Login');
    closeMenu();
  }

  return (
    <MenuModalContext.Provider value={{ openMenu, closeMenu }}>
      {children}

      {/* Modal de pantalla completa */}
      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeMenu}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={closeMenu} style={styles.modalCloseButton}>
            <Icon name="window-close" size={20} color={colors.brand_brown} />
          </TouchableOpacity>
          <View style={styles.modalMenuContent}>
            <TouchableOpacity style={styles.modalMenuButton}>
              <Icon name="account" size={24} color={colors.brand_brown} />
              <Text style={styles.modalMenuButtonText}>Tus datos personales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalMenuButton}>
              <Icon name="cog" size={24} color={colors.brand_brown} />
              <Text style={styles.modalMenuButtonText}>Alertas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalMenuButton} onPress={() => handleSignOut()}>
              <Icon name="logout" size={24} color={colors.brand_brown} />
              <Text style={styles.modalMenuButtonText}>Cierre sesión</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 16}}>
            <Text style={styles.modalAppVersionText}>Version 1.0.1</Text>
          </View>
        </View>
      </Modal>
    </MenuModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 30,
    left: 14,
  },
  modalMenuContent: {
    width: '100%',
    top: 73,
    padding: 14,
    alignItems: 'center',
  },
  modalAppVersionText: {
    marginLeft: 2,
    top: 269,
    color: colors.black,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    lineHeight: typography.lineHeightSmall,
    letterSpacing: typography.letterSpacingNothing,
  },
  modalMenuButton: {
    flexDirection: 'row',
    paddingLeft: 11,
    marginBottom: 23,
    backgroundColor: colors.white,
    elevation: 10,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    width: '100%',
    height: 60,
    alignItems: 'center',
  },
  modalMenuButtonText: {
    top: 1,
    marginLeft: 20,
    color: colors.black,
    fontFamily: typography.nunitoSanzMedium,
    fontSize: typography.fontSizeXYZSmall,
    lineHeight: typography.lineHeightXYZSmall,
    letterSpacing: typography.letterSpacingNothing,
  }
});
