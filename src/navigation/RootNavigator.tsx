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
import { MenuModalProvider } from '../context/MenuModalContext';
import { Chatbot } from '../screens/Chatbot/Chatbot';
import { Encuestas } from '../screens/Encuestas/Encuestas';
import { EncuestaBot } from '../screens/Encuestas/EncuestaBot';
import DatosPersonales from '../screens/Settings/DatosPersonales';
import Alertas from '../screens/Settings/Alertas';

export type RootStackParamList = { 
  Login: undefined,
  Register: undefined,
  ActivationCode: { email: string },
  ListarPQRs: { userUuid: string, userName: string, executeList: boolean },
  CrearPQRs: { userUuid: string, userName: string },
  Politics: undefined,
  Chatbot: { userUuid: string },
  Encuestas: { userUuid: string },
  EncuestaBot: { userUuid: string, nombreEncuesta: string },
  DatosPersonales: { userUuid: string, userName: string, email: string, telefono: string, direccion: string },
  Alertas: { userUuid: string, userName: string, enableSms: boolean, enableEmail: boolean, enableCalls: boolean },
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): React.JSX.Element {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <MenuModalProvider>
        <Stack.Navigator initialRouteName="Login" screenOptions={({ route, navigation }) => ({
          header: () => (
            isAuthenticated ? (
              <MainHeader
                showBackButton={route.name !== 'ListarPQRs'}
                showMenu={route.name !== 'Chatbot'}
                onBackPress={() => navigation.goBack()}
              />
            ) : (
              <AuthHeader />
            )
          )
        })}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ActivationCode" component={ActivationCode} />
          <Stack.Screen name="ListarPQRs" component={ListarPQRs} />
          <Stack.Screen name="CrearPQRs" component={CrearPQRs} />
          <Stack.Screen name="Politics" component={Politics} />
          <Stack.Screen name="Chatbot" component={Chatbot} />
          <Stack.Screen name="Encuestas" component={Encuestas} />
          <Stack.Screen name="EncuestaBot" component={EncuestaBot} />
          <Stack.Screen name="DatosPersonales" component={DatosPersonales} />
          <Stack.Screen name="Alertas" component={Alertas} />
        </Stack.Navigator>
      </MenuModalProvider>
    </NavigationContainer>
  );
}
