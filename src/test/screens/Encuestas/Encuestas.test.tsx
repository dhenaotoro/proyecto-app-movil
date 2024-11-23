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

describe('Encuestas Screen Navigation Tests', () => {
  const renderComponent = () => {
    return render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Encuestas"
            component={Encuestas}
            initialParams={{
              userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
              userName: 'Ivan Dario',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  it('navigates to EncuestaBot with correct parameters when "Encuesta satisfacción" is pressed', () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    renderComponent();

    // Simulate pressing "Encuesta satisfacción"
    fireEvent.press(screen.getByTestId('Encuestas.EncuestaBot.Encuesta satisfacción'));

    // Verify navigation with correct arguments
    expect(mockNavigate).toHaveBeenCalledWith('EncuestaBot', {
      userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
      nombreEncuesta: 'Encuesta satisfacción',
    });
  });

  it('navigates to Chatbot with correct parameters when "ChatbotButton" is pressed', () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  
    renderComponent();
  
    // Simulate pressing "ChatbotButton"
    fireEvent.press(screen.getByTestId('Encuestas.ChatbotButton'));
  
    // Verify navigation with only userUuid
    expect(mockNavigate).toHaveBeenCalledWith('Chatbot', {
      userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
    });
  });
  
});
