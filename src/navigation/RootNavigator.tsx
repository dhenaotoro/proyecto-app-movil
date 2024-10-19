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

export type RootStackParamList = { Login: undefined, Register: undefined, ListarPQRs: undefined };
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): React.JSX.Element {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ header: isAuthenticated? AuthHeader : MainHeader }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ListarPQRs" component={ListarPQRs} />
        <Stack.Screen name="CrearPQRs" component={CrearPQRs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
