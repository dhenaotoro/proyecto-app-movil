import { render, screen, waitFor } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { it, describe, jest } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import ListarPQRs from '../../../screens/ListarPQRs/ListarPQRs';

// Mock fetchUserData to simulate different states
jest.mock('../../../screens/ListarPQRs/mockBackend', () => ({
  fetchUserData: jest
    .fn()
    .mockImplementationOnce(() => new Promise(() => {})) // Simulates a pending promise for loading state
    .mockResolvedValueOnce([
      { status: 'Abierto', id: '000000001', channel: 'Email' },
      { status: 'Cerrado', id: '000000002', channel: 'Phone' },
    ]) // Mock data for loaded state
    .mockResolvedValueOnce([]), // Mock empty data response
}));

describe('ListarPQRs', () => {
  it('should show loading state before data is loaded', () => {
    // Render the component inside a NavigationContainer
    render(
      <NavigationContainer>
        <ListarPQRs />
      </NavigationContainer>
    );

    // Expect the loading message to be in the document
    expect(screen.getByText('Cargando PQRs...')).toBeTruthy();
  });

  it('should display the PQR data when it\'s successfully loaded', async () => {
    // Render the component inside a NavigationContainer
    render(
      <NavigationContainer>
        <ListarPQRs />
      </NavigationContainer>
    );

    // Wait for the data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Abierto')).toBeTruthy();
      expect(screen.getByText('000000001')).toBeTruthy();
      expect(screen.getByText('Email')).toBeTruthy();
      expect(screen.getByText('Cerrado')).toBeTruthy();
      expect(screen.getByText('000000002')).toBeTruthy();
      expect(screen.getByText('Phone')).toBeTruthy();
    });
  });

  it('should display a message when no PQRs are found', async () => {
    // Render the component inside a NavigationContainer
    render(
      <NavigationContainer>
        <ListarPQRs />
      </NavigationContainer>
    );

    // Wait for the "no PQRs" message to be displayed
    await waitFor(() => {
      expect(screen.getByText('No hay PQR solicitados, por favor crear tu primer PQR usando la opción de Registra tu PQR')).toBeTruthy();
    });
  });
});
