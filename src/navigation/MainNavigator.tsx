import React from 'react';
import MainHeader from '../components/Header/MainHeader';
import ListarPQRs from '../screens/ListarPQRs/ListarPQRs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = { ListarPQRs: undefined };
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: MainHeader }}>
      <Stack.Screen name="ListarPQRs" component={ListarPQRs} />
    </Stack.Navigator>
  );
}