import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Auth/Login';
import { Register } from '../screens/Auth/Register';
import AuthHeader from '../components/Header/AuthHeader';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ header: AuthHeader }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}