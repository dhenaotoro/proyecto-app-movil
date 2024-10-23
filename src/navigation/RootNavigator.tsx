import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainHeader from '../components/Header/MainHeader';
import AuthHeader from '../components/Header/AuthHeader';
import { Login } from '../screens/Auth/Login';
import { Register } from '../screens/Auth/Register';
import ListarPQRs from '../screens/ListarPQRs/ListarPQRs';
import CrearPQRs from '../screens/CrearPQRs/CrearPQRs';
import { ActivationCode } from '../screens/Auth/ActivationCode';
import { Politics } from '../screens/Auth/Politics';

export type RootStackParamList = { 
  Login: undefined,
  Register: undefined,
  ActivationCode: { email: string },
  ListarPQRs: { userUuid: string, userName: string},
  CrearPQRs: { userUuid: string, userName: string },
  Politics: undefined
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): React.JSX.Element {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ header: isAuthenticated? AuthHeader : MainHeader }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ActivationCode" component={ActivationCode} />
        <Stack.Screen name="ListarPQRs" component={ListarPQRs} />
        <Stack.Screen name="CrearPQRs" component={CrearPQRs} />
        <Stack.Screen name="Politics" component={Politics} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
