import { render, fireEvent, screen } from '@testing-library/react-native';
import { Encuestas } from '../../../screens/Encuestas/Encuestas';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

// Mock Navigation
const Stack = createNativeStackNavigator();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

describe('Encuestas', () => {
  const renderComponent = () => {
    return render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Encuestas"
            component={Encuestas}
            initialParams={{ userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'Ivan Dario' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  it('navigates to EncuestaBot when a survey is pressed', () => {
    const mockNavigate = jest.fn(); // Define mockNavigate for this test
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate }); // Mock useNavigation to return the mock function

    renderComponent();

    // Press on a survey description to navigate to EncuestaBot
    fireEvent.press(screen.getByTestId('Encuestas.EncuestaBot.Encuesta satisfacción'));

    // Verify that the mockNavigate function was called with the correct arguments
    expect(mockNavigate).toHaveBeenCalledWith('EncuestaBot', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45' });
  });

  it('navigates to EncuestaBot when a survey is pressed', () => {
    const mockNavigate = jest.fn(); // Define mockNavigate for this test
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate }); // Mock useNavigation to return the mock function

    renderComponent();

    // Press on a survey description to navigate to EncuestaBot
    fireEvent.press(screen.getByTestId('Encuestas.ChatbotButton'));

    // Verify that the mockNavigate function was called with the correct arguments
    expect(mockNavigate).toHaveBeenCalledWith('Chatbot', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45' });
  });
});
