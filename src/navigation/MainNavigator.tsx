import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainHeader from '../components/Header/MainHeader';
import { PQRList } from '../screens/Main/PQRList';


const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: MainHeader }}>
      <Stack.Screen name="Home" component={PQRList} />
    </Stack.Navigator>
  );
}