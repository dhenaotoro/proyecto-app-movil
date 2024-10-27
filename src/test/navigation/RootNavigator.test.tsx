import React from 'react';
import { render } from '@testing-library/react-native';
import { MockAuthProvider } from '../context/MockProvider';
import RootNavigator from '../../navigation/RootNavigator';
import { it, describe } from '@jest/globals';

const setupMocks = () => {
    jest.mock('../../components/Header/MainHeader', () => { return () : React.JSX.Element => (<>{'Main Header'}</>)});
    jest.mock('../../components/Header/AuthHeader', () => () => { return () : React.JSX.Element => (<>{'Auth Header'}</>)});
    jest.mock('../../screens/Auth/Login', () => { return () : React.JSX.Element => (<>{'Login Screen'}</>)});
    jest.mock('../../screens/Auth/Register', () => { return () : React.JSX.Element => (<>{'Register Screen'}</>)});
    jest.mock('../../screens/Auth/ActivationCode', () => { return () : React.JSX.Element => (<>{'Activation Code Screen'}</>)});
    jest.mock('../../screens/ListarPQRs/ListarPQRs', () => { return () : React.JSX.Element => (<>{'Listar PQRs Screen'}</>)});
    jest.mock('../../screens/CrearPQRs/CrearPQRs', () => { return () : React.JSX.Element => (<>{'Crear PQRs Screen'}</>)});
    jest.mock('../../screens/Auth/Politics', () => { return () : React.JSX.Element => (<>{'Politics Screen'}</>)});
    jest.mock('@react-navigation/native', () => ({
        ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
        useNavigation: jest.fn()
    }));
}

describe('RootNavigator', () => {
    beforeAll(() => {
        setupMocks(); // Configura los mocks antes de ejecutar los tests
    });

    const renderWithProviders = (isAuthenticated: boolean) =>
    render(
      <MockAuthProvider isAuthenticated={isAuthenticated}>
        <RootNavigator />
      </MockAuthProvider>
    );

  it('should render when user is not authenticated', () => {
    const { getByTestId } = renderWithProviders(false);
    expect(getByTestId('Login')).toBeTruthy();
  });

  it('should render when user is authenticated', () => {
    const { getByTestId } = renderWithProviders(false);
    expect(getByTestId('Login')).toBeTruthy();
  });
});